import { apiRequest, clearAuthSession, setAuthSession } from "./apiClient.js";

export async function loginCustomer({ email, password }) {
  const session = await apiRequest("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password, role: "customer" }),
  });
  setAuthSession(session);
  return session;
}

export async function registerCustomer({ email, password, username }) {
  return apiRequest("/api/auth/register/", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  });
}

export async function getCurrentUser() {
  return apiRequest("/api/auth/me/");
}

export function logout() {
  clearAuthSession();
}
