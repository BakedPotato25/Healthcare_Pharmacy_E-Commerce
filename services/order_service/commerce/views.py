from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .external import get_user_context, is_staff_or_admin, require_customer
from .models import CartItem, Order
from .serializers import (
    CartAddItemSerializer,
    CartItemSerializer,
    CartUpdateItemSerializer,
    CheckoutSerializer,
    OrderSerializer,
    serialize_cart,
)
from .services import add_cart_item, checkout_cart


class CartView(APIView):
    def get(self, request):
        user = get_user_context(request)
        require_customer(user)
        items = list(CartItem.objects.filter(user_id=user["id"]).order_by("created_at"))
        return Response(serialize_cart(items))


class CartItemCreateView(APIView):
    def post(self, request):
        user = get_user_context(request)
        require_customer(user)
        serializer = CartAddItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = add_cart_item(
            user_id=user["id"],
            product_id=serializer.validated_data["product_id"],
            quantity=serializer.validated_data["quantity"],
        )
        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    def patch(self, request, item_id):
        user = get_user_context(request)
        require_customer(user)
        serializer = CartUpdateItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = get_object_or_404(CartItem, id=item_id, user_id=user["id"])
        item.quantity = serializer.validated_data["quantity"]
        item.save(update_fields=["quantity", "updated_at"])
        return Response(CartItemSerializer(item).data)

    def delete(self, request, item_id):
        user = get_user_context(request)
        require_customer(user)
        get_object_or_404(CartItem, id=item_id, user_id=user["id"]).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartClearView(APIView):
    def delete(self, request):
        user = get_user_context(request)
        require_customer(user)
        CartItem.objects.filter(user_id=user["id"]).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrderListView(APIView):
    def get(self, request):
        user = get_user_context(request)
        orders = Order.objects.prefetch_related("items").all()
        if not is_staff_or_admin(user):
            orders = orders.filter(user_id=user["id"])
        return Response(OrderSerializer(orders, many=True).data)


class OrderDetailView(APIView):
    def get(self, request, order_id):
        user = get_user_context(request)
        orders = Order.objects.prefetch_related("items")
        if not is_staff_or_admin(user):
            orders = orders.filter(user_id=user["id"])
        order = get_object_or_404(orders, id=order_id)
        return Response(OrderSerializer(order).data)


class CheckoutView(APIView):
    def post(self, request):
        user = get_user_context(request)
        require_customer(user)
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = checkout_cart(
            user=user,
            shipping_address=serializer.validated_data["shipping_address"],
            recipient_name=serializer.validated_data.get("recipient_name", ""),
            phone=serializer.validated_data.get("phone", ""),
            authorization=request.headers.get("Authorization", ""),
        )
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
