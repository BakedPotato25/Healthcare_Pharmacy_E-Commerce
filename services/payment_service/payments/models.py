from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from rest_framework.exceptions import ValidationError


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        CANCELLED = "cancelled", "Cancelled"

    order_id = models.PositiveIntegerField()
    user_id = models.PositiveIntegerField()
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    paid_at = models.DateTimeField(null=True, blank=True)
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
        return f"Payment<{self.id}, order={self.order_id}, status={self.status}>"

    def confirm(self):
        if self.status != self.Status.PENDING:
            raise ValidationError(
                {"status": f"Only pending payments can be confirmed. Current status is {self.status}."}
            )

        self.status = self.Status.PAID
        self.paid_at = timezone.now()
        self.save(update_fields=["status", "paid_at", "updated_at"])
        return self

    def cancel(self):
        if self.status != self.Status.PENDING:
            raise ValidationError(
                {"status": f"Only pending payments can be cancelled. Current status is {self.status}."}
            )

        self.status = self.Status.CANCELLED
        self.paid_at = None
        self.save(update_fields=["status", "paid_at", "updated_at"])
        return self
