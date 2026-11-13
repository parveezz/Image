import { api } from "@/lib/api";

/**
 * Normalizes a page item from the backend into standard camelCase frontend structure.
 */
export function normalizePage(page) {
  if (!page) return null;

  // Capitalize status ("published" -> "Published", "draft" -> "Draft")
  let formattedStatus = "Draft";
  if (typeof page.status === "string" && page.status.trim()) {
    const s = page.status.toLowerCase();
    formattedStatus = s === "published" ? "Published" : "Draft";
  }

  // Format timestamp for display
  const rawDate = page.updated_at || page.updatedAt || page.created_at || page.createdAt;
  let formattedDate = "—";
  if (rawDate) {
    try {
      formattedDate = new Date(rawDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      formattedDate = String(rawDate);
    }
  }

  return {
    id: page.id,
    title: page.title || "",
    slug: page.slug || "",
    summary: page.summary || page.meta_description || page.description || "",
    description: page.summary || page.meta_description || page.description || "",
    content: page.content || "",
    status: formattedStatus,
    // Database schema does not currently have category; provide graceful fallback
    category: page.category || "General",
    metaTitle: page.meta_title ?? page.metaTitle ?? page.title ?? "",
    metaDescription: page.meta_description ?? page.metaDescription ?? page.summary ?? "",
    canonicalUrl: page.canonical_url ?? page.canonicalUrl ?? "",
    robotsIndex: page.robots_index ?? page.robotsIndex ?? true,
    robotsFollow: page.robots_follow ?? page.robotsFollow ?? true,
    lastUpdated: formattedDate,
    createdAt: page.created_at || page.createdAt || null,
    updatedAt: page.updated_at || page.updatedAt || null,
    _raw: page,
  };
}

/**
 * Maps frontend camelCase payload to backend PostgreSQL snake_case fields.
 * Note: Category is intentionally omitted as the DB schema does not have a category column.
 */
export function toBackendPayload(payload) {
  const result = {};
  if (payload.title !== undefined) result.title = payload.title.trim();
  if (payload.slug !== undefined) result.slug = payload.slug.trim();
  if (payload.summary !== undefined) result.summary = payload.summary;
  if (payload.content !== undefined) result.content = payload.content;
  if (payload.status !== undefined) {
    result.status = payload.status.toLowerCase();
  }
  if (payload.metaTitle !== undefined) result.meta_title = payload.metaTitle;
  if (payload.metaDescription !== undefined) result.meta_description = payload.metaDescription;
  if (payload.canonicalUrl !== undefined) result.canonical_url = payload.canonicalUrl;
  if (payload.robotsIndex !== undefined) result.robots_index = Boolean(payload.robotsIndex);
  if (payload.robotsFollow !== undefined) result.robots_follow = Boolean(payload.robotsFollow);

  return result;
}

export const pagesService = {
  /**
   * Retrieve paginated pages with optional search and status filter.
   * Note: Category is NOT sent as the backend API does not support it.
   */
  async getPages({ page = 1, limit = 10, search = "", status = "" } = {}) {
    const params = new URLSearchParams();

    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (search && search.trim()) params.set("search", search.trim());
    if (status && status !== "all") params.set("status", status.toLowerCase());

    const queryString = params.toString();
    const endpoint = `/api/pages${queryString ? `?${queryString}` : ""}`;

    const response = await api.get(endpoint);

    // Normalize response formats:
    // Case 1: { pages: [...], total: X, page: Y, limit: Z, totalPages: W }
    // Case 2: { data: [...], pagination: { ... } }
    // Case 3: Array of pages directly
    let rawList = [];
    let total = 0;
    let currentPage = Number(page) || 1;
    let currentLimit = Number(limit) || 10;
    let totalPages = 1;

    if (Array.isArray(response)) {
      rawList = response;
      total = rawList.length;
      totalPages = Math.max(1, Math.ceil(total / currentLimit));
    } else if (response && typeof response === "object") {
      rawList =
        response.pages ||
        response.data ||
        (Array.isArray(response.items) ? response.items : []);

      total =
        response.total ??
        response.pagination?.total ??
        response.count ??
        rawList.length;

      currentPage =
        response.page ??
        response.pagination?.page ??
        currentPage;

      currentLimit =
        response.limit ??
        response.pagination?.limit ??
        currentLimit;

      totalPages =
        response.totalPages ??
        response.pagination?.totalPages ??
        Math.max(1, Math.ceil(total / currentLimit));
    }

    return {
      pages: rawList.map(normalizePage),
      total: Number(total) || 0,
      page: Number(currentPage) || 1,
      limit: Number(currentLimit) || 10,
      totalPages: Number(totalPages) || 1,
    };
  },

  /**
   * Retrieve a page by its database ID.
   */
  async getPageById(id) {
    const response = await api.get(`/api/pages/id/${id}`);
    const pageData = response?.page || response?.data || response;
    return normalizePage(pageData);
  },

  /**
   * Create a new page.
   */
  async createPage(payload) {
    const body = toBackendPayload(payload);
    const response = await api.post("/api/pages", body);
    return normalizePage(response?.page || response?.data || response);
  },

  /**
   * Update an existing page by ID.
   */
  async updatePage(id, payload) {
    const body = toBackendPayload(payload);
    const response = await api.patch(`/api/pages/${id}`, body);
    return normalizePage(response?.page || response?.data || response);
  },

  /**
   * Delete a page by ID.
   */
  async deletePage(id) {
    return await api.delete(`/api/pages/${id}`);
  },

  /**
   * Public endpoint to fetch published page by slug.
   * Explicitly omits credentials to ensure clean caching in Next.js Server Components.
   */
  async getPublicPageBySlug(slug) {
    const response = await api.get(`/api/pages/slug/${slug}`, { credentials: "omit" });
    const pageData = response?.page || response?.data || response;
    return normalizePage(pageData);
  },
};

export default pagesService;
