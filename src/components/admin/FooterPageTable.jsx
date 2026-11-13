
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import {
      Search,
      Edit,
      ExternalLink,
      Trash2,
      FileText,
      CheckCircle2,
      Clock,
      ChevronLeft,
      ChevronRight,
      AlertCircle,
      RefreshCw,
      Loader2,
      X,
} from "lucide-react";

import pagesService from "@/services/pagesService";

export default function FooterPageTable({ onStatsUpdate }) {
      const [pages, setPages] = useState([]);
      const [total, setTotal] = useState(0);
      const [page, setPage] = useState(1);
      const [limit] = useState(10);
      const [totalPages, setTotalPages] = useState(1);

      const [searchQuery, setSearchQuery] = useState("");
      const [debouncedSearch, setDebouncedSearch] = useState("");
      const [statusFilter, setStatusFilter] = useState("all");

      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [reloadKey, setReloadKey] = useState(0);

      const [deleteModal, setDeleteModal] = useState({
            isOpen: false,
            page: null,
      });

      const [isDeleting, setIsDeleting] = useState(false);
      const [toast, setToast] = useState(null);

      const toastTimerRef = useRef(null);
      const statsCallbackRef = useRef(onStatsUpdate);

      // Keep the latest callback without causing unnecessary data requests.
      statsCallbackRef.current = onStatsUpdate;

      // Clean up toast timer on unmount.
      useEffect(() => {
            return () => {
                  if (toastTimerRef.current) {
                        clearTimeout(toastTimerRef.current);
                  }
            };
      }, []);

      // Toast notification.
      const showToast = (message, type = "success") => {
            if (toastTimerRef.current) {
                  clearTimeout(toastTimerRef.current);
            }

            setToast({ message, type });

            toastTimerRef.current = setTimeout(() => {
                  setToast(null);
                  toastTimerRef.current = null;
            }, 3500);
      };

      // Debounced search.
      useEffect(() => {
            const timer = setTimeout(() => {
                  setDebouncedSearch(searchQuery.trim());
                  setPage(1);
            }, 300);

            return () => clearTimeout(timer);
      }, [searchQuery]);

      // Fetch footer pages.
      useEffect(() => {
            let ignore = false;

            async function loadPages() {
                  setLoading(true);
                  setError(null);

                  try {
                        const data = await pagesService.getPages({
                              page,
                              limit,
                              search: debouncedSearch,
                              status: statusFilter,
                        });

                        if (ignore) return;

                        const fetchedPages = Array.isArray(data?.pages)
                              ? data.pages
                              : [];

                        const fetchedTotal = Number(data?.total) || 0;
                        const fetchedTotalPages = Math.max(
                              1,
                              Number(data?.totalPages) || 1
                        );

                        setPages(fetchedPages);
                        setTotal(fetchedTotal);
                        setTotalPages(fetchedTotalPages);

                        // Use backend aggregate counts when available.
                        // Otherwise, these counts represent only the current page.
                        const publishedCount =
                              data?.statusCounts?.published ??
                              fetchedPages.filter((item) => item.status === "Published").length;

                        const draftCount =
                              data?.statusCounts?.draft ??
                              fetchedPages.filter((item) => item.status === "Draft").length;

                        if (typeof statsCallbackRef.current === "function") {
                              statsCallbackRef.current({
                                    total: fetchedTotal,
                                    published: publishedCount,
                                    draft: draftCount,
                              });
                        }
                  } catch (err) {
                        if (!ignore) {
                              setError(
                                    err?.message ||
                                    "Failed to load footer pages from database."
                              );
                        }
                  } finally {
                        if (!ignore) {
                              setLoading(false);
                        }
                  }
            }

            loadPages();

            return () => {
                  ignore = true;
            };
      }, [page, limit, debouncedSearch, statusFilter, reloadKey]);

      // Refresh table.
      const handleRefresh = () => {
            setReloadKey((key) => key + 1);
      };

      // Change status filter.
      const handleStatusFilter = (status) => {
            if (status === statusFilter) return;

            setStatusFilter(status);
            setPage(1);
      };

      // Open delete confirmation.
      const handleDeleteOpen = (pageItem) => {
            setDeleteModal({
                  isOpen: true,
                  page: pageItem,
            });
      };

      // Close delete confirmation.
      const handleDeleteClose = () => {
            if (isDeleting) return;

            setDeleteModal({
                  isOpen: false,
                  page: null,
            });
      };

      // Delete page.
      const handleDeleteConfirm = async () => {
            if (!deleteModal.page || isDeleting) return;

            setIsDeleting(true);

            try {
                  await pagesService.deletePage(deleteModal.page.id);

                  showToast(
                        `Page "${deleteModal.page.title}" deleted successfully.`
                  );

                  setDeleteModal({
                        isOpen: false,
                        page: null,
                  });

                  // If the last record on this page was deleted,
                  // move to the previous page.
                  if (pages.length === 1 && page > 1) {
                        setPage((current) => current - 1);
                  } else {
                        handleRefresh();
                  }
            } catch (err) {
                  showToast(
                        err?.message || "Failed to delete page.",
                        "error"
                  );
            } finally {
                  setIsDeleting(false);
            }
      };

      // Close modal with Escape key.
      useEffect(() => {
            if (!deleteModal.isOpen) return;

            const handleEscape = (event) => {
                  if (event.key === "Escape" && !isDeleting) {
                        handleDeleteClose();
                  }
            };

            window.addEventListener("keydown", handleEscape);

            return () => {
                  window.removeEventListener("keydown", handleEscape);
            };
      }, [deleteModal.isOpen, isDeleting]);

      // Pagination calculations.
      const startRecord = total > 0 ? (page - 1) * limit + 1 : 0;
      const endRecord = Math.min(page * limit, total);

      const clearFilters = () => {
            setSearchQuery("");
            setStatusFilter("all");
            setPage(1);
      };

      return (
            <div className="space-y-4">
                  {/* Toast notification */}
                  {toast && (
                        <div
                              role={toast.type === "error" ? "alert" : "status"}
                              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium shadow-sm ${toast.type === "error"
                                    ? "border border-red-200 bg-red-50 text-red-700"
                                    : "border border-green-200 bg-green-50 text-green-700"
                                    }`}
                        >
                              <span>{toast.message}</span>

                              <button
                                    type="button"
                                    onClick={() => setToast(null)}
                                    className="text-current opacity-70 hover:opacity-100"
                                    aria-label="Dismiss notification"
                              >
                                    <X size={16} aria-hidden="true" />
                              </button>
                        </div>
                  )}

                  {/* Search and filters */}
                  <section
                        aria-label="Footer page search and filters"
                        className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                        {/* Search */}
                        <div className="relative flex-1">
                              <Search
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    aria-hidden="true"
                              />

                              <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search by title or slug..."
                                    aria-label="Search footer pages by title or slug"
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:bg-white"
                              />
                        </div>

                        {/* Status filters */}
                        <div className="flex flex-wrap items-center gap-3">
                              <div
                                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 p-1 text-xs font-medium"
                                    aria-label="Filter pages by status"
                              >
                                    {[
                                          { label: "All Status", value: "all" },
                                          { label: "Published", value: "Published" },
                                          { label: "Draft", value: "Draft" },
                                    ].map((filter) => (
                                          <button
                                                key={filter.value}
                                                type="button"
                                                onClick={() => handleStatusFilter(filter.value)}
                                                aria-pressed={statusFilter === filter.value}
                                                className={`cursor-pointer rounded-md px-3 py-1.5 transition ${statusFilter === filter.value
                                                      ? filter.value === "Published"
                                                            ? "bg-white font-semibold text-green-700 shadow-xs"
                                                            : filter.value === "Draft"
                                                                  ? "bg-white font-semibold text-yellow-700 shadow-xs"
                                                                  : "bg-white font-semibold text-gray-900 shadow-xs"
                                                      : "text-gray-600 hover:text-black"
                                                      }`}
                                          >
                                                {filter.label}
                                          </button>
                                    ))}
                              </div>

                              <button
                                    type="button"
                                    onClick={handleRefresh}
                                    title="Refresh page list"
                                    aria-label="Refresh footer pages"
                                    disabled={loading}
                                    className="cursor-pointer rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                    <RefreshCw
                                          size={17}
                                          className={loading ? "animate-spin text-pink-500" : ""}
                                          aria-hidden="true"
                                    />
                              </button>
                        </div>
                  </section>

                  {/* Error state */}
                  {error && (
                        <div
                              role="alert"
                              className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >
                              <div className="flex items-center gap-3">
                                    <AlertCircle
                                          size={18}
                                          className="shrink-0 text-red-500"
                                          aria-hidden="true"
                                    />
                                    <span>{error}</span>
                              </div>

                              <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="rounded-md bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 transition hover:bg-red-200"
                              >
                                    Retry
                              </button>
                        </div>
                  )}

                  {/* Pages table */}
                  <section
                        aria-label="Footer pages list"
                        aria-busy={loading}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                        <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm">
                                    <caption className="sr-only">
                                          Footer pages with their publication status, last updated date
                                          and available actions.
                                    </caption>

                                    <thead className="border-b border-gray-100 bg-gray-50/75 text-xs font-semibold uppercase text-gray-500">
                                          <tr>
                                                <th scope="col" className="px-6 py-4">
                                                      Page Title &amp; Slug
                                                </th>

                                                <th scope="col" className="px-6 py-4">
                                                      Status
                                                </th>

                                                <th scope="col" className="px-6 py-4">
                                                      Last Updated
                                                </th>

                                                <th scope="col" className="px-6 py-4 text-right">
                                                      Actions
                                                </th>
                                          </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                          {loading ? (
                                                Array.from({ length: 5 }).map((_, index) => (
                                                      <tr
                                                            key={`skeleton-${index}`}
                                                            className="animate-pulse"
                                                            aria-hidden="true"
                                                      >
                                                            <td className="px-6 py-4">
                                                                  <div className="flex items-start gap-3">
                                                                        <div className="h-9 w-9 rounded-lg bg-gray-200" />

                                                                        <div className="flex-1 space-y-2">
                                                                              <div className="h-4 w-40 rounded bg-gray-200" />
                                                                              <div className="h-3 w-24 rounded bg-gray-100" />
                                                                        </div>
                                                                  </div>
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                  <div className="h-6 w-20 rounded-full bg-gray-200" />
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                  <div className="h-4 w-24 rounded bg-gray-200" />
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                  <div className="flex justify-end gap-2">
                                                                        <div className="h-7 w-14 rounded bg-gray-200" />
                                                                        <div className="h-7 w-14 rounded bg-gray-200" />
                                                                  </div>
                                                            </td>
                                                      </tr>
                                                ))
                                          ) : pages.length > 0 ? (
                                                pages.map((pageItem) => {
                                                      const isPublished = pageItem.status === "Published";

                                                      return (
                                                            <tr
                                                                  key={pageItem.id || pageItem.slug}
                                                                  className="transition hover:bg-gray-50/50"
                                                            >
                                                                  {/* Page information */}
                                                                  <td className="px-6 py-4">
                                                                        <div className="flex items-start gap-3">
                                                                              <div className="mt-0.5 shrink-0 rounded-lg bg-pink-50 p-2 text-pink-600">
                                                                                    <FileText size={18} aria-hidden="true" />
                                                                              </div>

                                                                              <div>
                                                                                    <p className="font-semibold text-gray-900">
                                                                                          {pageItem.title}
                                                                                    </p>

                                                                                    <p className="text-xs text-gray-400">
                                                                                          /{pageItem.slug}
                                                                                    </p>

                                                                                    {pageItem.summary && (
                                                                                          <p className="mt-1 line-clamp-1 max-w-sm text-xs text-gray-500">
                                                                                                {pageItem.summary}
                                                                                          </p>
                                                                                    )}
                                                                              </div>
                                                                        </div>
                                                                  </td>

                                                                  {/* Publication status */}
                                                                  <td className="px-6 py-4">
                                                                        <span
                                                                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isPublished
                                                                                    ? "bg-green-50 text-green-700"
                                                                                    : "bg-yellow-50 text-yellow-700"
                                                                                    }`}
                                                                        >
                                                                              {isPublished ? (
                                                                                    <CheckCircle2
                                                                                          size={13}
                                                                                          aria-hidden="true"
                                                                                    />
                                                                              ) : (
                                                                                    <Clock size={13} aria-hidden="true" />
                                                                              )}

                                                                              {pageItem.status}
                                                                        </span>
                                                                  </td>

                                                                  {/* Last updated */}
                                                                  <td className="px-6 py-4 text-xs text-gray-500">
                                                                        {pageItem.lastUpdated || "Not available"}
                                                                  </td>

                                                                  {/* Actions */}
                                                                  <td className="px-6 py-4 text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                              {isPublished && (
                                                                                    <Link
                                                                                          href={`/${encodeURIComponent(pageItem.slug)}`}
                                                                                          target="_blank"
                                                                                          rel="noopener noreferrer"
                                                                                          aria-label={`View ${pageItem.title} live`}
                                                                                          title="View Live Page"
                                                                                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-black"
                                                                                    >
                                                                                          <ExternalLink
                                                                                                size={14}
                                                                                                aria-hidden="true"
                                                                                          />
                                                                                          View
                                                                                    </Link>
                                                                              )}

                                                                              <Link
                                                                                    href={`/admin/footer-pages/${encodeURIComponent(
                                                                                          pageItem.id || pageItem.slug
                                                                                    )}`}
                                                                                    aria-label={`Edit ${pageItem.title}`}
                                                                                    title="Edit Page"
                                                                                    className="inline-flex items-center gap-1 rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-pink-600"
                                                                              >
                                                                                    <Edit size={14} aria-hidden="true" />
                                                                                    Edit
                                                                              </Link>

                                                                              <button
                                                                                    type="button"
                                                                                    onClick={() => handleDeleteOpen(pageItem)}
                                                                                    aria-label={`Delete ${pageItem.title}`}
                                                                                    title="Delete Page"
                                                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                                                                              >
                                                                                    <Trash2 size={14} aria-hidden="true" />
                                                                              </button>
                                                                        </div>
                                                                  </td>
                                                            </tr>
                                                      );
                                                })
                                          ) : (
                                                <tr>
                                                      <td colSpan={4} className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center justify-center">
                                                                  <FileText
                                                                        size={36}
                                                                        className="mb-2 text-gray-300"
                                                                        aria-hidden="true"
                                                                  />

                                                                  <p className="text-sm font-semibold text-gray-700">
                                                                        No pages found
                                                                  </p>

                                                                  <p className="mt-1 max-w-sm text-xs text-gray-400">
                                                                        {searchQuery || statusFilter !== "all"
                                                                              ? "Try adjusting your search query or filter options."
                                                                              : "No footer pages have been created in the database yet."}
                                                                  </p>

                                                                  {(searchQuery || statusFilter !== "all") && (
                                                                        <button
                                                                              type="button"
                                                                              onClick={clearFilters}
                                                                              className="mt-3 cursor-pointer text-xs font-semibold text-pink-600 hover:text-pink-700"
                                                                        >
                                                                              Clear filters
                                                                        </button>
                                                                  )}
                                                            </div>
                                                      </td>
                                                </tr>
                                          )}
                                    </tbody>
                              </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/50 px-6 py-4 text-xs text-gray-500 sm:flex-row">
                              <p>
                                    Showing{" "}
                                    <span className="font-semibold text-gray-800">
                                          {startRecord}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold text-gray-800">
                                          {endRecord}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-gray-800">
                                          {total}
                                    </span>{" "}
                                    records
                              </p>

                              <nav
                                    aria-label="Footer pages pagination"
                                    className="flex items-center gap-2"
                              >
                                    <button
                                          type="button"
                                          disabled={page <= 1 || loading}
                                          onClick={() =>
                                                setPage((current) => Math.max(1, current - 1))
                                          }
                                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                          <ChevronLeft size={15} aria-hidden="true" />
                                          Previous
                                    </button>

                                    <span
                                          className="px-2 font-medium text-gray-700"
                                          aria-current="page"
                                          aria-live="polite"
                                    >
                                          Page {page} of {totalPages}
                                    </span>

                                    <button
                                          type="button"
                                          disabled={page >= totalPages || loading}
                                          onClick={() =>
                                                setPage((current) =>
                                                      Math.min(totalPages, current + 1)
                                                )
                                          }
                                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                          Next
                                          <ChevronRight size={15} aria-hidden="true" />
                                    </button>
                              </nav>
                        </div>
                  </section>

                  {/* Delete confirmation modal */}
                  {deleteModal.isOpen && (
                        <div
                              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
                              onMouseDown={(event) => {
                                    if (event.target === event.currentTarget) {
                                          handleDeleteClose();
                                    }
                              }}
                        >
                              <div
                                    role="alertdialog"
                                    aria-modal="true"
                                    aria-labelledby="delete-dialog-title"
                                    aria-describedby="delete-dialog-description"
                                    className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
                              >
                                    <div className="flex items-center gap-3 text-red-600">
                                          <div className="rounded-full bg-red-100 p-2.5">
                                                <AlertCircle size={22} aria-hidden="true" />
                                          </div>

                                          <div>
                                                <h2
                                                      id="delete-dialog-title"
                                                      className="text-base font-bold text-gray-900"
                                                >
                                                      Confirm Page Deletion
                                                </h2>

                                                <p className="text-xs text-gray-500">
                                                      This action cannot be undone.
                                                </p>
                                          </div>
                                    </div>

                                    <p
                                          id="delete-dialog-description"
                                          className="text-sm text-gray-600"
                                    >
                                          Are you sure you want to permanently delete{" "}
                                          <strong className="text-gray-900">
                                                {deleteModal.page?.title}
                                          </strong>{" "}
                                          (
                                          <code className="text-xs text-pink-600">
                                                /{deleteModal.page?.slug}
                                          </code>
                                          )?
                                    </p>

                                    <div className="flex items-center justify-end gap-3 pt-2">
                                          <button
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={handleDeleteClose}
                                                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                          >
                                                Cancel
                                          </button>

                                          <button
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={handleDeleteConfirm}
                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                          >
                                                {isDeleting ? (
                                                      <>
                                                            <Loader2
                                                                  size={14}
                                                                  className="animate-spin"
                                                                  aria-hidden="true"
                                                            />
                                                            <span>Deleting...</span>
                                                      </>
                                                ) : (
                                                      <>
                                                            <Trash2 size={14} aria-hidden="true" />
                                                            <span>Delete Page</span>
                                                      </>
                                                )}
                                          </button>
                                    </div>
                              </div>
                        </div>
                  )}
            </div>
      );
}
