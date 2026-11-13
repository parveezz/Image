
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
      ArrowLeft,
      Save,
      ExternalLink,
      Eye,
      Edit3,
      Check,
      AlertCircle,
      Loader2,
      Globe,
      Search,
} from "lucide-react";

import pagesService from "@/services/pagesService";

function createSlug(value = "") {
      return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
}

function isValidCanonicalUrl(value) {
      if (!value.trim()) return true;

      try {
            const url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
      } catch {
            return false;
      }
}

export default function FooterPageEditor({
      initialPage = null,
      mode = "edit",
}) {
      const router = useRouter();

      const isCreateMode = mode === "create" || !initialPage?.id;

      const [pageData, setPageData] = useState({
            id: initialPage?.id || null,
            title: initialPage?.title || "",
            slug: initialPage?.slug || "",
            summary: initialPage?.summary || initialPage?.description || "",
            content: initialPage?.content || "",
            status: initialPage?.status || "Draft",
            category: initialPage?.category || "General",
            metaTitle: initialPage?.metaTitle || initialPage?.title || "",
            metaDescription:
                  initialPage?.metaDescription || initialPage?.summary || "",
            canonicalUrl: initialPage?.canonicalUrl || "",
            robotsIndex: initialPage?.robotsIndex ?? true,
            robotsFollow: initialPage?.robotsFollow ?? true,
      });

      const [activeTab, setActiveTab] = useState("edit");
      const [submitting, setSubmitting] = useState(false);
      const [errorMessage, setErrorMessage] = useState("");
      const [successMessage, setSuccessMessage] = useState("");
      const [manualSlugEdited, setManualSlugEdited] = useState(!isCreateMode);

      // Clear pending navigation if the editor unmounts.
      useEffect(() => {
            let navigationTimer;

            return () => {
                  if (navigationTimer) {
                        clearTimeout(navigationTimer);
                  }
            };
      }, []);

      const handleTitleChange = (value) => {
            setPageData((prev) => {
                  const updated = {
                        ...prev,
                        title: value,
                  };

                  if (isCreateMode && !manualSlugEdited) {
                        updated.slug = createSlug(value);
                  }

                  if (!prev.metaTitle || prev.metaTitle === prev.title) {
                        updated.metaTitle = value;
                  }

                  return updated;
            });

            setErrorMessage("");
      };

      const handleChange = (field, value) => {
            setPageData((prev) => ({
                  ...prev,
                  [field]: value,
            }));

            setErrorMessage("");
      };

      const handleSubmit = async (event) => {
            event.preventDefault();

            if (submitting) return;

            setErrorMessage("");
            setSuccessMessage("");

            const title = pageData.title.trim();
            const slug = createSlug(pageData.slug);
            const content = pageData.content.trim();
            const metaTitle = pageData.metaTitle.trim();
            const metaDescription = pageData.metaDescription.trim();
            const canonicalUrl = pageData.canonicalUrl.trim();

            // Required field validation
            if (!title) {
                  setErrorMessage("Page title is required.");
                  return;
            }

            if (!slug) {
                  setErrorMessage("URL slug is required.");
                  return;
            }

            if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
                  setErrorMessage(
                        "Slug must contain lowercase letters, numbers and hyphens only."
                  );
                  return;
            }

            if (!content) {
                  setErrorMessage("Page content cannot be empty.");
                  return;
            }

            // Canonical URL validation
            if (!isValidCanonicalUrl(canonicalUrl)) {
                  setErrorMessage(
                        "Please enter a valid absolute canonical URL using HTTP or HTTPS."
                  );
                  return;
            }

            // Keep payload aligned with the existing backend schema.
            const payload = {
                  title,
                  slug,
                  summary: pageData.summary.trim(),
                  content: pageData.content,
                  status: pageData.status,
                  metaTitle,
                  metaDescription,
                  canonicalUrl,
                  robotsIndex: pageData.robotsIndex,
                  robotsFollow: pageData.robotsFollow,
            };

            setSubmitting(true);

            try {
                  if (isCreateMode) {
                        await pagesService.createPage(payload);
                        setSuccessMessage("Page created successfully! Redirecting...");
                  } else {
                        await pagesService.updatePage(pageData.id, payload);
                        setSuccessMessage("Page updated successfully! Redirecting...");
                  }

                  // Allow the success message to be visible before navigating.
                  setTimeout(() => {
                        router.push("/admin/footer-pages");
                  }, 1200);
            } catch (error) {
                  console.error("Footer page save error:", error);

                  setErrorMessage(
                        error?.message ||
                        "Failed to save page. Please check the fields and try again."
                  );

                  setSubmitting(false);
            }
      };

      const metaTitleLength = pageData.metaTitle.length;
      const metaDescLength = pageData.metaDescription.length;

      const slugPreview = pageData.slug
            ? `/${createSlug(pageData.slug)}`
            : "Set up the URL path and content";

      return (
            <div className="space-y-6">
                  {/* Top bar */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                              <Link
                                    href="/admin/footer-pages"
                                    aria-label="Back to footer pages"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-black"
                              >
                                    <ArrowLeft size={18} aria-hidden="true" />
                              </Link>

                              <div>
                                    <h1 className="font-poppins text-xl font-bold text-gray-900">
                                          {isCreateMode
                                                ? "Create New Footer Page"
                                                : `Edit: ${pageData.title || "Footer Page"}`}
                                    </h1>

                                    <p className="text-xs text-gray-500">
                                          {slugPreview.startsWith("/")
                                                ? `Public path: ${slugPreview}`
                                                : slugPreview}
                                    </p>
                              </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                              {successMessage && (
                                    <span
                                          role="status"
                                          className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                                    >
                                          <Check size={14} aria-hidden="true" />
                                          {successMessage}
                                    </span>
                              )}

                              {!isCreateMode && pageData.slug && (
                                    <Link
                                          href={`/${createSlug(pageData.slug)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-black"
                                    >
                                          <ExternalLink size={15} aria-hidden="true" />
                                          View Live
                                    </Link>
                              )}

                              <button
                                    type="submit"
                                    form="footer-page-form"
                                    disabled={submitting}
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                    {submitting ? (
                                          <>
                                                <Loader2
                                                      size={15}
                                                      className="animate-spin"
                                                      aria-hidden="true"
                                                />
                                                <span>Saving...</span>
                                          </>
                                    ) : (
                                          <>
                                                <Save size={15} aria-hidden="true" />
                                                <span>
                                                      {isCreateMode ? "Create Page" : "Save Changes"}
                                                </span>
                                          </>
                                    )}
                              </button>
                        </div>
                  </div>

                  {/* Error alert */}
                  {errorMessage && (
                        <div
                              role="alert"
                              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                              <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0 text-red-500"
                                    aria-hidden="true"
                              />

                              <div className="flex-1">
                                    <p className="font-semibold">Unable to save page</p>
                                    <p className="mt-0.5 text-xs text-red-600">
                                          {errorMessage}
                                    </p>
                              </div>
                        </div>
                  )}

                  <form
                        id="footer-page-form"
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                  >
                        {/* Main editor section */}
                        <div className="space-y-6 lg:col-span-2">
                              {/* General information */}
                              <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h2 className="border-b border-gray-100 pb-3 text-sm font-semibold text-gray-900">
                                          General Information
                                    </h2>

                                    <div>
                                          <label
                                                htmlFor="page-title"
                                                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600"
                                          >
                                                Page Title <span className="text-red-500">*</span>
                                          </label>

                                          <input
                                                id="page-title"
                                                type="text"
                                                value={pageData.title}
                                                onChange={(event) =>
                                                      handleTitleChange(event.target.value)
                                                }
                                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                                placeholder="e.g. Terms of Service"
                                                autoComplete="off"
                                                required
                                          />
                                    </div>

                                    <div>
                                          <label
                                                htmlFor="page-summary"
                                                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600"
                                          >
                                                Page Summary
                                          </label>

                                          <textarea
                                                id="page-summary"
                                                rows={2}
                                                value={pageData.summary}
                                                onChange={(event) =>
                                                      handleChange("summary", event.target.value)
                                                }
                                                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                                placeholder="Brief overview of this page..."
                                          />
                                    </div>
                              </section>

                              {/* Content editor */}
                              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/75 px-6 py-3">
                                          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Page Content <span className="text-red-500">*</span>
                                          </h2>

                                          <div
                                                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 text-xs"
                                                aria-label="Content editor view"
                                          >
                                                <button
                                                      type="button"
                                                      onClick={() => setActiveTab("edit")}
                                                      aria-pressed={activeTab === "edit"}
                                                      className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 font-medium transition ${activeTab === "edit"
                                                            ? "bg-pink-50 font-semibold text-pink-600"
                                                            : "text-gray-600 hover:text-black"
                                                            }`}
                                                >
                                                      <Edit3 size={13} aria-hidden="true" />
                                                      Edit Content
                                                </button>

                                                <button
                                                      type="button"
                                                      onClick={() => setActiveTab("preview")}
                                                      aria-pressed={activeTab === "preview"}
                                                      className={`inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-1 font-medium transition ${activeTab === "preview"
                                                            ? "bg-pink-50 font-semibold text-pink-600"
                                                            : "text-gray-600 hover:text-black"
                                                            }`}
                                                >
                                                      <Eye size={13} aria-hidden="true" />
                                                      Live Preview
                                                </button>
                                          </div>
                                    </div>

                                    <div className="p-6">
                                          {activeTab === "edit" ? (
                                                <textarea
                                                      id="page-content"
                                                      rows={16}
                                                      value={pageData.content}
                                                      onChange={(event) =>
                                                            handleChange("content", event.target.value)
                                                      }
                                                      aria-label="Page content"
                                                      className="w-full rounded-lg border border-gray-200 p-4 font-mono text-sm leading-relaxed text-gray-800 outline-none transition focus:border-pink-500"
                                                      placeholder="Write your policy or support document here (Markdown or plain text)..."
                                                      required
                                                />
                                          ) : (
                                                <article className="min-h-[384px] rounded-lg border border-dashed border-gray-200 bg-gray-50/30 p-6">
                                                      <h2 className="mb-4 font-poppins text-2xl font-bold text-gray-900">
                                                            {pageData.title || "Untitled Page"}
                                                      </h2>

                                                      <div className="space-y-4 whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                                                            {pageData.content || (
                                                                  <p className="italic text-gray-400">
                                                                        No content to preview yet. Switch to Edit Content
                                                                        to write.
                                                                  </p>
                                                            )}
                                                      </div>
                                                </article>
                                          )}
                                    </div>
                              </section>

                              {/* SEO settings */}
                              <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                          <Search
                                                size={16}
                                                className="text-pink-500"
                                                aria-hidden="true"
                                          />

                                          <h2 className="text-sm font-semibold text-gray-900">
                                                Search Engine Optimization (SEO)
                                          </h2>
                                    </div>

                                    {/* Meta title */}
                                    <div>
                                          <div className="mb-2 flex items-center justify-between gap-2">
                                                <label
                                                      htmlFor="meta-title"
                                                      className="text-xs font-semibold uppercase tracking-wider text-gray-600"
                                                >
                                                      Meta Title
                                                </label>

                                                <span
                                                      className={`text-xs ${metaTitleLength > 60
                                                            ? "font-semibold text-amber-600"
                                                            : "text-gray-400"
                                                            }`}
                                                >
                                                      {metaTitleLength} / 60 characters
                                                </span>
                                          </div>

                                          <input
                                                id="meta-title"
                                                type="text"
                                                value={pageData.metaTitle}
                                                onChange={(event) =>
                                                      handleChange("metaTitle", event.target.value)
                                                }
                                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                                placeholder="Page Title | Imagely"
                                          />
                                    </div>

                                    {/* Meta description */}
                                    <div>
                                          <div className="mb-2 flex items-center justify-between gap-2">
                                                <label
                                                      htmlFor="meta-description"
                                                      className="text-xs font-semibold uppercase tracking-wider text-gray-600"
                                                >
                                                      Meta Description
                                                </label>

                                                <span
                                                      className={`text-xs ${metaDescLength > 160
                                                            ? "font-semibold text-amber-600"
                                                            : "text-gray-400"
                                                            }`}
                                                >
                                                      {metaDescLength} / 160 characters
                                                </span>
                                          </div>

                                          <textarea
                                                id="meta-description"
                                                rows={3}
                                                value={pageData.metaDescription}
                                                onChange={(event) =>
                                                      handleChange("metaDescription", event.target.value)
                                                }
                                                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                                placeholder="Clear and concise summary of the page for search engine snippets..."
                                          />
                                    </div>

                                    {/* Canonical URL */}
                                    <div>
                                          <label
                                                htmlFor="canonical-url"
                                                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600"
                                          >
                                                Canonical URL
                                          </label>

                                          <div className="relative">
                                                <Globe
                                                      size={16}
                                                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                                      aria-hidden="true"
                                                />

                                                <input
                                                      id="canonical-url"
                                                      type="url"
                                                      value={pageData.canonicalUrl}
                                                      onChange={(event) =>
                                                            handleChange("canonicalUrl", event.target.value)
                                                      }
                                                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                                      placeholder="https://imagely.com/terms"
                                                />
                                          </div>

                                          <p className="mt-1 text-[11px] text-gray-400">
                                                Enter an absolute URL. Leave empty to use the page URL.
                                          </p>
                                    </div>

                                    {/* Robots directives */}
                                    <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
                                          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3.5 hover:bg-gray-50/50">
                                                <input
                                                      type="checkbox"
                                                      checked={pageData.robotsIndex}
                                                      onChange={(event) =>
                                                            handleChange("robotsIndex", event.target.checked)
                                                      }
                                                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                                />

                                                <span>
                                                      <span className="block text-xs font-semibold text-gray-800">
                                                            Robots Index
                                                      </span>

                                                      <span className="mt-0.5 block text-[11px] text-gray-500">
                                                            Allow search engines to index this page.
                                                      </span>
                                                </span>
                                          </label>

                                          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3.5 hover:bg-gray-50/50">
                                                <input
                                                      type="checkbox"
                                                      checked={pageData.robotsFollow}
                                                      onChange={(event) =>
                                                            handleChange("robotsFollow", event.target.checked)
                                                      }
                                                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                                />

                                                <span>
                                                      <span className="block text-xs font-semibold text-gray-800">
                                                            Robots Follow
                                                      </span>

                                                      <span className="mt-0.5 block text-[11px] text-gray-500">
                                                            Allow search engines to follow page links.
                                                      </span>
                                                </span>
                                          </label>
                                    </div>
                              </section>
                        </div>

                        {/* Publishing settings */}
                        <aside className="space-y-6">
                              <section className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h2 className="border-b border-gray-100 pb-3 text-sm font-semibold text-gray-900">
                                          Publishing Settings
                                    </h2>

                                    {/* Status */}
                                    <div>
                                          <label
                                                htmlFor="page-status"
                                                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-600"
                                          >
                                                Status
                                          </label>

                                          <select
                                                id="page-status"
                                                value={pageData.status}
                                                onChange={(event) =>
                                                      handleChange("status", event.target.value)
                                                }
                                                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                          >
                                                <option value="Published">
                                                      Published (Live on site)
                                                </option>

                                                <option value="Draft">
                                                      Draft (Internal only)
                                                </option>
                                          </select>
                                    </div>

                                    {/* URL slug */}
                                    <div>
                                          <div className="mb-2 flex items-center justify-between gap-2">
                                                <label
                                                      htmlFor="page-slug"
                                                      className="text-xs font-semibold uppercase tracking-wider text-gray-600"
                                                >
                                                      URL Slug <span className="text-red-500">*</span>
                                                </label>

                                                {isCreateMode && (
                                                      <span className="text-[11px] text-gray-400">
                                                            Auto-generated
                                                      </span>
                                                )}
                                          </div>

                                          <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-gray-50 text-sm focus-within:border-pink-500">
                                                <span className="flex select-none items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-400">
                                                      /
                                                </span>

                                                <input
                                                      id="page-slug"
                                                      type="text"
                                                      value={pageData.slug}
                                                      onChange={(event) => {
                                                            setManualSlugEdited(true);
                                                            handleChange("slug", event.target.value);
                                                      }}
                                                      placeholder="e.g. privacy"
                                                      className="w-full bg-white px-3 py-2.5 text-gray-900 outline-none"
                                                      autoComplete="off"
                                                      required
                                                />
                                          </div>

                                          <p className="mt-1 text-[11px] text-gray-400">
                                                Lowercase letters, numbers and hyphens only.
                                          </p>

                                          {pageData.slug && (
                                                <p className="mt-2 break-all text-xs text-gray-500">
                                                      Preview: /{createSlug(pageData.slug)}
                                                </p>
                                          )}
                                    </div>

                                    {/* Publishing information */}
                                    <div className="border-t border-gray-100 pt-3">
                                          <div className="flex items-start gap-2.5 text-xs text-gray-500">
                                                <AlertCircle
                                                      size={15}
                                                      className="mt-0.5 shrink-0 text-gray-400"
                                                      aria-hidden="true"
                                                />

                                                <p>
                                                      {pageData.status === "Published"
                                                            ? "Published pages are available on the public website."
                                                            : "Draft pages are saved internally and should remain hidden from the public."}
                                                </p>
                                          </div>
                                    </div>
                              </section>
                        </aside>
                  </form>
            </div>
      );
}
