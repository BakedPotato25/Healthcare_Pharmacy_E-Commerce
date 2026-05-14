import { apiRequest, unwrapCollection } from "./apiClient.js";

export async function getCustomers() {
  return unwrapCollection(await apiRequest("/api/users/?role=customer"));
}
