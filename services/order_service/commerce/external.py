from decimal import Decimal

import requests
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed, ValidationError


def get_user_context(request):
    authorization = request.headers.get("Authorization")
    if not authorization:
        raise AuthenticationFailed("Authentication credentials were not provided.")

    try:
        response = requests.get(
            f"{settings.USER_SERVICE_URL.rstrip('/')}/api/auth/me/",
            headers={"Authorization": authorization},
            timeout=settings.USER_SERVICE_TIMEOUT_SECONDS,
        )
    except requests.RequestException as exc:
        raise AuthenticationFailed("Unable to validate user token.") from exc

    if response.status_code != 200:
        raise AuthenticationFailed("Invalid or expired authentication token.")

    user = response.json()
    return {
        "id": user["id"],
        "email": user.get("email", ""),
        "username": user.get("username", ""),
        "role": user["role"],
    }


def require_customer(user):
    if user["role"] != "customer":
        raise AuthenticationFailed("A customer account is required for this action.")


def is_staff_or_admin(user):
    return user["role"] in {"staff", "admin"}


def fetch_product_snapshot(product_id):
    try:
        response = requests.get(
            f"{settings.PRODUCT_SERVICE_URL.rstrip('/')}/api/products/{product_id}/",
            timeout=settings.PRODUCT_SERVICE_TIMEOUT_SECONDS,
        )
    except requests.RequestException as exc:
        raise ValidationError({"product_id": "Unable to fetch product details."}) from exc

    if response.status_code == 404:
        raise ValidationError({"product_id": "Product was not found or is inactive."})
    if response.status_code != 200:
        raise ValidationError({"product_id": "Product service rejected this product."})

    product = response.json()
    return {
        "product_id": product["id"],
        "product_name": product["name"],
        "product_brand": product["brand"],
        "product_category": product.get("category_name") or str(product.get("category", "")),
        "product_image_url": product.get("image_url", ""),
        "unit_price": Decimal(str(product["price"])),
    }


def create_payment(order):
    payload = {
        "order_id": order.id,
        "user_id": order.user_id,
        "amount": str(order.total_amount),
    }
    try:
        response = requests.post(
            f"{settings.PAYMENT_SERVICE_URL.rstrip('/')}/api/payments/",
            json=payload,
            timeout=settings.PAYMENT_SERVICE_TIMEOUT_SECONDS,
        )
    except requests.RequestException as exc:
        raise ValidationError({"payment": "Unable to create payment. Payment service is unavailable."}) from exc

    if response.status_code != 201:
        raise ValidationError(
            {
                "payment": "Unable to create payment. Payment service rejected the request.",
                "payment_service_response": _safe_response_body(response),
            }
        )

    return response.json()


def cancel_payment(payment_id):
    try:
        response = requests.post(
            f"{settings.PAYMENT_SERVICE_URL.rstrip('/')}/api/payments/{payment_id}/cancel/",
            timeout=settings.PAYMENT_SERVICE_TIMEOUT_SECONDS,
        )
    except requests.RequestException:
        return False

    return response.status_code in {200, 204}


def create_shipment(order, recipient_name, phone, address, authorization):
    payload = {
        "order_id": order.id,
        "user_id": order.user_id,
        "recipient_name": recipient_name,
        "phone": phone,
        "address": address,
    }
    headers = {"Authorization": authorization} if authorization else {}

    try:
        response = requests.post(
            f"{settings.SHIPPING_SERVICE_URL.rstrip('/')}/api/shipments/",
            json=payload,
            headers=headers,
            timeout=settings.SHIPPING_SERVICE_TIMEOUT_SECONDS,
        )
    except requests.RequestException as exc:
        raise ValidationError({"shipping": "Unable to create shipment. Shipping service is unavailable."}) from exc

    if response.status_code != 201:
        raise ValidationError(
            {
                "shipping": "Unable to create shipment. Shipping service rejected the request.",
                "shipping_service_response": _safe_response_body(response),
            }
        )

    return response.json()


def _safe_response_body(response):
    try:
        return response.json()
    except ValueError:
        return response.text[:500]
