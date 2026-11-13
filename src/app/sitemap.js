
import pagesService from "@/services/pagesService";

/**
 * Next.js App Router dynamic sitemap generator.
 * Generates sitemap.xml using published, indexable pages.
 */

export default async function sitemap() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://imagely.com"
  ).replace(/\/+$/, "");

  // Only include real, publicly accessible static routes.
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
    },
  ];

  const footerEntries = [];
  const limit = 100;

  try {
    // Fetch the first page to determine pagination.
    const firstResponse = await pagesService.getPages({
      page: 1,
      limit,
      status: "Published",
    });

    const firstPages = Array.isArray(firstResponse?.pages)
      ? firstResponse.pages
      : [];

    const totalPages = Math.max(
      1,
      Number(firstResponse?.totalPages) || 1
    );

    const allPages = [...firstPages];

    // Fetch remaining pages when pagination is available.
    for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
      const response = await pagesService.getPages({
        page: currentPage,
        limit,
        status: "Published",
      });

      if (Array.isArray(response?.pages)) {
        allPages.push(...response.pages);
      }
    }

    // Include only published pages that are allowed to be indexed.
    for (const page of allPages) {
      if (!page?.slug) continue;

      const isPublished =
        String(page.status || "").toLowerCase() === "published";

      const isIndexable =
        page.robotsIndex !== false &&
        String(page.robotsIndex).toLowerCase() !== "false";

      if (!isPublished || !isIndexable) continue;

      // Avoid including pages that declare a different canonical URL.
      if (page.canonicalUrl) {
        try {
          const canonicalUrl = new URL(page.canonicalUrl, baseUrl);

          const expectedUrl = new URL(
            `/${encodeURIComponent(page.slug)}`,
            baseUrl
          );

          if (canonicalUrl.origin !== expectedUrl.origin) continue;

          if (
            canonicalUrl.pathname.replace(/\/+$/, "") !==
            expectedUrl.pathname.replace(/\/+$/, "")
          ) {
            continue;
          }
        } catch {
          continue;
        }
      }

      const entry = {
        url: `${baseUrl}/${encodeURIComponent(page.slug)}`,
      };

      // Use the actual update date when available.
      if (page.updatedAt) {
        const updatedAt = new Date(page.updatedAt);

        if (!Number.isNaN(updatedAt.getTime())) {
          entry.lastModified = updatedAt;
        }
      }

      footerEntries.push(entry);
    }
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    // Do not publish an incomplete sitemap containing guessed URLs.
    throw error;
  }

  // Remove duplicate URLs.
  const uniqueEntries = [
    ...new Map(
      [...staticRoutes, ...footerEntries].map((entry) => [
        entry.url,
        entry,
      ])
    ).values(),
  ];

  return uniqueEntries;
}
