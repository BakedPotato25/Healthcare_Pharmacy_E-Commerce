"""Generate self-seeded chatbot datasets for the pharmacy e-commerce demo.

The generated data is synthetic and intended only for academic model training.
It does not contain real patient data and is not medically validated.
"""

from __future__ import annotations

import csv
import random
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent
DATASET_DIR = ROOT_DIR / "datasets"
RANDOM_SEED = 42

CATEGORIES = [
    "OTC Medicine",
    "Digestive Health",
    "Vitamins & Minerals",
    "Mother & Baby",
    "Personal Care",
    "Medical Devices",
    "First Aid",
    "Skincare",
    "Oral Care",
    "Nutrition & Health Food",
]

CATEGORY_DESCRIPTIONS = {
    "OTC Medicine": "Non-prescription wellness products for common self-care needs.",
    "Digestive Health": "General digestive wellness products such as probiotics, fiber, and hydration support.",
    "Vitamins & Minerals": "Supplement products for general wellness routines.",
    "Mother & Baby": "Routine care products for parents, infants, and young children.",
    "Personal Care": "Daily hygiene and self-care products for home routines.",
    "Medical Devices": "Home-use monitoring and comfort devices for general tracking.",
    "First Aid": "Basic first aid supplies for minor home care needs.",
    "Skincare": "Skin cleansing, moisturizing, and sun-care products for daily care.",
    "Oral Care": "Toothbrushes, toothpaste, floss, and mouth care products.",
    "Nutrition & Health Food": "General nutrition and health food products for everyday routines.",
}

