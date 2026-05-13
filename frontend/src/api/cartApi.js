import { apiRequest } from "./apiClient.js";

export function getCart() {
  return apiRequest("/api/cart/");
}

export function addCartItem({ productId, quantity = 1 }) {
  return apiRequest("/api/cart/items/", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}

export function updateCartItem({ itemId, quantity }) {
  return apiRequest(`/api/cart/items/${itemId}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId) {
  return apiRequest(`/api/cart/items/${itemId}/`, {
    method: "DELETE",
  });
}

export function clearCart() {
  return apiRequest("/api/cart/clear/", {
    method: "DELETE",
  });
}
