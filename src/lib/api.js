export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      /^192\.168\./.test(hostname) ||
      /^10\./.test(hostname)
    ) {
      return `${protocol}//${hostname}:5000`;
    }
  }

  const envUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  return envUrl || "http://localhost:5000";
}

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Centralized fetch client for Imagely API requests.
 * Uses credentials: "include" to pass HTTP-only session cookies.
 */
export async function apiClient(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const defaultHeaders = {
    Accept: "application/json",
  };

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  // Set timeout to avoid hanging connections if backend server is unreachable
  let timeoutSignal;
  if (!options.signal && typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    timeoutSignal = AbortSignal.timeout(options.timeout || 10000);
  }

  const config = {
    ...options,
    credentials: options.credentials || (typeof window !== "undefined" ? "include" : "omit"),
    signal: options.signal || timeoutSignal,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw new ApiError(
      networkError.message || "Unable to connect to the backend server.",
      0
    );
  }

  // Parse JSON response body if present
  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = text ? { message: text } : null;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
}

export const api = {
  get: (endpoint, options = {}) =>
    apiClient(endpoint, { ...options, method: "GET" }),

  post: (endpoint, body, options = {}) =>
    apiClient(endpoint, { ...options, method: "POST", body }),

  patch: (endpoint, body, options = {}) =>
    apiClient(endpoint, { ...options, method: "PATCH", body }),

  put: (endpoint, body, options = {}) =>
    apiClient(endpoint, { ...options, method: "PUT", body }),

  delete: (endpoint, options = {}) =>
    apiClient(endpoint, { ...options, method: "DELETE" }),
};

export default api;
