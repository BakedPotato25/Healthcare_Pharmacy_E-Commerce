from django.contrib import admin

from .models import CartItem, Order, OrderItem


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "user_id", "product_id", "product_name", "quantity", "unit_price")
    search_fields = ("product_name", "product_brand", "product_category")
    list_filter = ("product_category", "product_brand")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("line_total",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user_id", "status", "total_amount", "created_at")
    search_fields = ("id", "user_id")
    list_filter = ("status", "created_at")
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product_id", "product_name", "quantity", "line_total")
    search_fields = ("product_name", "product_brand", "product_category")