PRODUCTS_BY_CATEGORY = {
    "OTC Medicine": [
        ("Comfort Relief Tablets", "PharmaCare", "Non-prescription tablets for label-directed general self-care.", "6.99", 120),
        ("Everyday Cold Care Capsules", "MediWell", "OTC capsules for seasonal wellness browsing.", "8.49", 90),
        ("Gentle Throat Lozenges", "CarePlus", "Lozenges for general throat comfort.", "4.25", 150),
        ("Cooling Vapor Rub", "HealthNest", "Topical rub for comfort-focused home care.", "5.75", 80),
        ("Saline Nasal Spray", "ClearAir", "Drug-free saline spray for nasal moisture.", "7.10", 110),
        ("Digital Fever Strips", "TempEase", "Single-use temperature strips for basic home checks.", "3.95", 75),
        ("Non-Drowsy Allergy Tablets", "AllerEase", "OTC allergy support for label-directed use.", "9.80", 70),
        ("Children Comfort Syrup", "KidCare", "Pediatric comfort product for caregiver-managed routines.", "7.65", 65),
        ("Heat Therapy Patches", "FlexiCare", "Warming patches for comfort and relaxation.", "6.40", 95),
        ("Electrolyte Sachets", "HydraDay", "Powder sachets for hydration support.", "5.90", 130),
    ],
    "Digestive Health": [
        ("Daily Probiotic Capsules", "GutBalance", "Probiotic supplement for digestive wellness routines.", "14.99", 85),
        ("Fiber Blend Powder", "NutriFiber", "Mixable fiber powder for everyday nutrition support.", "12.50", 70),
        ("Oral Rehydration Salts", "HydraCare", "Electrolyte sachets for hydration support.", "4.80", 140),
        ("Digestive Enzyme Tablets", "DigestEase", "Supplement tablets for general digestive support.", "11.25", 80),
        ("Peppermint Comfort Tea", "HerbalWell", "Herbal tea for a gentle after-meal routine.", "6.75", 95),
        ("Ginger Chew Packs", "NatureBite", "Ginger-flavored chews for travel and daily comfort.", "5.30", 100),
        ("Prebiotic Fiber Gummies", "GutBalance", "Prebiotic gummies for general wellness routines.", "10.40", 90),
        ("Hydration Ready Drink", "HydraDay", "Ready-to-drink electrolyte beverage.", "3.60", 160),
        ("Sensitive Stomach Tea", "HerbalWell", "Caffeine-free tea blend for gentle daily use.", "7.20", 75),
        ("Digestive Wellness Kit", "PharmaCare", "Bundle of general digestive health products.", "18.95", 45),
    ],
    "Vitamins & Minerals": [
        ("Vitamin C Chewables", "VitaCore", "Chewable vitamin C supplement for general wellness.", "8.99", 120),
        ("Daily Multivitamin Tablets", "VitaCore", "Multivitamin product for adult daily routines.", "13.75", 100),
        ("Vitamin D3 Softgels", "SunWell", "Vitamin D supplement for general wellness support.", "10.95", 90),
        ("Calcium Plus Tablets", "BoneCare", "Calcium supplement for label-directed use.", "12.20", 85),
        ("Magnesium Capsules", "MineralPlus", "Magnesium supplement for label-directed use.", "11.80", 75),
        ("Iron Support Tablets", "MineralPlus", "Iron supplement for customers advised to use iron products.", "9.70", 65),
        ("Zinc Wellness Lozenges", "VitaCore", "Zinc supplement lozenges for wellness routines.", "6.50", 115),
        ("B-Complex Tablets", "EnergyWell", "B vitamin complex for supplement routines.", "10.30", 95),
        ("Kids Multivitamin Gummies", "KidVita", "Children's multivitamin gummies for caregiver-managed use.", "9.25", 105),
        ("Omega-3 Softgels", "HeartWise", "Omega-3 supplement for general nutrition support.", "15.60", 80),
    ],
    "Mother & Baby": [
        ("Baby Gentle Wash", "TinyCare", "Mild baby wash for routine bath time.", "7.99", 90),
        ("Baby Moisture Lotion", "TinyCare", "Gentle lotion for daily baby skincare routines.", "8.50", 85),
        ("Diaper Rash Cream", "BabyShield", "Barrier cream for caregiver-managed diaper care.", "6.75", 110),
        ("Infant Nasal Aspirator", "CareBaby", "Manual aspirator for caregiver use.", "9.40", 70),
        ("Baby Wipes Sensitive", "TinyCare", "Fragrance-free wipes for routine cleaning.", "4.95", 200),
        ("Nursing Pads Pack", "MamaCare", "Disposable nursing pads for daily parent care.", "6.20", 95),
        ("Baby Thermometer", "TempEase", "Digital thermometer for basic home temperature checks.", "12.80", 60),
        ("Bottle Cleaning Brush", "CareBaby", "Bottle brush for feeding accessory cleaning.", "5.40", 80),
        ("Toddler Toothbrush Set", "TinySmile", "Soft toothbrush set for toddler oral care routines.", "4.60", 100),
        ("Baby Care Starter Kit", "MamaCare", "Starter bundle of routine baby care essentials.", "21.90", 35),
    ],
    "Personal Care": [
        ("Antibacterial Hand Gel", "CleanGuard", "Hand hygiene gel for daily personal care.", "3.99", 180),
        ("Gentle Hand Wash", "CleanGuard", "Mild liquid soap for frequent hand washing.", "4.50", 150),
        ("Cotton Buds Pack", "PureCare", "Cotton buds for general personal care use.", "2.80", 220),
        ("Body Cleansing Wipes", "FreshEase", "Disposable cleansing wipes for travel and routines.", "5.25", 120),
        ("Deodorant Roll-On", "FreshEase", "Daily deodorant product for personal care.", "4.90", 100),
        ("Sensitive Shaving Gel", "SmoothCare", "Shaving gel for sensitive skin routines.", "6.35", 80),
        ("Disposable Face Masks", "CleanGuard", "General protective face masks for daily settings.", "7.75", 160),
        ("Moisturizing Body Wash", "PureCare", "Body wash for routine cleansing.", "6.80", 90),
        ("Travel Hygiene Kit", "PharmaCare", "Compact personal hygiene bundle for travel.", "11.99", 55),
        ("Hand Cream Tube", "SoftHands", "Moisturizing hand cream for daily comfort.", "4.25", 130),
    ],
    "Medical Devices": [
        ("Digital Blood Pressure Monitor", "HomeMed", "Home-use monitor for general blood pressure tracking.", "42.99", 35),
        ("Pulse Oximeter", "HomeMed", "Finger pulse oximeter for general wellness monitoring.", "28.50", 45),
        ("Digital Thermometer", "TempEase", "Digital thermometer for home temperature checks.", "9.99", 100),
        ("Reusable Hot Cold Pack", "FlexiCare", "Reusable pack for hot or cold comfort routines.", "8.20", 85),
        ("Adjustable Wrist Support", "FlexiCare", "Support wrap for general wrist comfort.", "12.75", 60),
        ("Nebulizer Accessory Kit", "BreatheWell", "Replacement accessory kit for compatible home devices.", "16.40", 40),
        ("Weekly Pill Organizer", "MediSort", "Organizer box for medication schedule management.", "5.95", 110),
        ("Walking Cane Grip", "MobilityCare", "Comfort grip accessory for compatible walking canes.", "7.60", 50),
        ("Digital Weighing Scale", "HomeMed", "Home scale for general body weight tracking.", "24.30", 55),
        ("First Response Timer", "CareTools", "Digital timer for home care routines.", "6.90", 75),
    ],
    "First Aid": [
        ("Adhesive Bandage Pack", "FirstCare", "Assorted bandages for minor cuts and scrapes.", "3.75", 240),
        ("Sterile Gauze Pads", "FirstCare", "Sterile gauze pads for basic first aid kits.", "4.80", 180),
        ("Medical Tape Roll", "CareTape", "Medical tape for securing dressings.", "2.90", 160),
        ("Antiseptic Wipes", "CleanGuard", "Antiseptic wipes for basic first aid cleaning.", "3.95", 210),
        ("Elastic Bandage Wrap", "FlexiCare", "Elastic wrap for general support and first aid kits.", "5.50", 120),
        ("Instant Cold Pack", "FirstCare", "Single-use cold pack for first aid comfort.", "4.70", 100),
        ("Tweezers and Scissors Set", "CareTools", "Basic tools for home first aid kits.", "6.40", 70),
        ("Burn Gel Sachets", "CoolAid", "Cooling gel sachets for minor home first aid use.", "5.90", 90),
        ("First Aid Box", "FirstCare", "Empty organizer box for first aid supplies.", "9.85", 65),
        ("Complete First Aid Kit", "FirstCare", "Assorted basic first aid supplies for home or travel.", "19.95", 50),
    ],
    "Skincare": [
        ("Daily Moisturizing Cream", "DermaSoft", "Moisturizer for everyday skincare routines.", "9.99", 110),
        ("Gentle Facial Cleanser", "DermaSoft", "Mild cleanser for routine face washing.", "8.75", 100),
        ("SPF 50 Sunscreen Lotion", "SunCare", "Broad-spectrum sunscreen for label-directed use.", "12.60", 95),
        ("Aloe Vera Gel", "NatureSkin", "Cooling aloe gel for general skin comfort.", "6.80", 130),
        ("Lip Balm SPF", "SunCare", "Lip balm with sun protection for daily care.", "3.90", 160),
        ("Sensitive Skin Lotion", "DermaCalm", "Fragrance-free lotion for sensitive skin routines.", "10.45", 80),
        ("Hydrating Face Mist", "NatureSkin", "Face mist for refreshing skincare routines.", "7.25", 75),
        ("Barrier Repair Cream", "DermaCalm", "Moisturizing cream for dry skin care routines.", "11.35", 70),
        ("Hand Repair Balm", "SoftHands", "Rich balm for dry hand comfort.", "5.95", 120),
        ("Skincare Travel Set", "DermaSoft", "Travel-size daily skincare essentials.", "14.90", 55),
    ],
    "Oral Care": [
        ("Soft Toothbrush Duo", "SmileCare", "Soft toothbrush set for daily oral hygiene.", "4.50", 160),
        ("Fluoride Toothpaste", "SmileCare", "Toothpaste for routine brushing.", "5.20", 150),
        ("Alcohol-Free Mouthwash", "FreshMouth", "Mouthwash for daily oral care routines.", "6.75", 110),
        ("Dental Floss Picks", "FreshMouth", "Floss picks for interdental cleaning.", "3.60", 180),
        ("Sensitive Toothpaste", "GentleSmile", "Toothpaste for sensitive oral care routines.", "6.95", 100),
        ("Tongue Cleaner", "SmileCare", "Tongue cleaner for daily oral hygiene.", "3.25", 130),
        ("Kids Toothpaste", "TinySmile", "Children's toothpaste for caregiver-supervised brushing.", "4.80", 120),
        ("Orthodontic Wax", "CareDental", "Wax for comfort with orthodontic appliances.", "2.95", 90),
        ("Denture Cleaning Tablets", "CareDental", "Cleaning tablets for denture care routines.", "7.40", 80),
        ("Oral Care Travel Kit", "FreshMouth", "Compact toothbrush, toothpaste, and floss kit.", "8.60", 75),
    ],
    "Nutrition & Health Food": [
        ("Protein Shake Vanilla", "NutriLife", "Ready-to-drink protein shake for nutrition routines.", "3.99", 140),
        ("High Fiber Snack Bars", "NutriLife", "Snack bars with fiber for everyday nutrition.", "6.95", 110),
        ("Low Sugar Granola", "DailyFuel", "Granola blend for breakfast and snack routines.", "7.80", 85),
        ("Meal Replacement Powder", "DailyFuel", "Nutrition powder for occasional meal replacement use.", "18.50", 60),
        ("Herbal Wellness Tea", "HerbalWell", "Caffeine-free tea for daily wellness routines.", "5.75", 115),
        ("Electrolyte Sports Drink", "HydraDay", "Electrolyte drink for hydration support.", "2.95", 180),
        ("Oat Nutrition Drink", "NutriLife", "Oat-based nutrition drink for daily routines.", "4.20", 120),
        ("Mixed Nuts Portion Pack", "DailyFuel", "Portion packs of mixed nuts for snacking.", "8.40", 90),
        ("Chia Seed Pouch", "NatureBite", "Chia seeds for adding to meals and drinks.", "6.30", 100),
        ("Nutrition Starter Bundle", "PharmaCare", "Bundle of general nutrition products for everyday use.", "22.75", 40),
    ],
}

