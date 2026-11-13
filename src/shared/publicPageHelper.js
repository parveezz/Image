import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import pagesService from "@/services/pagesService";
import LegalPageLayout from "@/shared/LegalPageLayout";
import LegalPageSkeleton from "@/shared/LegalPageSkeleton";

/**
 * Fetches a published page from the backend by slug.
 * Employs Next.js 16 "use cache" directive so the public content is cached
 * during prerendering and navigations, preventing uncached data warnings.
 * Returns null if the page does not exist, is in Draft status, or if an API error occurs.
 */
export async function fetchPublishedPage(slug) {
  "use cache";
  cacheTag(`public-page-${slug}`);

  try {
    const page = await pagesService.getPublicPageBySlug(slug);

    // Verify page exists and is published - do not expose draft content publicly
    if (!page || page.status !== "Published") {
      cacheLife("seconds");
      return null;
    }

    cacheLife("hours");
    return page;
  } catch {
    cacheLife("seconds");
    return null;
  }
}

/**
 * Generates dynamic Next.js App Router metadata for a public footer page.
 */
export async function generatePublicPageMetadata(slug) {
  const page = await fetchPublishedPage(slug);

  if (!page) {
    return {
      title: "Page Not Found | Imagely",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = page.metaTitle || page.title || "Imagely";
  const description = page.metaDescription || page.summary || undefined;

  const metadata = {
    title: `${title} | Imagely`,
    description,
    robots: {
      index: Boolean(page.robotsIndex),
      follow: Boolean(page.robotsFollow),
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };

  // Only include canonical URL when explicitly provided; do not invent when missing
  if (page.canonicalUrl && page.canonicalUrl.trim()) {
    const canonical = page.canonicalUrl.trim();
    metadata.alternates = {
      canonical,
    };
    metadata.openGraph.url = canonical;
  }

  return metadata;
}

/**
 * Internal async component that resolves the page data inside Suspense.
 */
async function PublicPageContent({ slug }) {
  const page = await fetchPublishedPage(slug);

  if (!page) {
    notFound();
  }

  return <LegalPageLayout page={page} />;
}

/**
 * Renders the public page with LegalPageLayout wrapped in a Suspense boundary
 * with a meaningful loading skeleton, satisfying Next.js 16 Cache Components requirements.
 */
export async function renderPublicPage(slug) {
  return (
    <Suspense fallback={<LegalPageSkeleton />}>
      <PublicPageContent slug={slug} />
    </Suspense>
  );
}
