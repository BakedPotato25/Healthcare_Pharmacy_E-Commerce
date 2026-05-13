from django.urls import path

from .views import (
    CartClearView,
    CartItemCreateView,
    CartItemDetailView,
    CartView,
    CheckoutView,
    OrderDetailView,
    OrderListView,
)

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", CartItemCreateView.as_view(), name="cart-item-create"),
    path("cart/items/<int:item_id>/", CartItemDetailView.as_view(), name="cart-item-detail"),
    path("cart/clear/", CartClearView.as_view(), name="cart-clear"),
    path("orders/", OrderListView.as_view(), name="order-list"),
    path("orders/<int:order_id>/", OrderDetailView.as_view(), name="order-detail"),
    path("orders/checkout/", CheckoutView.as_view(), name="order-checkout"),
]

