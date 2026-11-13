
import { api } from "@/lib/api";

/**
 * Extract backend data from an Axios response.
 */
function getResponseData(response) {
  return response?.data ?? response;
}

/**
 * Extract page object from common backend response formats.
 */
function getPageData(response) {
  const data = getResponseData(response);

  return data?.page ?? data?.data ?? data;
}

/**
 * Normalize a page item from the backend into
 * a standard camelCase frontend structure.
 */
export function normalizePage(page) {
  if (!page || typeof page !== "object") {
    return null;
  }

  // Normalize status.
  const rawStatus =
    typeof page.status === "string"
      ? page.status.trim().toLowerCase()
      : "";

  const formattedStatus =
    rawStatus === "published" ? "Published" : "Draft";

  // Resolve timestamp.
  const rawDate =
    page.updated_at ||
    page.updatedAt ||
    page.created_at ||
    page.createdAt;

  let formattedDate = "—";

  if (rawDate) {
    const date = new Date(rawDate);

    if (!Number.isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  const summary =
    page.summary ||
    page.meta_description ||
    page.metaDescription ||
    page.description ||
    "";

  return {
    id: page.id,
    title: page.title || "",
    slug: page.slug || "",
    summary,
    description: summary,
    content: page.content || "",

    status: formattedStatus,

    // Category is not currently available in the database schema.
    category: page.category || "General",

    metaTitle:
      page.meta_title ??
      page.metaTitle ??
      page.title ??
      "",

    metaDescription:
      page.meta_description ??
      page.metaDescription ??
      summary,

    canonicalUrl:
      page.canonical_url ??
      page.canonicalUrl ??
      "",

    robotsIndex:
      page.robots_index ??
      page.robotsIndex ??
      true,

    robotsFollow:
      page.robots_follow ??
      page.robotsFollow ??
      true,

    lastUpdated: formattedDate,

    createdAt:
      page.created_at ??
      page.createdAt ??
      null,

    updatedAt:
      page.updated_at ??
      page.updatedAt ??
      null,

    _raw: page,
  };
}

/**
 * Convert frontend camelCase payload into backend
 * PostgreSQL snake_case fields.
 *
 * Category is intentionally omitted because the
 * current database schema does not support it.
 */
export function toBackendPayload(payload = {}) {
  const result = {};

  if (payload.title !== undefined) {
    result.title = String(payload.title).trim();
  }

  if (payload.slug !== undefined) {
    result.slug = String(payload.slug).trim();
  }

  if (payload.summary !== undefined) {
    result.summary = payload.summary;
  }

  if (payload.content !== undefined) {
    result.content = payload.content;
  }

  if (payload.status !== undefined) {
    if (typeof payload.status !== "string") {
      throw new TypeError("Page status must be a string.");
    }

    result.status = payload.status.trim().toLowerCase();
  }

  if (payload.metaTitle !== undefined) {
    result.meta_title = payload.metaTitle;
  }

  if (payload.metaDescription !== undefined) {
    result.meta_description = payload.metaDescription;
  }

  if (payload.canonicalUrl !== undefined) {
    result.canonical_url = payload.canonicalUrl;
  }

  if (payload.robotsIndex !== undefined) {
    result.robots_index = Boolean(payload.robotsIndex);
  }

  if (payload.robotsFollow !== undefined) {
    result.robots_follow = Boolean(payload.robotsFollow);
  }

  return result;
}

/**
 * Pages API service.
 */
export const pagesService = {
  /**
   * Retrieve paginated pages with optional search and status filter.
   */
  async getPages({
    page = 1,
    limit = 10,
    search = "",
    status = "",
  } = {}) {
    const params = new URLSearchParams();

    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    if (search && search.trim()) {
      params.set("search", search.trim());
    }

    if (status && status !== "all") {
      params.set("status", status.toLowerCase());
    }

    const queryString = params.toString();

    const endpoint = `/api/pages${queryString ? `?${queryString}` : ""
      }`;

    const response = await api.get(endpoint);
    const data = getResponseData(response);

    let rawList = [];
    let total = 0;
    let currentPage = Number(page) || 1;
    let currentLimit = Number(limit) || 10;
    let totalPages = 1;

    // Case 1: Backend returns an array directly.
    if (Array.isArray(data)) {
      rawList = data;
      total = rawList.length;

      totalPages = Math.max(
        1,
        Math.ceil(total / currentLimit)
      );
    }

    // Case 2: Backend returns an object.
    else if (data && typeof data === "object") {
      rawList =
        Array.isArray(data.pages)
          ? data.pages
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.items)
              ? data.items
              : [];

      total =
        data.total ??
        data.pagination?.total ??
        data.count ??
        rawList.length;

      currentPage =
        data.page ??
        data.pagination?.page ??
        currentPage;

      currentLimit =
        data.limit ??
        data.pagination?.limit ??
        currentLimit;

      totalPages =
        data.totalPages ??
        data.pagination?.totalPages ??
        Math.max(
          1,
          Math.ceil(Number(total) / Number(currentLimit))
        );
    }

    return {
      pages: rawList
        .map(normalizePage)
        .filter(Boolean),

      total: Number(total) || 0,
      page: Number(currentPage) || 1,
      limit: Number(currentLimit) || 10,
      totalPages: Number(totalPages) || 1,
    };
  },

  /**
   * Retrieve a page using its database ID.
   */
  async getPageById(id) {
    const response = await api.get(
      `/api/pages/id/${encodeURIComponent(id)}`
    );

    return normalizePage(getPageData(response));
  },

  /**
   * Create a new page.
   */
  async createPage(payload) {
    const body = toBackendPayload(payload);

    const response = await api.post(
      "/api/pages",
      body
    );

    return normalizePage(getPageData(response));
  },

  /**
   * Update an existing page.
   */
  async updatePage(id, payload) {
    const body = toBackendPayload(payload);

    const response = await api.patch(
      `/api/pages/${encodeURIComponent(id)}`,
      body
    );

    return normalizePage(getPageData(response));
  },

  /**
   * Delete a page.
   */
  async deletePage(id) {
    const response = await api.delete(
      `/api/pages/${encodeURIComponent(id)}`
    );

    return getResponseData(response);
  },

  /**
   * Public endpoint: retrieve a published page by slug.
   *
   * This request is intended for server-side public rendering.
   */
  async getPublicPageBySlug(slug) {
    const response = await api.get(
      `/api/pages/slug/${encodeURIComponent(slug)}`
    );

    return normalizePage(getPageData(response));
  },
};

export default pagesService;
