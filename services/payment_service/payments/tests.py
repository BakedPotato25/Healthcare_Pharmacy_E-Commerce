from rest_framework import status
from rest_framework.test import APITestCase


class PaymentLifecycleApiTests(APITestCase):
    def create_payment(self):
        response = self.client.post(
            "/api/payments/",
            {"order_id": 101, "user_id": 7, "amount": "49.95"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "pending")
        return response.data

    def test_create_and_get_payment(self):
        payment = self.create_payment()

        response = self.client.get(f"/api/payments/{payment['id']}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["order_id"], 101)
        self.assertEqual(response.data["user_id"], 7)
        self.assertEqual(response.data["amount"], "49.95")
        self.assertEqual(response.data["status"], "pending")

    def test_pending_payment_can_be_confirmed(self):
        payment = self.create_payment()

        response = self.client.post(f"/api/payments/{payment['id']}/confirm/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "paid")
        self.assertIsNotNone(response.data["paid_at"])

    def test_pending_payment_can_be_cancelled(self):
        payment = self.create_payment()

        response = self.client.post(f"/api/payments/{payment['id']}/cancel/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "cancelled")
        self.assertIsNone(response.data["paid_at"])

    def test_paid_payment_cannot_be_cancelled(self):
        payment = self.create_payment()
        self.client.post(f"/api/payments/{payment['id']}/confirm/")

        response = self.client.post(f"/api/payments/{payment['id']}/cancel/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "Only pending payments can be cancelled. Current status is paid.")

    def test_cancelled_payment_cannot_be_confirmed(self):
        payment = self.create_payment()
        self.client.post(f"/api/payments/{payment['id']}/cancel/")

        response = self.client.post(f"/api/payments/{payment['id']}/confirm/")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "Only pending payments can be confirmed. Current status is cancelled.")
