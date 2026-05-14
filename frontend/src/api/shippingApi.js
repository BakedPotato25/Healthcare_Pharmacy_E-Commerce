import { apiRequest, unwrapCollection } from "./apiClient.js";

export async function getShipments() {
  return unwrapCollection(await apiRequest("/api/shipments/"));
}

export function updateShipmentStatus({ shipmentId, status }) {
  return apiRequest(`/api/shipments/${shipmentId}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
