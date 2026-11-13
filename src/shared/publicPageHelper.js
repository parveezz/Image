
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";

import pagesService from "@/services/pagesService";
import LegalPageLayout from "@/shared/LegalPageLayout";
import LegalPageSkeleton from "@/shared/LegalPageSkeleton";

/**
 * Fetch a published page by slug.
 * Published pages receive a longer cache lifetime.
 * Missing or unpublished pages receive a short cache lifetime.
 */
export async function fetchPublishedPage(slug) {
  "use cache";

  cacheTag(`public-page-${slug}`);

  try {
    const page = await pagesService.getPublicPageBySlug(slug);

    if (!page || page.status !== "Published") {
      cacheLife("seconds");
      return null;
    }

    cacheLife("hours");

    return page;
  } catch (error) {
    console.error(`Failed to fetch public page: ${slug}`, error);

    cacheLife("seconds");

    return null;
  }
}

/**
 * Generate metadata for a public legal page.
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
  const description =
    page.metaDescription || page.summary || undefined;

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

  // Add canonical URL only when supplied by the backend.
  if (
    typeof page.canonicalUrl === "string" &&
    page.canonicalUrl.trim()
  ) {
    const canonical = page.canonicalUrl.trim();

    metadata.alternates = {
      canonical,
    };

    metadata.openGraph.url = canonical;
  }

  return metadata;
}

/**
 * Resolve page content inside the Suspense boundary.
 */
async function PublicPageContent({ slug }) {
  const page = await fetchPublishedPage(slug);

  if (!page) {
    notFound();
  }

  return <LegalPageLayout page={page} />;
}

/**
 * Render the public page with a loading skeleton.
 */
export function renderPublicPage(slug) {
  return (
    <Suspense fallback={<LegalPageSkeleton />}>
      <PublicPageContent slug={slug} />
    </Suspense>
  );
}
