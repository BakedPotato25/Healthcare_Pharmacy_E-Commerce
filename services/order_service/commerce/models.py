from decimal import Decimal

from django.db import models


class ProductSnapshotMixin(models.Model):
    product_id = models.PositiveIntegerField()
    product_name = models.CharField(max_length=180)
    product_brand = models.CharField(max_length=120)
    product_category = models.CharField(max_length=120)
    product_image_url = models.URLField(blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        abstract = True


class CartItem(ProductSnapshotMixin):
    user_id = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        constraints = [
            models.UniqueConstraint(fields=["user_id", "product_id"], name="unique_cart_product_per_user")
        ]

    def __str__(self):
        return f"CartItem<user={self.user_id}, product={self.product_id}, quantity={self.quantity}>"

    @property
    def line_total(self):
        return self.unit_price * self.quantity


class Order(models.Model):
    class Status(models.TextChoices):
        CREATED = "created", "Created"
        CANCELLED = "cancelled", "Cancelled"

    user_id = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.CREATED)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))
    payment_id = models.PositiveIntegerField(null=True, blank=True)
    payment_status = models.CharField(max_length=20, blank=True)
    shipment_id = models.PositiveIntegerField(null=True, blank=True)
    shipping_status = models.CharField(max_length=20, blank=True)
    shipping_address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user_id"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Order<{self.id}, user={self.user_id}, total={self.total_amount}>"


class OrderItem(ProductSnapshotMixin):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    line_total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"OrderItem<order={self.order_id}, product={self.product_id}, quantity={self.quantity}>"
