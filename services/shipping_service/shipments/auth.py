import requests
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied


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


def is_staff_or_admin(user):
    return user["role"] in {"staff", "admin"}


def require_staff_or_admin(user):
    if not is_staff_or_admin(user):
        raise PermissionDenied("A staff or admin account is required for this action.")


def require_shipment_access(user, shipment):
    if is_staff_or_admin(user):
        return
    if user["role"] == "customer" and shipment.user_id == user["id"]:
        return
    raise PermissionDenied("You do not have permission to access this shipment.")