INTENT_DEFINITIONS = [
    ("product_search", "Find named products or products matching a customer keyword.", "Do you carry {product}?"),
    ("category_recommendation", "Suggest a safe non-prescription product category for a general need.", "Which category should I browse for {need}?"),
    ("digestive_support", "General digestive wellness category guidance.", "What can I browse for digestive comfort?"),
    ("vitamin_advice", "General supplement category guidance without clinical claims.", "Can you suggest vitamins for my routine?"),
    ("skincare_support", "General skincare product category guidance.", "What skincare items help with daily moisturizing?"),
    ("oral_care_support", "General oral hygiene product guidance.", "What oral care products should I browse?"),
    ("baby_care_support", "Caregiver-managed mother and baby product guidance.", "What baby care products do you have?"),
    ("first_aid_support", "Basic home first aid product guidance.", "What should I add to a first aid kit?"),
    ("medical_device_question", "Home-use medical device product questions.", "Do you sell a digital thermometer?"),
    ("order_status_question", "Customer order status support.", "Where can I check my order status?"),
    ("shipping_question", "Shipping and delivery support.", "How can I track shipping?"),
    ("payment_question", "Simulated payment support.", "How does payment work in this demo?"),
    ("greeting", "Friendly conversation opening.", "Hello, can you help me?"),
    ("fallback", "Unclear or unsupported request.", "I am not sure what to ask."),
    ("medical_warning", "Severe symptom or unsafe medical request requiring professional help.", "I have severe chest pain, what product should I buy?"),
]

