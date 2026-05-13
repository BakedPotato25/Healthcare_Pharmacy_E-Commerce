from django.contrib import admin

from .models import Shipment


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ("id", "order_id", "user_id", "recipient_name", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("id", "order_id", "user_id", "recipient_name", "phone")
    readonly_fields = ("created_at", "updated_at")
