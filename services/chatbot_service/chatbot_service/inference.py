import json
import logging
import re
from dataclasses import dataclass
from pathlib import Path
from threading import Lock
from urllib.parse import quote

import joblib
import requests
from django.conf import settings

logger = logging.getLogger("chatbot_service")

REQUIRED_ARTIFACTS = [
    "intent_model.pkl",
    "intent_vectorizer.pkl",
    "category_model.pkl",
    "category_vectorizer.pkl",
    "label_encoders.pkl",
    "model_metadata.json",
    "metrics.json",
]

CATEGORY_TO_SLUG = {
    "OTC Medicine": "otc-medicine",
    "Digestive Health": "digestive-health",
    "Vitamins & Minerals": "vitamins-minerals",
    "Mother & Baby": "mother-baby",
    "Personal Care": "personal-care",
    "Medical Devices": "medical-devices",
    "First Aid": "first-aid",
    "Skincare": "skincare",
    "Oral Care": "oral-care",
    "Nutrition & Health Food": "nutrition-health-food",
}

INTENT_CATEGORY_MAP = {
    "digestive_support": "Digestive Health",
    "vitamin_advice": "Vitamins & Minerals",
    "skincare_support": "Skincare",
    "oral_care_support": "Oral Care",
    "baby_care_support": "Mother & Baby",
    "first_aid_support": "First Aid",
    "medical_device_question": "Medical Devices",
}

DISCLAIMER = "This is a general product suggestion and does not replace advice from a doctor or pharmacist."
WARNING_REPLY = (
    "Your symptoms may require professional medical attention. Please contact a doctor, pharmacist, "
    "or emergency service instead of relying on product suggestions."
)

SEVERE_SYMPTOM_PATTERNS = [
    r"\bchest pain\b",
    r"\bcan't breathe\b",
    r"\bcannot breathe\b",
    r"\btrouble breathing\b",
    r"\bdifficulty breathing\b",
    r"\bshortness of breath\b",
    r"\bsevere bleeding\b",
    r"\buncontrolled bleeding\b",
    r"\bseizure\b",
    r"\bfainting\b",
    r"\bunconscious\b",
    r"\boverdose\b",
    r"\banaphylaxis\b",
    r"\bsuicidal\b",
    r"\bsuicide\b",
    r"\bstroke\b",
    r"\bheart attack\b",
    r"\bsevere allergic\b",
]

FALLBACK_CATEGORY_KEYWORDS = [
    ("Digestive Health", ["digest", "stomach", "diarrhea", "constipation", "probiotic", "fiber", "rehydration"]),
    ("Vitamins & Minerals", ["vitamin", "mineral", "supplement", "immune", "calcium", "iron", "energy"]),
    ("Skincare", ["skin", "acne", "moistur", "sunscreen", "cleanser", "rash"]),
    ("Oral Care", ["oral", "tooth", "teeth", "gum", "mouth", "floss", "toothpaste"]),
    ("Mother & Baby", ["baby", "infant", "mother", "diaper", "feeding", "child"]),
    ("First Aid", ["first aid", "bandage", "wound", "cut", "burn", "plaster"]),
    ("Medical Devices", ["device", "thermometer", "blood pressure", "monitor", "walker", "glucose"]),
    ("Personal Care", ["personal", "hygiene", "soap", "sanitizer", "deodorant"]),
    ("Nutrition & Health Food", ["nutrition", "protein", "meal", "food", "healthy snack"]),
    ("OTC Medicine", ["otc", "cold", "cough", "pain", "fever"]),
]


@dataclass
class ChatbotArtifacts:
    intent_model: object
    intent_vectorizer: object
    category_model: object
    category_vectorizer: object
    label_encoders: dict
    metadata: dict
    metrics: dict


