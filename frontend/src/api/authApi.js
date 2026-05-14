import { ApiError, apiRequest, clearAuthSession, setAuthSession } from "./apiClient.js";

export async function loginCustomer({ email, password }) {
  const session = await apiRequest("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password, role: "customer" }),
  });
  setAuthSession(session);
  return session;
}

export async function loginStaff({ email, password }) {
  const session = await apiRequest("/api/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAuthSession(session);

  let currentUser;
  try {
    currentUser = await getCurrentUser();
  } catch (error) {
    clearAuthSession();
    throw error;
  }

  const role = currentUser?.role;
  if (!["staff", "admin"].includes(role)) {
    clearAuthSession();
    throw new ApiError("This account is not authorized for the staff portal.", {
      status: 403,
      data: { detail: "Staff or admin role is required." },
    });
  }
  setAuthSession({ ...session, user: currentUser });
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
