import { apiRequest } from "./apiClient.js";

export function getOrders() {
  return apiRequest("/api/orders/");
}

export function checkoutOrder({ shippingAddress, recipientName, phone }) {
  return apiRequest("/api/orders/checkout/", {
    method: "POST",
    body: JSON.stringify({
      shipping_address: shippingAddress,
      recipient_name: recipientName,
      phone,
    }),
  });
}
