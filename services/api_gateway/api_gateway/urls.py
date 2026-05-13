from django.contrib import admin
from django.urls import path

from .views import health_check, proxy_request, service_health_check

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health"),
    path("health/services/", service_health_check, name="service-health"),
    path("api/", proxy_request, {"path": ""}, name="api-proxy-root"),
    path("api/<path:path>", proxy_request, name="api-proxy"),
]