CATEGORY_INTENTS = {
    "digestive_support": "Digestive Health",
    "vitamin_advice": "Vitamins & Minerals",
    "skincare_support": "Skincare",
    "oral_care_support": "Oral Care",
    "baby_care_support": "Mother & Baby",
    "first_aid_support": "First Aid",
    "medical_device_question": "Medical Devices",
}

SAFE_RESPONSES = {
    "product_search": "You can browse matching product results in the catalog. This is general product information and does not replace advice from a doctor or pharmacist.",
    "category_recommendation": "Based on your general need, you may want to browse {category} products. This is only general product guidance and is not medical advice.",
    "digestive_support": "You may want to browse Digestive Health products such as probiotics, fiber, or oral rehydration options. This does not replace professional advice.",
    "vitamin_advice": "You may want to browse Vitamins & Minerals products for general supplement routines. Check labels and ask a pharmacist or doctor when unsure.",
    "skincare_support": "You may want to browse Skincare products such as cleansers, moisturizers, sunscreen, or gentle lotions. This is general product guidance only.",
    "oral_care_support": "You may want to browse Oral Care products such as toothpaste, floss, mouthwash, or toothbrushes for daily hygiene.",
    "baby_care_support": "You may want to browse Mother & Baby products for routine caregiver-managed care. Ask a pediatric professional for health concerns.",
    "first_aid_support": "You may want to browse First Aid products such as bandages, gauze, antiseptic wipes, or basic kits for minor home care.",
    "medical_device_question": "You may want to browse Medical Devices for home-use monitoring or comfort tools. Follow device instructions and ask a professional when unsure.",
    "order_status_question": "You can check order progress from the customer orders page after logging in.",
    "shipping_question": "You can review shipment status from your orders page. Staff can update shipment status in the staff shipping workspace.",
    "payment_question": "This academic demo uses simulated payments only. No real payment provider or real charge is used.",
    "greeting": "Hello. I can help with general product browsing, category suggestions, cart/order questions, shipping, or simulated payment support.",
    "fallback": "I can help with product categories, catalog search, orders, shipping, and simulated payment questions. Please avoid sharing sensitive health information.",
    "medical_warning": "Your symptoms may require professional medical attention. Please contact a doctor, pharmacist, or emergency service instead of relying on product suggestions.",
}


