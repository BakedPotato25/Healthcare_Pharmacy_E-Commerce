from django.contrib import admin
from django.urls import include, path

from accounts.views import UserListView

from .views import health_check

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health"),
    path("api/auth/", include("accounts.urls")),
    path("api/users/", UserListView.as_view(), name="user-list"),
]
