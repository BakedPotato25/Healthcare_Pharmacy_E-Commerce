from decimal import Decimal
from unittest.mock import Mock, patch

from django.test import TestCase
from rest_framework.exceptions import ValidationError

from .models import CartItem, Order
from .services import checkout_cart


class CheckoutIntegrationTests(TestCase):
    def setUp(self):
        self.user = {
            "id": 7,
            "email": "customer@example.com",
            "username": "Demo Customer",
            "role": "customer",
        }
        CartItem.objects.create(
            user_id=self.user["id"],
            product_id=101,
            product_name="Demo Vitamin C",
            product_brand="PharmaCare",
            product_category="Vitamins & Minerals",
            product_image_url="",
            unit_price=Decimal("12.50"),
            quantity=2,
        )

    def response(self, status_code, payload):
        response = Mock()
        response.status_code = status_code
        response.json.return_value = payload
        response.text = str(payload)
        return response

    @patch("commerce.external.requests.post")
    def test_checkout_creates_payment_shipment_snapshots_and_clears_cart(self, mock_post):
        def side_effect(url, **kwargs):
            if url.endswith("/api/payments/"):
                return self.response(201, {"id": 501, "status": "pending"})
            if url.endswith("/api/shipments/"):
                return self.response(201, {"id": 701, "status": "pending"})
            raise AssertionError(f"Unexpected URL {url}")

        mock_post.side_effect = side_effect

        order = checkout_cart(
            user=self.user,
            shipping_address="123 Demo Street",
            recipient_name="Demo Customer",
            phone="555-0101",
            authorization="Bearer customer-token",
        )

        self.assertEqual(order.total_amount, Decimal("25.00"))
        self.assertEqual(order.payment_id, 501)
        self.assertEqual(order.payment_status, "pending")
        self.assertEqual(order.shipment_id, 701)
        self.assertEqual(order.shipping_status, "pending")
        self.assertEqual(order.items.count(), 1)
        self.assertFalse(CartItem.objects.filter(user_id=self.user["id"]).exists())

    @patch("commerce.external.requests.post")
    def test_payment_creation_failure_keeps_cart_and_rolls_back_order(self, mock_post):
        mock_post.return_value = self.response(500, {"detail": "payment failed"})

        with self.assertRaises(ValidationError):
            checkout_cart(
                user=self.user,
                shipping_address="123 Demo Street",
                authorization="Bearer customer-token",
            )

        self.assertEqual(Order.objects.count(), 0)
        self.assertTrue(CartItem.objects.filter(user_id=self.user["id"]).exists())

    @patch("commerce.external.requests.post")
    def test_shipment_failure_attempts_payment_cancellation_and_keeps_cart(self, mock_post):
        def side_effect(url, **kwargs):
            if url.endswith("/api/payments/"):
                return self.response(201, {"id": 501, "status": "pending"})
            if url.endswith("/api/shipments/"):
                return self.response(500, {"detail": "shipment failed"})
            if url.endswith("/api/payments/501/cancel/"):
                return self.response(200, {"id": 501, "status": "cancelled"})
            raise AssertionError(f"Unexpected URL {url}")

        mock_post.side_effect = side_effect

        with self.assertRaises(ValidationError) as exc_info:
            checkout_cart(
                user=self.user,
                shipping_address="123 Demo Street",
                authorization="Bearer customer-token",
            )

        self.assertIn("payment_cancellation", exc_info.exception.detail)
        self.assertEqual(Order.objects.count(), 0)
        self.assertTrue(CartItem.objects.filter(user_id=self.user["id"]).exists())
        called_urls = [call.args[0] for call in mock_post.call_args_list]
        self.assertTrue(any(url.endswith("/api/payments/501/cancel/") for url in called_urls))