def slugify(value: str) -> str:
    return (
        value.lower()
        .replace("&", "and")
        .replace("/", " ")
        .replace("-", " ")
        .replace("'", "")
        .replace("  ", " ")
        .strip()
        .replace(" ", "-")
    )


def build_products() -> list[dict[str, object]]:
    products = []
    product_id = 1
    for category in CATEGORIES:
        for name, brand, description, price, stock in PRODUCTS_BY_CATEGORY[category]:
            products.append(
                {
                    "id": product_id,
                    "name": name,
                    "slug": slugify(name),
                    "category": category,
                    "brand": brand,
                    "description": description,
                    "price": price,
                    "stock": stock,
                    "image_url": f"https://example.com/images/products/{slugify(name)}.jpg",
                    "is_active": "true",
                }
            )
            product_id += 1
    return products


def build_intents() -> list[dict[str, str]]:
    return [
        {
            "intent": intent,
            "description": description,
            "example_utterance": example,
            "target_category": CATEGORY_INTENTS.get(intent, ""),
            "requires_medical_disclaimer": str(intent in medical_disclaimer_intents()).lower(),
        }
        for intent, description, example in INTENT_DEFINITIONS
    ]


def build_chatbot_training(products: list[dict[str, object]]) -> list[dict[str, object]]:
    rng = random.Random(RANDOM_SEED)
    rows = []
    category_products = {category: [product for product in products if product["category"] == category] for category in CATEGORIES}

    for index, product in enumerate(products):
        if index % 2 == 0:
            text = f"Do you have {product['name']}?"
        else:
            text = f"Show me products like {product['brand']} {product['name']}"
        rows.append(training_row(text, "product_search", product["category"]))

    for index in range(100):
        category = CATEGORIES[index % len(CATEGORIES)]
        need = category_need(category)
        rows.append(training_row(f"What category should I browse for {need}?", "category_recommendation", category))

    category_prompt_templates = {
        "digestive_support": [
            "I want general digestive comfort products",
            "Show options for hydration and stomach wellness",
            "What can I browse for fiber or probiotics",
            "I need digestive health products for a travel kit",
            "Suggest a category for mild after-meal comfort",
        ],
        "vitamin_advice": [
            "I want vitamins for a daily supplement routine",
            "Show general wellness supplements",
            "Which vitamin category should I browse",
            "I need mineral supplement options",
            "What can I buy for everyday supplement support",
        ],
        "skincare_support": [
            "I need skincare products for daily moisturizing",
            "Show sunscreen and gentle cleanser options",
            "What skincare category helps with dry skin care",
            "I want a simple face care routine",
            "Suggest skin comfort products",
        ],
        "oral_care_support": [
            "I need toothpaste and floss",
            "Show oral hygiene products",
            "What should I browse for mouth care",
            "I want a toothbrush and mouthwash",
            "Suggest oral care travel products",
        ],
        "baby_care_support": [
            "I need baby bath and lotion products",
            "Show caregiver-managed baby care items",
            "What can I browse for diaper care",
            "I want routine infant care supplies",
            "Suggest baby wipes and gentle wash",
        ],
        "first_aid_support": [
            "I need bandages and gauze",
            "What should go in a home first aid kit",
            "Show supplies for minor cuts",
            "I want antiseptic wipes and medical tape",
            "Suggest basic first aid products",
        ],
        "medical_device_question": [
            "Do you sell a digital thermometer",
            "Show home monitoring devices",
            "I want a blood pressure monitor",
            "What medical devices are available",
            "Do you carry pill organizers",
        ],
    }
    for intent, category in CATEGORY_INTENTS.items():
        prompts = category_prompt_templates[intent]
        for index in range(70):
            product = category_products[category][index % len(category_products[category])]
            prompt = prompts[index % len(prompts)]
            variants = [
                prompt,
                f"{prompt} such as {product['name']}",
                f"Can you recommend a product category for {prompt.lower()}",
            ]
            rows.append(training_row(rng.choice(variants), intent, category))

    support_prompts = {
        "order_status_question": [
            "Where can I check my order status",
            "Can you show my order history",
            "How do I know whether my order was created",
            "Where is the order confirmation page",
            "Can staff see my order for fulfillment",
        ],
        "shipping_question": [
            "How do I track shipping",
            "What does pending shipment mean",
            "Can staff update delivery status",
            "Where can I see if my package shipped",
            "What are the shipping statuses in this demo",
        ],
        "payment_question": [
            "How does payment work",
            "Is this a real card payment",
            "Can I confirm a simulated payment",
            "What does pending payment mean",
            "Do you charge real money in this demo",
        ],
        "greeting": [
            "hello",
            "hi pharmacist assistant",
            "good morning can you help",
            "hey I need product guidance",
            "can you help me shop",
        ],
        "fallback": [
            "tell me something random",
            "I do not know what I need",
            "can you handle unrelated questions",
            "what should I type here",
            "I need help but not sure where to start",
        ],
        "medical_warning": [
            "I have severe chest pain what product should I buy",
            "I cannot breathe and want an over the counter suggestion",
            "I fainted and need a product recommendation",
            "I have heavy bleeding should I just buy bandages",
            "I think this is an emergency but want to avoid professional care",
        ],
    }
    for intent, prompts in support_prompts.items():
        for index in range(70):
            prompt = prompts[index % len(prompts)]
            suffixes = ["", " please", " in the app", " for the academic demo", " without sharing private health data"]
            rows.append(training_row(f"{prompt}{suffixes[index % len(suffixes)]}", intent, ""))

    return rows


