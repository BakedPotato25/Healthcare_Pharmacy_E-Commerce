import { apiRequest, buildQuery } from "./apiClient.js";

export function getCategories() {
  return apiRequest("/api/categories/");
}

export function getProducts(params = {}) {
  return apiRequest(`/api/products/${buildQuery(params)}`);
}

export function getProduct(productId) {
  return apiRequest(`/api/products/${productId}/`);
}
