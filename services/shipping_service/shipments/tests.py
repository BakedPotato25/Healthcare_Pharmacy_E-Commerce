from unittest.mock import Mock, patch

from rest_framework import status
from rest_framework.test import APITestCase


class ShipmentLifecycleApiTests(APITestCase):
    def mock_user_response(self, user_id, role):
        response = Mock()
        response.status_code = 200
        response.json.return_value = {
            "id": user_id,
            "email": f"{role}{user_id}@example.com",
            "username": f"{role}{user_id}",
            "role": role,
        }
        return response

    def auth_headers(self):
        return {"HTTP_AUTHORIZATION": "Bearer test-token"}

    @patch("shipments.auth.requests.get")
    def create_shipment(self, mock_get, user_id=7, role="customer"):
        mock_get.return_value = self.mock_user_response(user_id, role)
        response = self.client.post(
            "/api/shipments/",
            {
                "order_id": 101,
                "user_id": user_id,
                "recipient_name": "Demo Customer",
                "phone": "555-0101",
                "address": "123 Demo Street",
            },
            format="json",
            **self.auth_headers(),
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "pending")
        return response.data

    def test_create_and_get_own_shipment(self):
        shipment = self.create_shipment()

        with patch("shipments.auth.requests.get") as mock_get:
            mock_get.return_value = self.mock_user_response(7, "customer")
            response = self.client.get(f"/api/shipments/{shipment['id']}/", **self.auth_headers())

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["order_id"], 101)
        self.assertEqual(response.data["user_id"], 7)
        self.assertEqual(response.data["status"], "pending")

    def test_customer_cannot_get_another_customer_shipment(self):
        shipment = self.create_shipment(user_id=7)

        with patch("shipments.auth.requests.get") as mock_get:
            mock_get.return_value = self.mock_user_response(8, "customer")
            response = self.client.get(f"/api/shipments/{shipment['id']}/", **self.auth_headers())

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_update_valid_status_transitions(self):
        shipment = self.create_shipment()

        with patch("shipments.auth.requests.get") as mock_get:
            mock_get.return_value = self.mock_user_response(99, "staff")
            response = self.client.patch(
                f"/api/shipments/{shipment['id']}/status/",
                {"status": "preparing"},
                format="json",
                **self.auth_headers(),
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "preparing")

        with patch("shipments.auth.requests.get") as mock_get:
            mock_get.return_value = self.mock_user_response(99, "staff")
            response = self.client.patch(
                f"/api/shipments/{shipment['id']}/status/",
                {"status": "shipped"},
                format="json",
                **self.auth_headers(),
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "shipped")

    def test_customer_cannot_update_status(self):
        shipment = self.create_shipment()

        with patch("shipments.auth.requests.get") as mock_get:
            mock_get.return_value = self.mock_user_response(7, "customer")
            response = self.client.patch(
                f"/api/shipments/{shipment['id']}/status/",
                {"status": "preparing"},
                format="json",
                **self.auth_headers(),
            )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_invalid_transition_is_rejected(self):
        shipment = self.create_shipment()

        with patch("shipments.auth.requests.get") as mock_get:
            mock_get.return_value = self.mock_user_response(99, "staff")
            response = self.client.patch(
                f"/api/shipments/{shipment['id']}/status/",
                {"status": "delivered"},
                format="json",
                **self.auth_headers(),
            )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["status"],
            "Invalid shipment status transition from pending to delivered.",
        )

    def test_terminal_cancelled_shipment_cannot_change(self):
        shipment = self.create_shipment()

        with patch("shipments.auth.requests.get") as mock_get:
            mock_get.return_value = self.mock_user_response(99, "staff")
            self.client.patch(
                f"/api/shipments/{shipment['id']}/status/",
                {"status": "cancelled"},
                format="json",
                **self.auth_headers(),
            )

        with patch("shipments.auth.requests.get") as mock_get:
            mock_get.return_value = self.mock_user_response(99, "staff")
            response = self.client.patch(
                f"/api/shipments/{shipment['id']}/status/",
                {"status": "preparing"},
                format="json",
                **self.auth_headers(),
            )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["status"],
            "Invalid shipment status transition from cancelled to preparing.",
        )