def build_recommendation_training(products: list[dict[str, object]]) -> list[dict[str, object]]:
    rows = []
    category_products = {category: [product for product in products if product["category"] == category] for category in CATEGORIES}
    for category in CATEGORIES:
        product_ids = [str(product["id"]) for product in category_products[category][:4]]
        product_names = [str(product["name"]) for product in category_products[category][:4]]
        prompts = [
            f"Recommend products from {category}",
            f"What should I browse for {category.lower()}",
            f"Show general pharmacy products for {category.lower()}",
            f"I need safe non-prescription product ideas for {category.lower()}",
            f"Which catalog items fit {category.lower()} needs",
        ]
        for prompt in prompts:
            rows.append(
                {
                    "text": prompt,
                    "target_category": category,
                    "recommended_product_ids": "|".join(product_ids),
                    "recommended_product_names": "|".join(product_names),
                    "safe_response_template": SAFE_RESPONSES["category_recommendation"].format(category=category),
                }
            )
    return rows


def training_row(text: str, intent: str, target_category: object) -> dict[str, object]:
    category = str(target_category or "")
    response = SAFE_RESPONSES[intent].format(category=category or "healthcare")
    return {
        "text": text,
        "intent": intent,
        "target_category": category,
        "safe_response_template": response,
        "requires_medical_disclaimer": str(intent in medical_disclaimer_intents()).lower(),
    }