class ChatbotEngine:
    def __init__(self):
        self._artifacts = None
        self._load_error = None
        self._lock = Lock()

    @property
    def is_loaded(self):
        self._ensure_loaded()
        return self._artifacts is not None

    @property
    def load_error(self):
        self._ensure_loaded()
        return self._load_error

    def chat(self, message, *, forced_category=None):
        normalized_message = self._normalize_message(message)
        if self._is_severe_symptom(normalized_message):
            return self._warning_response()

        prediction = self._predict_with_model(normalized_message)
        if prediction is None:
            prediction = self._fallback_prediction(normalized_message)

        if forced_category in CATEGORY_TO_SLUG:
            prediction["suggested_category"] = forced_category

        suggested_products = self._fetch_products(prediction["suggested_category"])
        reply = self._build_reply(
            intent=prediction["intent"],
            category=prediction["suggested_category"],
            products=suggested_products,
            model_loaded=prediction["model_loaded"],
        )

        return {
            "reply": reply,
            "intent": prediction["intent"],
            "suggested_category": prediction["suggested_category"],
            "suggested_products": suggested_products,
            "model_loaded": prediction["model_loaded"],
            "requires_medical_disclaimer": self._requires_disclaimer(prediction["intent"], prediction["suggested_category"]),
            "model_error": None if prediction["model_loaded"] else self._load_error,
        }

    def _ensure_loaded(self):
        if self._artifacts is not None or self._load_error is not None:
            return

        with self._lock:
            if self._artifacts is not None or self._load_error is not None:
                return

            artifact_dir = self._artifact_dir()
            missing = [name for name in REQUIRED_ARTIFACTS if not (artifact_dir / name).exists()]
            if missing:
                self._load_error = f"Missing chatbot artifacts: {', '.join(missing)}"
                logger.warning(self._load_error)
                return

            try:
                self._artifacts = ChatbotArtifacts(
                    intent_model=joblib.load(artifact_dir / "intent_model.pkl"),
                    intent_vectorizer=joblib.load(artifact_dir / "intent_vectorizer.pkl"),
                    category_model=joblib.load(artifact_dir / "category_model.pkl"),
                    category_vectorizer=joblib.load(artifact_dir / "category_vectorizer.pkl"),
                    label_encoders=joblib.load(artifact_dir / "label_encoders.pkl"),
                    metadata=json.loads((artifact_dir / "model_metadata.json").read_text(encoding="utf-8")),
                    metrics=json.loads((artifact_dir / "metrics.json").read_text(encoding="utf-8")),
                )
                logger.info("Loaded chatbot model artifacts from %s", artifact_dir)
            except Exception as exc:
                self._artifacts = None
                self._load_error = f"Failed to load chatbot artifacts: {exc}"
                logger.exception("Failed to load chatbot artifacts from %s", artifact_dir)

    def _artifact_dir(self):
        configured = Path(settings.CHATBOT_ARTIFACT_DIR)
        if configured.is_absolute():
            return configured
        return Path(settings.BASE_DIR) / configured

    def _predict_with_model(self, message):
        self._ensure_loaded()
        if self._artifacts is None:
            return None

        try:
            intent_vector = self._artifacts.intent_vectorizer.transform([message])
            encoded_intent = self._artifacts.intent_model.predict(intent_vector)
            intent = self._decode_label("intent", encoded_intent)[0]

            category = INTENT_CATEGORY_MAP.get(intent)
            if self._should_predict_category(intent):
                category_vector = self._artifacts.category_vectorizer.transform([message])
                encoded_category = self._artifacts.category_model.predict(category_vector)
                category = self._decode_label("category", encoded_category)[0]

            return {
                "intent": intent,
                "suggested_category": category,
                "model_loaded": True,
            }
        except Exception as exc:
            self._load_error = f"Model inference failed: {exc}"
            logger.exception("Model inference failed")
            return None

    def _decode_label(self, encoder_name, encoded_values):
        encoder = self._artifacts.label_encoders.get(encoder_name)
        if encoder is None:
            return [str(value) for value in encoded_values]
        return [str(value) for value in encoder.inverse_transform(encoded_values)]

    def _fallback_prediction(self, message):
        category = self._fallback_category(message)
        intent = self._fallback_intent(message, category)
        return {
            "intent": intent,
            "suggested_category": category,
            "model_loaded": False,
        }

    def _fallback_category(self, message):
        for category, keywords in FALLBACK_CATEGORY_KEYWORDS:
            if any(keyword in message for keyword in keywords):
                return category
        return None

    def _fallback_intent(self, message, category):
        if any(word in message for word in ["hello", "hi", "hey", "good morning", "good afternoon"]):
            return "greeting"
        if any(word in message for word in ["order", "tracking", "where is my order"]):
            return "order_status_question"
        if "shipping" in message or "delivery" in message:
            return "shipping_question"
        if "payment" in message or "paid" in message or "checkout" in message:
            return "payment_question"
        if category in INTENT_CATEGORY_MAP.values():
            for intent, mapped_category in INTENT_CATEGORY_MAP.items():
                if mapped_category == category:
                    return intent
        if category:
            return "category_recommendation"
        return "fallback"

    def _should_predict_category(self, intent):
        return intent in {
            "product_search",
            "category_recommendation",
            "digestive_support",
            "vitamin_advice",
            "skincare_support",
            "oral_care_support",
            "baby_care_support",
            "first_aid_support",
            "medical_device_question",
        }

    def _fetch_products(self, category):
        if not category:
            return []

        category_slug = CATEGORY_TO_SLUG.get(category)
        if not category_slug:
            return []

        base_url = settings.PRODUCT_SERVICE_URL.rstrip("/")
        url = f"{base_url}/api/products/?category={quote(category_slug)}&sort=name"
        try:
            response = requests.get(url, timeout=settings.PRODUCT_SERVICE_TIMEOUT_SECONDS)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as exc:
            logger.warning("Could not fetch suggested products for %s: %s", category, exc)
            return []

        products = data.get("results", data) if isinstance(data, dict) else data
        if not isinstance(products, list):
            return []

        return [
            {
                "id": product.get("id"),
                "name": product.get("name"),
                "brand": product.get("brand"),
                "category": product.get("category_name", category),
                "price": product.get("price"),
                "image_url": product.get("image_url"),
            }
            for product in products[:3]
        ]

    def _build_reply(self, *, intent, category, products, model_loaded):
        if intent == "greeting":
            return f"Hello. I can help you find general pharmacy product categories or explain order, payment, and shipping steps. {DISCLAIMER}"
        if intent == "order_status_question":
            return "You can check your order status from your order history page. Staff can update fulfillment and shipping status after checkout."
        if intent == "shipping_question":
            return "Shipping status may show pending, preparing, shipped, delivered, or cancelled. Check your order page for the latest shipment update."
        if intent == "payment_question":
            return "Payments in this academic demo are simulated. A payment can be pending, paid, failed, or cancelled."
        if intent == "fallback" and not category:
            source = "I could not load the trained model, but " if not model_loaded else ""
            return f"{source}I can only provide general pharmacy product guidance. Please ask about a product category, order, payment, or shipping. {DISCLAIMER}"

        if category:
            product_names = ", ".join(product["name"] for product in products if product.get("name"))
            product_text = f" Example products include {product_names}." if product_names else ""
            return f"You may want to look at {category} products.{product_text} {DISCLAIMER}"

        return f"I can provide general product suggestions for non-prescription pharmacy categories. {DISCLAIMER}"

    def _requires_disclaimer(self, intent, category):
        return bool(category) or intent in {
            "product_search",
            "category_recommendation",
            "digestive_support",
            "vitamin_advice",
            "skincare_support",
            "oral_care_support",
            "baby_care_support",
            "first_aid_support",
            "medical_device_question",
            "fallback",
            "greeting",
        }

    def _warning_response(self):
        return {
            "reply": WARNING_REPLY,
            "intent": "medical_warning",
            "suggested_category": None,
            "suggested_products": [],
            "model_loaded": self.is_loaded,
            "requires_medical_disclaimer": True,
            "model_error": self._load_error,
        }

    def _is_severe_symptom(self, message):
        return any(re.search(pattern, message) for pattern in SEVERE_SYMPTOM_PATTERNS)

    def _normalize_message(self, value):
        text = "" if value is None else str(value)
        text = text.lower().strip()
        text = re.sub(r"\s+", " ", text)
        return text


chatbot_engine = ChatbotEngine()
