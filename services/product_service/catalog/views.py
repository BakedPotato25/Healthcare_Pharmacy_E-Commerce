from django.db.models import Q
from rest_framework import serializers, status, viewsets
from rest_framework.response import Response

from .auth import request_is_staff_or_admin
from .models import Category, Product
from .permissions import StaffWriteOrReadOnly
from .serializers import CategorySerializer, ProductSerializer


def parse_bool(value):
    if value is None:
        return None
    normalized = value.lower()
    if normalized in {"true", "1", "yes", "active"}:
        return True
    if normalized in {"false", "0", "no", "inactive"}:
        return False
    return None


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [StaffWriteOrReadOnly]

    def get_queryset(self):
        queryset = Category.objects.all()
        if request_is_staff_or_admin(self.request):
            is_active = parse_bool(self.request.query_params.get("is_active"))
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active)
            return queryset
        return queryset.filter(is_active=True)


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [StaffWriteOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.select_related("category").all()
        is_staff = request_is_staff_or_admin(self.request)

        if is_staff:
            is_active = parse_bool(self.request.query_params.get("is_active"))
            if is_active is not None:
                queryset = queryset.filter(is_active=is_active)
        else:
            queryset = queryset.filter(is_active=True, category__is_active=True)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(brand__icontains=search))

        category = self.request.query_params.get("category")
        if category:
            if category.isdigit():
                queryset = queryset.filter(category_id=category)
            else:
                queryset = queryset.filter(category__slug=category)

        brand = self.request.query_params.get("brand")
        if brand:
            queryset = queryset.filter(brand__iexact=brand)

        min_price = self.request.query_params.get("min_price")
        if min_price:
            self._validate_decimal_filter("min_price", min_price)
            queryset = queryset.filter(price__gte=min_price)

        max_price = self.request.query_params.get("max_price")
        if max_price:
            self._validate_decimal_filter("max_price", max_price)
            queryset = queryset.filter(price__lte=max_price)

        sort = self.request.query_params.get("sort")
        if sort in {"price", "-price", "name", "-name"}:
            queryset = queryset.order_by(sort)

        return queryset

    def _validate_decimal_filter(self, field_name, value):
        try:
            float(value)
        except ValueError as exc:
            raise serializers.ValidationError({field_name: "Must be a valid number."}) from exc

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        product.is_active = False
        product.save(update_fields=["is_active", "updated_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)
