import { apiRequest, buildQuery, unwrapCollection } from "./apiClient.js";

export async function getCategories() {
  return unwrapCollection(await apiRequest("/api/categories/"));
}

export async function getProducts(params = {}) {
  return unwrapCollection(await apiRequest(`/api/products/${buildQuery(params)}`));
}

export function getProduct(productId) {
  return apiRequest(`/api/products/${productId}/`);
}

export function createProduct(product) {
  return apiRequest("/api/products/", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(productId, product) {
  return apiRequest(`/api/products/${productId}/`, {
    method: "PATCH",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(productId) {
  return apiRequest(`/api/products/${productId}/`, {
    method: "DELETE",
  });
}
