
/**
 * Get API base URL dynamically.
 */
export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;

    const isLocalNetwork =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      /^192\.168\./.test(hostname) ||
      /^10\./.test(hostname);

    if (isLocalNetwork) {
      return `${protocol}//${hostname}:5000`;
    }
  }

  const envUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  return envUrl || "http://localhost:5000";
}

/**
 * Custom API error.
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Centralized Fetch API client.
 */
export async function apiClient(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const {
    timeout = 10000,
    signal,
    headers = {},
    credentials,
    body,
    ...restOptions
  } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const defaultHeaders = {
    Accept: "application/json",
  };

  if (body !== undefined && body !== null && !isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const config = {
    ...restOptions,

    credentials:
      credentials ??
      (typeof window !== "undefined" ? "include" : "omit"),

    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body =
      isFormData || typeof body === "string"
        ? body
        : JSON.stringify(body);
  }

  // Request timeout.
  const timeoutController =
    !signal && typeof AbortController !== "undefined"
      ? new AbortController()
      : null;

  let timeoutId;

  if (timeoutController) {
    config.signal = timeoutController.signal;

    timeoutId = setTimeout(() => {
      timeoutController.abort();
    }, timeout);
  } else if (signal) {
    config.signal = signal;
  }

  let response;

  try {
    response = await fetch(url, config);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new ApiError(
        "Request timed out or was cancelled.",
        0
      );
    }

    throw new ApiError(
      error.message || "Unable to connect to the backend server.",
      0
    );
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  // Parse response.
  let data = null;

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
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

  // Handle API errors.
  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new ApiError(
      errorMessage,
      response.status,
      data
    );
  }

  return data;
}

/**
 * HTTP methods.
 */
export const api = {
  get: (endpoint, options = {}) =>
    apiClient(endpoint, {
      ...options,
      method: "GET",
    }),

  post: (endpoint, body, options = {}) =>
    apiClient(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  patch: (endpoint, body, options = {}) =>
    apiClient(endpoint, {
      ...options,
      method: "PATCH",
      body,
    }),

  put: (endpoint, body, options = {}) =>
    apiClient(endpoint, {
      ...options,
      method: "PUT",
      body,
    }),

  delete: (endpoint, options = {}) =>
    apiClient(endpoint, {
      ...options,
      method: "DELETE",
    }),
};

export default api;
