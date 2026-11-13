import pagesService from "@/services/pagesService";

/**
 * Next.js App Router dynamic sitemap generator.
 * Automatically serves /sitemap.xml for search engine crawlers (Googlebot, Bingbot).
 */
export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://imagely.com";

  const now = new Date();

  // 1. Core homepage and public routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 2. Default standard footer pages
  const defaultFooterPages = [
    { slug: "terms", priority: 0.6, changeFrequency: "monthly" },
    { slug: "privacy", priority: 0.7, changeFrequency: "monthly" },
    { slug: "cookies", priority: 0.5, changeFrequency: "monthly" },
    { slug: "copyright", priority: 0.6, changeFrequency: "monthly" },
    { slug: "complaints", priority: 0.5, changeFrequency: "monthly" },
    { slug: "acceptable-use", priority: 0.6, changeFrequency: "monthly" },
    { slug: "content-removal", priority: 0.5, changeFrequency: "monthly" },
    { slug: "appeals", priority: 0.5, changeFrequency: "monthly" },
    { slug: "help", priority: 0.8, changeFrequency: "weekly" },
    { slug: "contact", priority: 0.7, changeFrequency: "monthly" },
    { slug: "faqs", priority: 0.8, changeFrequency: "weekly" },
    { slug: "report-issue", priority: 0.6, changeFrequency: "monthly" },
  ];

  let footerEntries = [];

  try {
    // Attempt dynamic fetch from database for published pages
    const response = await pagesService.getPages({
      status: "published",
      limit: 100,
    });

    const pages = response?.pages || [];
    if (pages.length > 0) {
      footerEntries = pages
        .filter((p) => p.robotsIndex !== false)
        .map((p) => ({
          url: `${baseUrl}/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
          changeFrequency: "monthly",
          priority: p.slug === "privacy" || p.slug === "help" ? 0.7 : 0.6,
        }));
    }
  } catch {
    // Fall back to default static list if database is unreachable during prerender
    footerEntries = [];
  }

  // If dynamic fetch yielded nothing, use the guaranteed default list
  if (footerEntries.length === 0) {
    footerEntries = defaultFooterPages.map((item) => ({
      url: `${baseUrl}/${item.slug}`,
      lastModified: now,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    }));
  }

  return [...staticRoutes, ...footerEntries];
}
