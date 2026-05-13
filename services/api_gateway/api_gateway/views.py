import logging
from urllib.parse import urlsplit, urlunsplit

import requests
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger("api_gateway")

ROUTE_SERVICE_MAP = {
    "auth": "user_service",
    "users": "user_service",
    "categories": "product_service",
    "products": "product_service",
    "cart": "order_service",
    "orders": "order_service",
    "payments": "payment_service",
    "shipments": "shipping_service",
    "chat": "chatbot_service",
}

HOP_BY_HOP_HEADERS = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "host",
    "content-length",
    "content-encoding",
}


@api_view(["GET"])
def health_check(request):
    return Response({"service": "api_gateway", "status": "ok"})


@api_view(["GET"])
def service_health_check(request):
    services = {}
    overall_status = "ok"

    for service_name, base_url in settings.SERVICE_URLS.items():
        health_url = f"{base_url.rstrip('/')}/health/"
        try:
            downstream_response = requests.get(
                health_url,
                timeout=settings.GATEWAY_REQUEST_TIMEOUT_SECONDS,
            )
            service_status = "ok" if downstream_response.ok else "error"
            services[service_name] = {
                "status": service_status,
                "status_code": downstream_response.status_code,
            }
            if not downstream_response.ok:
                overall_status = "degraded"
        except requests.RequestException as exc:
            services[service_name] = {
                "status": "unreachable",
                "error": str(exc),
            }
            overall_status = "degraded"

    return Response(
        {
            "service": "api_gateway",
            "status": overall_status,
            "services": services,
        }
    )


@csrf_exempt
def proxy_request(request, path=""):
    route_key = _route_key(path)
    service_name = ROUTE_SERVICE_MAP.get(route_key)
    if not service_name:
        return JsonResponse(
            {
                "detail": "No gateway route is configured for this API path.",
                "path": f"/api/{path}",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    base_url = settings.SERVICE_URLS[service_name]
    target_url = _build_target_url(base_url, path, request.META.get("QUERY_STRING", ""))
    headers = _forward_headers(request)

    logger.info(
        "forwarding method=%s path=/api/%s service=%s target=%s",
        request.method,
        path,
        service_name,
        target_url,
    )

    try:
        downstream_response = requests.request(
            method=request.method,
            url=target_url,
            headers=headers,
            data=request.body,
            timeout=settings.GATEWAY_REQUEST_TIMEOUT_SECONDS,
            allow_redirects=False,
        )
    except requests.Timeout:
        logger.warning("timeout method=%s path=/api/%s service=%s", request.method, path, service_name)
        return JsonResponse(
            {"detail": f"{service_name} did not respond before the gateway timeout."},
            status=status.HTTP_504_GATEWAY_TIMEOUT,
        )
    except requests.RequestException as exc:
        logger.warning(
            "unreachable method=%s path=/api/%s service=%s error=%s",
            request.method,
            path,
            service_name,
            exc,
        )
        return JsonResponse(
            {"detail": f"{service_name} is unavailable.", "error": str(exc)},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    response = HttpResponse(
        downstream_response.content,
        status=downstream_response.status_code,
    )
    for header, value in downstream_response.headers.items():
        if header.lower() in HOP_BY_HOP_HEADERS:
            continue
        if header.lower() == "location":
            value = _rewrite_location_header(value, base_url)
        response[header] = value

    return response


def _route_key(path):
    return path.strip("/").split("/", 1)[0]


def _build_target_url(base_url, path, query_string):
    target_path = f"/api/{path}".replace("//", "/")
    target_url = f"{base_url.rstrip('/')}{target_path}"
    if query_string:
        target_url = f"{target_url}?{query_string}"
    return target_url


def _forward_headers(request):
    headers = {}
    for header, value in request.headers.items():
        if header.lower() in HOP_BY_HOP_HEADERS:
            continue
        headers[header] = value
    return headers


def _rewrite_location_header(location, base_url):
    if not location.startswith(base_url):
        return location

    parsed_location = urlsplit(location)
    public_path = parsed_location.path
    return urlunsplit(("", "", public_path, parsed_location.query, parsed_location.fragment))