def medical_disclaimer_intents() -> set[str]:
    return {
        "product_search",
        "category_recommendation",
        "digestive_support",
        "vitamin_advice",
        "skincare_support",
        "oral_care_support",
        "baby_care_support",
        "first_aid_support",
        "medical_device_question",
        "medical_warning",
    }


def category_need(category: str) -> str:
    needs = {
        "OTC Medicine": "non-prescription cold or allergy comfort",
        "Digestive Health": "probiotics, fiber, or hydration support",
        "Vitamins & Minerals": "daily supplement routines",
        "Mother & Baby": "baby bath, wipes, or caregiver supplies",
        "Personal Care": "hand hygiene and daily care",
        "Medical Devices": "home-use monitoring tools",
        "First Aid": "minor cut and scrape supplies",
        "Skincare": "moisturizer, cleanser, or sunscreen",
        "Oral Care": "toothbrush, toothpaste, or floss",
        "Nutrition & Health Food": "nutrition drinks or snack products",
    }
    return needs[category]


def write_csv(path: Path, rows: list[dict[str, object]], fieldnames: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> None:
    products = build_products()
    intents = build_intents()
    chatbot_training = build_chatbot_training(products)
    recommendation_training = build_recommendation_training(products)

    write_csv(
        DATASET_DIR / "products_seed.csv",
        products,
        ["id", "name", "slug", "category", "brand", "description", "price", "stock", "image_url", "is_active"],
    )
    write_csv(
        DATASET_DIR / "chatbot_intents_seed.csv",
        intents,
        ["intent", "description", "example_utterance", "target_category", "requires_medical_disclaimer"],
    )
    write_csv(
        DATASET_DIR / "chatbot_training_seed.csv",
        chatbot_training,
        ["text", "intent", "target_category", "safe_response_template", "requires_medical_disclaimer"],
    )
    write_csv(
        DATASET_DIR / "recommendation_training_seed.csv",
        recommendation_training,
        ["text", "target_category", "recommended_product_ids", "recommended_product_names", "safe_response_template"],
    )

    print(f"Wrote {len(products)} products")
    print(f"Wrote {len(intents)} intents")
    print(f"Wrote {len(chatbot_training)} chatbot training examples")
    print(f"Wrote {len(recommendation_training)} recommendation training examples")


if __name__ == "__main__":
    main()
