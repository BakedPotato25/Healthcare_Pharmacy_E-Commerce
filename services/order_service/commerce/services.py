from decimal import Decimal

from django.db import transaction
from rest_framework.exceptions import ValidationError

from .external import fetch_product_snapshot
from .models import CartItem, Order, OrderItem


def add_cart_item(user_id, product_id, quantity):
    snapshot = fetch_product_snapshot(product_id)
    cart_item, created = CartItem.objects.get_or_create(
        user_id=user_id,
        product_id=product_id,
        defaults={**snapshot, "quantity": quantity},
    )
    if not created:
        for field, value in snapshot.items():
            setattr(cart_item, field, value)
        cart_item.quantity += quantity
        cart_item.save()
    return cart_item


@transaction.atomic
def checkout_cart(user_id, shipping_address=""):
    cart_items = list(CartItem.objects.filter(user_id=user_id).order_by("created_at"))
    if not cart_items:
        raise ValidationError({"cart": "Cart is empty."})

    total_amount = sum((item.line_total for item in cart_items), Decimal("0.00"))
    order = Order.objects.create(
        user_id=user_id,
        total_amount=total_amount,
        shipping_address=shipping_address,
    )

    order_items = [
        OrderItem(
            order=order,
            product_id=item.product_id,
            product_name=item.product_name,
            product_brand=item.product_brand,
            product_category=item.product_category,
            product_image_url=item.product_image_url,
            unit_price=item.unit_price,
            quantity=item.quantity,
            line_total=item.line_total,
        )
        for item in cart_items
    ]
    OrderItem.objects.bulk_create(order_items)
    CartItem.objects.filter(user_id=user_id).delete()
    return Order.objects.prefetch_related("items").get(id=order.id)

