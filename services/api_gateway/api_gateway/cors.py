from django.conf import settings
from django.http import HttpResponse


class SimpleCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)

        origin = request.headers.get("Origin")
        if self._origin_allowed(origin):
            response["Access-Control-Allow-Origin"] = "*" if settings.CORS_ALLOW_ALL_ORIGINS else origin
            response["Vary"] = "Origin"
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = (
                "Authorization, Content-Type, Accept, Origin, X-Requested-With"
            )
            response["Access-Control-Max-Age"] = "86400"

        return response

    def _origin_allowed(self, origin):
        if settings.CORS_ALLOW_ALL_ORIGINS:
            return True
        return bool(origin and origin in settings.CORS_ALLOWED_ORIGINS)
