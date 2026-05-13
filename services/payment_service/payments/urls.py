from django.urls import path

from .views import PaymentCancelView, PaymentConfirmView, PaymentCreateView, PaymentDetailView

urlpatterns = [
    path("payments/", PaymentCreateView.as_view(), name="payment-create"),
    path("payments/<int:payment_id>/", PaymentDetailView.as_view(), name="payment-detail"),
    path("payments/<int:payment_id>/confirm/", PaymentConfirmView.as_view(), name="payment-confirm"),
    path("payments/<int:payment_id>/cancel/", PaymentCancelView.as_view(), name="payment-cancel"),
]
