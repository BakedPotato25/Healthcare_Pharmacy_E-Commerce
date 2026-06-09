from ipaddress import ip_address, ip_network
from urllib.parse import urlparse

from django.conf import settings
from django.http import HttpResponse


PRIVATE_NETWORKS = (
    ip_network("10.0.0.0/8"),
    ip_network("172.16.0.0/12"),
    ip_network("192.168.0.0/16"),
)


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
        if origin in settings.CORS_ALLOWED_ORIGINS:
            return True
        return bool(origin and settings.DEBUG and self._is_vite_dev_origin(origin))

    def _is_vite_dev_origin(self, origin):
        parsed = urlparse(origin)
        if parsed.scheme not in {"http", "https"}:
            return False

        host = parsed.hostname or ""
        port = parsed.port
        if port not in range(5173, 5180):
            return False

        if host in {"localhost", "127.0.0.1"}:
            return True

        # Vite often prints a private network URL for mobile/LAN testing.
        try:
            address = ip_address(host)
        except ValueError:
            return False
        return any(address in network for network in PRIVATE_NETWORKS)
