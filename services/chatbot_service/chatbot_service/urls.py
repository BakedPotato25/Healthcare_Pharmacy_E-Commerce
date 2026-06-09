from django.contrib import admin
from django.urls import path

from .views import chat, health_check, recommend

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health"),
    path("api/chat/", chat, name="chat"),
    path("api/chat/recommend/", recommend, name="chat-recommend"),
]
