from rest_framework.decorators import api_view
from rest_framework.response import Response

from .inference import CATEGORY_TO_SLUG, chatbot_engine


@api_view(["GET"])
def health_check(request):
    return Response({"service": "chatbot_service", "status": "ok"})


@api_view(["POST"])
def chat(request):
    message = request.data.get("message", "")
    if not str(message).strip():
        return Response({"detail": "message is required."}, status=400)

    return Response(chatbot_engine.chat(message))


@api_view(["POST"])
def recommend(request):
    message = request.data.get("message", "")
    category = request.data.get("category")

    if category and category not in CATEGORY_TO_SLUG:
        return Response(
            {
                "detail": "category must match one of the supported chatbot categories.",
                "supported_categories": list(CATEGORY_TO_SLUG.keys()),
            },
            status=400,
        )

    if not str(message).strip() and not category:
        return Response({"detail": "message or category is required."}, status=400)

    return Response(chatbot_engine.chat(message or category, forced_category=category))
