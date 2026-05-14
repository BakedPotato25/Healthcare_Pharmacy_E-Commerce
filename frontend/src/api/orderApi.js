import { apiRequest, unwrapCollection } from "./apiClient.js";

export async function getOrders() {
  return unwrapCollection(await apiRequest("/api/orders/"));
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
