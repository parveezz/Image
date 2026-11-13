"use client";

import { useState } from "react";
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

export default function FooterPageEditor({ initialPage = null, mode = "edit" }) {
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
            metaDescription: initialPage?.metaDescription || initialPage?.summary || "",
            canonicalUrl: initialPage?.canonicalUrl || "",
            robotsIndex: initialPage?.robotsIndex ?? true,
            robotsFollow: initialPage?.robotsFollow ?? true,
      });

      const [activeTab, setActiveTab] = useState("edit"); // "edit" | "preview"
      const [submitting, setSubmitting] = useState(false);
      const [errorMessage, setErrorMessage] = useState("");
      const [successMessage, setSuccessMessage] = useState("");
      const [manualSlugEdited, setManualSlugEdited] = useState(!isCreateMode);

      // Auto-generate slug from title in Create mode if not manually changed
      const handleTitleChange = (val) => {
            setPageData((prev) => {
                  const updated = { ...prev, title: val };
                  if (isCreateMode && !manualSlugEdited) {
                        updated.slug = val
                              .toLowerCase()
                              .trim()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-+|-+$/g, "");
                  }
                  if (!prev.metaTitle || prev.metaTitle === prev.title) {
                        updated.metaTitle = val;
                  }
                  return updated;
            });
            if (errorMessage) setErrorMessage("");
      };

      const handleChange = (field, value) => {
            setPageData((prev) => ({ ...prev, [field]: value }));
            if (errorMessage) setErrorMessage("");
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setErrorMessage("");
            setSuccessMessage("");

            // Basic validation
            if (!pageData.title.trim()) {
                  setErrorMessage("Page title is required.");
                  return;
            }
            if (!pageData.slug.trim()) {
                  setErrorMessage("URL slug is required.");
                  return;
            }
            if (!pageData.content.trim()) {
                  setErrorMessage("Page content cannot be empty.");
                  return;
            }

            setSubmitting(true);

            // Construct payload matching exact backend schema
            const payload = {
                  title: pageData.title.trim(),
                  slug: pageData.slug.trim(),
                  summary: pageData.summary.trim(),
                  content: pageData.content,
                  status: pageData.status,
                  metaTitle: pageData.metaTitle.trim(),
                  metaDescription: pageData.metaDescription.trim(),
                  canonicalUrl: pageData.canonicalUrl.trim(),
                  robotsIndex: pageData.robotsIndex,
                  robotsFollow: pageData.robotsFollow,
            };

            try {
                  if (isCreateMode) {
                        await pagesService.createPage(payload);
                        setSuccessMessage("Page created successfully! Redirecting...");
                  } else {
                        await pagesService.updatePage(pageData.id, payload);
                        setSuccessMessage("Page updated successfully! Redirecting...");
                  }

                  // Navigate back to list after short confirmation
                  setTimeout(() => {
                        router.push("/admin/footer-pages");
                  }, 1200);
            } catch (err) {
                  setErrorMessage(
                        err.message || "Failed to save page. Please check the fields and try again."
                  );
            } finally {
                  setSubmitting(false);
            }
      };

      // Character counters
      const metaTitleLength = pageData.metaTitle?.length || 0;
      const metaDescLength = pageData.metaDescription?.length || 0;

      return (
            <div className="space-y-6">
                  {/* Top Bar */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                              <Link
                                    href="/admin/footer-pages"
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-black cursor-pointer"
                              >
                                    <ArrowLeft size={18} />
                              </Link>
                              <div>
                                    <h1 className="text-xl font-bold text-gray-900 font-poppins">
                                          {isCreateMode
                                                ? "Create New Footer Page"
                                                : `Edit: ${pageData.title || "Footer Page"}`}
                                    </h1>
                                    <p className="text-xs text-gray-500">
                                          {pageData.slug
                                                ? `Public path: /${pageData.slug}`
                                                : "Set up the URL path and content"}
                                    </p>
                              </div>
                        </div>

                        <div className="flex items-center gap-3">
                              {successMessage && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 animate-fade-in">
                                          <Check size={14} />
                                          {successMessage}
                                    </span>
                              )}

                              {!isCreateMode && pageData.slug && (
                                    <Link
                                          href={`/${pageData.slug}`}
                                          target="_blank"
                                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black shadow-xs cursor-pointer"
                                    >
                                          <ExternalLink size={15} />
                                          View Live
                                    </Link>
                              )}

                              <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-pink-600 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                              >
                                    {submitting ? (
                                          <>
                                                <Loader2 size={15} className="animate-spin" />
                                                <span>Saving...</span>
                                          </>
                                    ) : (
                                          <>
                                                <Save size={15} />
                                                <span>{isCreateMode ? "Create Page" : "Save Changes"}</span>
                                          </>
                                    )}
                              </button>
                        </div>
                  </div>

                  {/* Backend Error Alert */}
                  {errorMessage && (
                        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                              <AlertCircle size={18} className="shrink-0 text-red-500 mt-0.5" />
                              <div className="flex-1">
                                    <p className="font-semibold">Unable to save page</p>
                                    <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
                              </div>
                        </div>
                  )}

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Main Editor Section (2 cols) */}
                        <div className="space-y-6 lg:col-span-2">
                              {/* General Information Card */}
                              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
                                    <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
                                          General Information
                                    </h2>

                                    <div>
                                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                                Page Title <span className="text-red-500">*</span>
                                          </label>
                                          <input
                                                type="text"
                                                value={pageData.title}
                                                onChange={(e) => handleTitleChange(e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                                placeholder="e.g. Terms of Service"
                                                required
                                          />
                                    </div>

                                    <div>
                                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                                Page Summary
                                          </label>
                                          <textarea
                                                rows={2}
                                                value={pageData.summary}
                                                onChange={(e) => handleChange("summary", e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500 resize-none"
                                                placeholder="Brief overview of this page..."
                                          />
                                    </div>
                              </div>

                              {/* Content Editor Card */}
                              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/75 px-6 py-3">
                                          <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Page Content <span className="text-red-500">*</span>
                                          </label>

                                          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 text-xs">
                                                <button
                                                      type="button"
                                                      onClick={() => setActiveTab("edit")}
                                                      className={`inline-flex items-center gap-1 rounded-md px-3 py-1 font-medium transition cursor-pointer ${
                                                            activeTab === "edit"
                                                                  ? "bg-pink-50 text-pink-600 font-semibold"
                                                                  : "text-gray-600 hover:text-black"
                                                      }`}
                                                >
                                                      <Edit3 size={13} />
                                                      Edit Content
                                                </button>
                                                <button
                                                      type="button"
                                                      onClick={() => setActiveTab("preview")}
                                                      className={`inline-flex items-center gap-1 rounded-md px-3 py-1 font-medium transition cursor-pointer ${
                                                            activeTab === "preview"
                                                                  ? "bg-pink-50 text-pink-600 font-semibold"
                                                                  : "text-gray-600 hover:text-black"
                                                      }`}
                                                >
                                                      <Eye size={13} />
                                                      Live Preview
                                                </button>
                                          </div>
                                    </div>

                                    <div className="p-6">
                                          {activeTab === "edit" ? (
                                                <textarea
                                                      rows={16}
                                                      value={pageData.content}
                                                      onChange={(e) => handleChange("content", e.target.value)}
                                                      className="w-full rounded-lg border border-gray-200 p-4 font-mono text-sm text-gray-800 outline-none transition focus:border-pink-500 leading-relaxed"
                                                      placeholder="Write your policy or support document here (Markdown or plain text)..."
                                                      required
                                                />
                                          ) : (
                                                <div className="min-h-[384px] rounded-lg border border-dashed border-gray-200 p-6 bg-gray-50/30">
                                                      <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
                                                            {pageData.title || "Untitled Page"}
                                                      </h2>
                                                      <div className="space-y-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-sans">
                                                            {pageData.content || (
                                                                  <p className="text-gray-400 italic">
                                                                        No content to preview yet. Switch to Edit Content to write.
                                                                  </p>
                                                            )}
                                                      </div>
                                                </div>
                                          )}
                                    </div>
                              </div>

                              {/* SEO Settings Card */}
                              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                                          <Search size={16} className="text-pink-500" />
                                          <h2 className="text-sm font-semibold text-gray-900">
                                                Search Engine Optimization (SEO)
                                          </h2>
                                    </div>

                                    <div>
                                          <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                      Meta Title
                                                </label>
                                                <span
                                                      className={`text-xs ${
                                                            metaTitleLength > 60
                                                                  ? "text-amber-600 font-semibold"
                                                                  : "text-gray-400"
                                                      }`}
                                                >
                                                      {metaTitleLength} / 60 characters
                                                </span>
                                          </div>
                                          <input
                                                type="text"
                                                value={pageData.metaTitle}
                                                onChange={(e) => handleChange("metaTitle", e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                                placeholder="Page Title | Imagely"
                                          />
                                    </div>

                                    <div>
                                          <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                      Meta Description
                                                </label>
                                                <span
                                                      className={`text-xs ${
                                                            metaDescLength > 160
                                                                  ? "text-amber-600 font-semibold"
                                                                  : "text-gray-400"
                                                      }`}
                                                >
                                                      {metaDescLength} / 160 characters
                                                </span>
                                          </div>
                                          <textarea
                                                rows={3}
                                                value={pageData.metaDescription}
                                                onChange={(e) => handleChange("metaDescription", e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500 resize-none"
                                                placeholder="Clear and concise summary of the page for search engine snippet..."
                                          />
                                    </div>

                                    <div>
                                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                                Canonical URL
                                          </label>
                                          <div className="relative">
                                                <Globe
                                                      size={16}
                                                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                                />
                                                <input
                                                      type="url"
                                                      value={pageData.canonicalUrl}
                                                      onChange={(e) => handleChange("canonicalUrl", e.target.value)}
                                                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                                      placeholder="https://imagely.com/terms"
                                                />
                                          </div>
                                    </div>

                                    {/* Robots Directives */}
                                    <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3.5 hover:bg-gray-50/50 cursor-pointer">
                                                <input
                                                      type="checkbox"
                                                      checked={pageData.robotsIndex}
                                                      onChange={(e) => handleChange("robotsIndex", e.target.checked)}
                                                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                                />
                                                <div>
                                                      <span className="text-xs font-semibold text-gray-800">
                                                            Robots Index
                                                      </span>
                                                      <p className="text-[11px] text-gray-500 mt-0.5">
                                                            Allow search engines to index this page
                                                      </p>
                                                </div>
                                          </label>

                                          <label className="flex items-start gap-3 rounded-lg border border-gray-200 p-3.5 hover:bg-gray-50/50 cursor-pointer">
                                                <input
                                                      type="checkbox"
                                                      checked={pageData.robotsFollow}
                                                      onChange={(e) => handleChange("robotsFollow", e.target.checked)}
                                                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                                />
                                                <div>
                                                      <span className="text-xs font-semibold text-gray-800">
                                                            Robots Follow
                                                      </span>
                                                      <p className="text-[11px] text-gray-500 mt-0.5">
                                                            Allow search engines to follow page links
                                                      </p>
                                                </div>
                                          </label>
                                    </div>
                              </div>
                        </div>

                        {/* Sidebar Settings Section (1 col) */}
                        <div className="space-y-6">
                              {/* Publishing Settings Card */}
                              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                                    <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">
                                          Publishing Settings
                                    </h3>

                                    <div>
                                          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                                                Status
                                          </label>
                                          <select
                                                value={pageData.status}
                                                onChange={(e) => handleChange("status", e.target.value)}
                                                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-pink-500"
                                          >
                                                <option value="Published">Published (Live on site)</option>
                                                <option value="Draft">Draft (Internal only)</option>
                                          </select>
                                    </div>

                                    <div>
                                          <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                      URL Slug <span className="text-red-500">*</span>
                                                </label>
                                                {isCreateMode && (
                                                      <span className="text-[11px] text-gray-400">
                                                            Auto-generated
                                                      </span>
                                                )}
                                          </div>
                                          <div className="flex rounded-lg border border-gray-200 bg-gray-50 text-sm overflow-hidden focus-within:border-pink-500">
                                                <span className="flex items-center px-3 text-gray-400 select-none bg-gray-50 border-r border-gray-200 text-xs">
                                                      /
                                                </span>
                                                <input
                                                      type="text"
                                                      value={pageData.slug}
                                                      onChange={(e) => {
                                                            setManualSlugEdited(true);
                                                            handleChange("slug", e.target.value);
                                                      }}
                                                      placeholder="e.g. privacy"
                                                      className="w-full bg-white px-3 py-2.5 text-gray-900 outline-none"
                                                      required
                                                />
                                          </div>
                                          <p className="mt-1 text-[11px] text-gray-400">
                                                Lowercase letters, numbers, and hyphens only
                                          </p>
                                    </div>

                                    <div className="pt-2 border-t border-gray-100">
                                          <div className="flex items-start gap-2.5 text-xs text-gray-500">
                                                <AlertCircle size={15} className="text-gray-400 shrink-0 mt-0.5" />
                                                <p>
                                                      {pageData.status === "Published"
                                                            ? "Published pages are immediately live on the public website."
                                                            : "Draft pages are saved internally and hidden from the public."}
                                                </p>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </form>
            </div>
      );
}
