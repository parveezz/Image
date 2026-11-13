
/**
 * Next.js App Router robots.txt generator.
 * Controls crawler access and provides the sitemap location.
 */

export default function robots() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://imagely.com"
  ).replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
