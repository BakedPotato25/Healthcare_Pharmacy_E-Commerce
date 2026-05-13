from decimal import Decimal

from rest_framework import serializers

from .models import CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "user_id",
            "product_id",
            "product_name",
            "product_brand",
            "product_category",
            "product_image_url",
            "unit_price",
            "quantity",
            "line_total",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user_id",
            "product_id",
            "product_name",
            "product_brand",
            "product_category",
            "product_image_url",
            "unit_price",
            "line_total",
            "created_at",
            "updated_at",
        ]


class CartAddItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, default=1)


class CartUpdateItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=1)


class CartSerializer(serializers.Serializer):
    items = CartItemSerializer(many=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    item_count = serializers.IntegerField()


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_id",
            "product_name",
            "product_brand",
            "product_category",
            "product_image_url",
            "unit_price",
            "quantity",
            "line_total",
            "created_at",
            "updated_at",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user_id",
            "status",
            "total_amount",
            "payment_id",
            "payment_status",
            "shipment_id",
            "shipping_status",
            "shipping_address",
            "items",
            "created_at",
            "updated_at",
        ]


class CheckoutSerializer(serializers.Serializer):
    shipping_address = serializers.CharField()
    recipient_name = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)


def serialize_cart(items):
    total = sum((item.line_total for item in items), Decimal("0.00"))
    item_count = sum(item.quantity for item in items)
    return {
        "items": CartItemSerializer(items, many=True).data,
        "total_amount": total,
        "item_count": item_count,
    }
