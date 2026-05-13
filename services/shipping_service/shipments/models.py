from django.db import models
from rest_framework.exceptions import ValidationError


class Shipment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PREPARING = "preparing", "Preparing"
        SHIPPED = "shipped", "Shipped"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    VALID_TRANSITIONS = {
        Status.PENDING: {Status.PREPARING, Status.CANCELLED},
        Status.PREPARING: {Status.SHIPPED, Status.CANCELLED},
        Status.SHIPPED: {Status.DELIVERED},
        Status.DELIVERED: set(),
        Status.CANCELLED: set(),
    }

    order_id = models.PositiveIntegerField()
    user_id = models.PositiveIntegerField()
    recipient_name = models.CharField(max_length=160)
    phone = models.CharField(max_length=40)
    address = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["order_id"]),
            models.Index(fields=["user_id"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"Shipment<{self.id}, order={self.order_id}, status={self.status}>"

    def update_status(self, next_status):
        allowed_next_statuses = self.VALID_TRANSITIONS[self.status]
        if next_status not in allowed_next_statuses:
            raise ValidationError(
                {
                    "status": (
                        f"Invalid shipment status transition from {self.status} to {next_status}."
                    )
                }
            )

        self.status = next_status
        self.save(update_fields=["status", "updated_at"])
        return self
