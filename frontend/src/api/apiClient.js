const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const ACCESS_TOKEN_KEY = "pharmacare_access_token";
const REFRESH_TOKEN_KEY = "pharmacare_refresh_token";
const USER_KEY = "pharmacare_user";

export { ACCESS_TOKEN_KEY, API_BASE_URL, REFRESH_TOKEN_KEY, USER_KEY };

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAuthSession({ access, refresh, user }) {
  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
  }
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(readErrorMessage(data, response.statusText), {
      status: response.status,
      data,
    });
  }

  return data;
}

export function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function readErrorMessage(data, fallback) {
  if (!data) {
    return fallback || "Request failed.";
  }
  if (typeof data === "string") {
    return data;
  }
  if (data.detail) {
    return Array.isArray(data.detail) ? data.detail.join(" ") : data.detail;
  }
  const firstValue = Object.values(data)[0];
  if (Array.isArray(firstValue)) {
    return firstValue.join(" ");
  }
  if (typeof firstValue === "string") {
    return firstValue;
  }
  return fallback || "Request failed.";
}
