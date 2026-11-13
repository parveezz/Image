"use client";

import { useState, useEffect } from "react";
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

      // Deletion confirmation modal state
      const [deleteModal, setDeleteModal] = useState({ isOpen: false, page: null });
      const [isDeleting, setIsDeleting] = useState(false);

      // Toast feedback
      const [toast, setToast] = useState(null);

      const showToast = (message, type = "success") => {
            setToast({ message, type });
            setTimeout(() => {
                  setToast(null);
            }, 3500);
      };

      // Debounce search input by 300ms
      useEffect(() => {
            const timer = setTimeout(() => {
                  setDebouncedSearch(searchQuery);
                  setPage(1);
            }, 300);

            return () => clearTimeout(timer);
      }, [searchQuery]);

      useEffect(() => {
            let ignore = false;

            async function loadPages() {
                  try {
                        const data = await pagesService.getPages({
                              page,
                              limit,
                              search: debouncedSearch,
                              status: statusFilter,
                        });

                        if (!ignore) {
                              setPages(data.pages);
                              setTotal(data.total);
                              setTotalPages(data.totalPages);
                              setError(null);

                              if (typeof onStatsUpdate === "function") {
                                    const publishedCount = data.pages.filter((p) => p.status === "Published").length;
                                    const draftCount = data.pages.filter((p) => p.status === "Draft").length;
                                    onStatsUpdate({
                                          total: data.total,
                                          published: publishedCount,
                                          draft: draftCount,
                                    });
                              }
                        }
                  } catch (err) {
                        if (!ignore) {
                              setError(err.message || "Failed to load footer pages from database.");
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
      }, [page, limit, debouncedSearch, statusFilter, onStatsUpdate, reloadKey]);

      const handleRefresh = () => {
            setLoading(true);
            setReloadKey((k) => k + 1);
      };

      // Delete handler
      const handleDeleteConfirm = async () => {
            if (!deleteModal.page) return;

            setIsDeleting(true);
            try {
                  await pagesService.deletePage(deleteModal.page.id);
                  showToast(`Page "${deleteModal.page.title}" deleted successfully.`);
                  setDeleteModal({ isOpen: false, page: null });
                  handleRefresh();
            } catch (err) {
                  showToast(err.message || "Failed to delete page.", "error");
            } finally {
                  setIsDeleting(false);
            }
      };

      return (
            <div className="space-y-4">
                  {/* Toast Alert */}
                  {toast && (
                        <div
                              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium shadow-sm transition ${
                                    toast.type === "error"
                                          ? "border border-red-200 bg-red-50 text-red-700"
                                          : "border border-green-200 bg-green-50 text-green-700"
                              }`}
                        >
                              <span>{toast.message}</span>
                              <button
                                    type="button"
                                    onClick={() => setToast(null)}
                                    className="text-current opacity-70 hover:opacity-100"
                              >
                                    <X size={16} />
                              </button>
                        </div>
                  )}

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
                        <div className="relative flex-1">
                              <Search
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                              <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                          setSearchQuery(e.target.value);
                                          setLoading(true);
                                    }}
                                    placeholder="Search by title or slug..."
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:bg-white"
                              />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                              {/* Status Filter */}
                              <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 p-1 text-xs font-medium">
                                    <button
                                          type="button"
                                          onClick={() => {
                                                if (statusFilter !== "all") {
                                                      setLoading(true);
                                                      setStatusFilter("all");
                                                      setPage(1);
                                                }
                                          }}
                                          className={`rounded-md px-3 py-1.5 transition cursor-pointer ${
                                                statusFilter === "all"
                                                      ? "bg-white text-gray-900 shadow-xs font-semibold"
                                                      : "text-gray-600 hover:text-black"
                                          }`}
                                    >
                                          All Status
                                    </button>
                                    <button
                                          type="button"
                                          onClick={() => {
                                                if (statusFilter !== "Published") {
                                                      setLoading(true);
                                                      setStatusFilter("Published");
                                                      setPage(1);
                                                }
                                          }}
                                          className={`rounded-md px-3 py-1.5 transition cursor-pointer ${
                                                statusFilter === "Published"
                                                      ? "bg-white text-green-700 shadow-xs font-semibold"
                                                      : "text-gray-600 hover:text-black"
                                          }`}
                                    >
                                          Published
                                    </button>
                                    <button
                                          type="button"
                                          onClick={() => {
                                                if (statusFilter !== "Draft") {
                                                      setLoading(true);
                                                      setStatusFilter("Draft");
                                                      setPage(1);
                                                }
                                          }}
                                          className={`rounded-md px-3 py-1.5 transition cursor-pointer ${
                                                statusFilter === "Draft"
                                                      ? "bg-white text-yellow-700 shadow-xs font-semibold"
                                                      : "text-gray-600 hover:text-black"
                                          }`}
                                    >
                                          Draft
                                    </button>
                              </div>

                              <button
                                    type="button"
                                    onClick={handleRefresh}
                                    title="Refresh page list"
                                    className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50 hover:text-black transition cursor-pointer"
                              >
                                    <RefreshCw size={17} className={loading ? "animate-spin text-pink-500" : ""} />
                              </button>
                        </div>
                  </div>

                  {/* Error State Banner */}
                  {error && (
                        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                              <div className="flex items-center gap-3">
                                    <AlertCircle size={18} className="shrink-0 text-red-500" />
                                    <span>{error}</span>
                              </div>
                              <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="rounded-md bg-red-100 px-3 py-1 font-semibold text-red-800 hover:bg-red-200 transition text-xs"
                              >
                                    Retry
                              </button>
                        </div>
                  )}

                  {/* Table Container */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                              <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-100 bg-gray-50/75 text-xs font-semibold uppercase text-gray-500">
                                          <tr>
                                                <th className="px-6 py-4">Page Title & Slug</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Last Updated</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                          </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                          {loading ? (
                                                Array.from({ length: 5 }).map((_, i) => (
                                                      <tr key={`skeleton-${i}`} className="animate-pulse">
                                                            <td className="px-6 py-4">
                                                                  <div className="flex items-start gap-3">
                                                                        <div className="h-9 w-9 rounded-lg bg-gray-200" />
                                                                        <div className="space-y-2 flex-1">
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
                                                            <td className="px-6 py-4 text-right">
                                                                  <div className="flex justify-end gap-2">
                                                                        <div className="h-7 w-14 rounded bg-gray-200" />
                                                                        <div className="h-7 w-14 rounded bg-gray-200" />
                                                                  </div>
                                                            </td>
                                                      </tr>
                                                ))
                                          ) : pages.length > 0 ? (
                                                pages.map((pageItem) => (
                                                      <tr
                                                            key={pageItem.id || pageItem.slug}
                                                            className="transition hover:bg-gray-50/50"
                                                      >
                                                            <td className="px-6 py-4">
                                                                  <div className="flex items-start gap-3">
                                                                        <div className="rounded-lg bg-pink-50 p-2 text-pink-600 mt-0.5 shrink-0">
                                                                              <FileText size={18} />
                                                                        </div>
                                                                        <div>
                                                                              <p className="font-semibold text-gray-900">
                                                                                    {pageItem.title}
                                                                              </p>
                                                                              <p className="text-xs text-gray-400">
                                                                                    /{pageItem.slug}
                                                                              </p>
                                                                              {pageItem.summary && (
                                                                                    <p className="mt-1 text-xs text-gray-500 line-clamp-1 max-w-sm">
                                                                                          {pageItem.summary}
                                                                                    </p>
                                                                              )}
                                                                        </div>
                                                                  </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                  <span
                                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                                              pageItem.status === "Published"
                                                                                    ? "bg-green-50 text-green-700"
                                                                                    : "bg-yellow-50 text-yellow-700"
                                                                        }`}
                                                                  >
                                                                        {pageItem.status === "Published" ? (
                                                                              <CheckCircle2 size={13} />
                                                                        ) : (
                                                                              <Clock size={13} />
                                                                        )}
                                                                        {pageItem.status}
                                                                  </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                                  {pageItem.lastUpdated}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                  <div className="flex items-center justify-end gap-2">
                                                                        <Link
                                                                              href={`/${pageItem.slug}`}
                                                                              target="_blank"
                                                                              title="View Live Page"
                                                                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-black"
                                                                        >
                                                                              <ExternalLink size={14} />
                                                                              View
                                                                        </Link>
                                                                        <Link
                                                                              href={`/admin/footer-pages/${pageItem.id || pageItem.slug}`}
                                                                              title="Edit Page"
                                                                              className="inline-flex items-center gap-1 rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-pink-600"
                                                                        >
                                                                              <Edit size={14} />
                                                                              Edit
                                                                        </Link>
                                                                        <button
                                                                              type="button"
                                                                              onClick={() =>
                                                                                    setDeleteModal({
                                                                                          isOpen: true,
                                                                                          page: pageItem,
                                                                                    })
                                                                              }
                                                                              title="Delete Page"
                                                                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
                                                                        >
                                                                              <Trash2 size={14} />
                                                                        </button>
                                                                  </div>
                                                            </td>
                                                      </tr>
                                                ))
                                          ) : (
                                                <tr>
                                                      <td colSpan={4} className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center justify-center">
                                                                  <FileText size={36} className="text-gray-300 mb-2" />
                                                                  <p className="text-sm font-semibold text-gray-700">
                                                                        No pages found
                                                                  </p>
                                                                  <p className="text-xs text-gray-400 mt-1 max-w-sm">
                                                                        {searchQuery || statusFilter !== "all"
                                                                              ? "Try adjusting your search query or filter options."
                                                                              : "No footer pages have been created in the database yet."}
                                                                  </p>
                                                                  {(searchQuery || statusFilter !== "all") && (
                                                                        <button
                                                                              type="button"
                                                                              onClick={() => {
                                                                                    setLoading(true);
                                                                                    setSearchQuery("");
                                                                                    setStatusFilter("all");
                                                                                    setPage(1);
                                                                              }}
                                                                              className="mt-3 text-xs font-semibold text-pink-600 hover:text-pink-700 cursor-pointer"
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

                        {/* Pagination Bar */}
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-row text-xs text-gray-500">
                              <p>
                                    Showing{" "}
                                    <span className="font-semibold text-gray-800">
                                          {total > 0 ? (page - 1) * limit + 1 : 0}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold text-gray-800">
                                          {Math.min(page * limit, total)}
                                    </span>{" "}
                                    of <span className="font-semibold text-gray-800">{total}</span> records
                              </p>

                              <div className="flex items-center gap-2">
                                    <button
                                          type="button"
                                          disabled={page <= 1 || loading}
                                          onClick={() => {
                                                setLoading(true);
                                                setPage((p) => Math.max(1, p - 1));
                                          }}
                                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                          <ChevronLeft size={15} />
                                          Previous
                                    </button>

                                    <span className="px-2 font-medium text-gray-700">
                                          Page {page} of {Math.max(1, totalPages)}
                                    </span>

                                    <button
                                          type="button"
                                          disabled={page >= totalPages || loading}
                                          onClick={() => {
                                                setLoading(true);
                                                setPage((p) => Math.min(totalPages, p + 1));
                                          }}
                                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                          Next
                                          <ChevronRight size={15} />
                                    </button>
                              </div>
                        </div>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {deleteModal.isOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-fade-in space-y-4">
                                    <div className="flex items-center gap-3 text-red-600">
                                          <div className="rounded-full bg-red-100 p-2.5">
                                                <AlertCircle size={22} />
                                          </div>
                                          <div>
                                                <h3 className="text-base font-bold text-gray-900">
                                                      Confirm Page Deletion
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                      This action cannot be undone
                                                </p>
                                          </div>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                          Are you sure you want to permanently delete{" "}
                                          <strong className="text-gray-900">
                                                {deleteModal.page?.title}
                                          </strong>{" "}
                                          (<code className="text-xs text-pink-600">/{deleteModal.page?.slug}</code>)?
                                    </p>

                                    <div className="flex items-center justify-end gap-3 pt-2">
                                          <button
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={() => setDeleteModal({ isOpen: false, page: null })}
                                                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                                          >
                                                Cancel
                                          </button>
                                          <button
                                                type="button"
                                                disabled={isDeleting}
                                                onClick={handleDeleteConfirm}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-red-700 transition disabled:opacity-60 cursor-pointer"
                                          >
                                                {isDeleting ? (
                                                      <>
                                                            <Loader2 size={14} className="animate-spin" />
                                                            <span>Deleting...</span>
                                                      </>
                                                ) : (
                                                      <>
                                                            <Trash2 size={14} />
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
