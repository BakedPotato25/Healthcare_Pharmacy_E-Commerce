import requests
from django.conf import settings


def get_request_user_role(request):
    authorization = request.headers.get("Authorization")
    if not authorization:
        return None

    try:
        response = requests.get(
            f"{settings.USER_SERVICE_URL.rstrip('/')}/api/auth/me/",
            headers={"Authorization": authorization},
            timeout=settings.USER_SERVICE_TIMEOUT_SECONDS,
        )
    except requests.RequestException:
        return None

    if response.status_code != 200:
        return None

    return response.json().get("role")


def request_is_staff_or_admin(request):
    return get_request_user_role(request) in {"staff", "admin"}

