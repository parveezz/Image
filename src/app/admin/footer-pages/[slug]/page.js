"use client";

import { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import pagesService from "@/services/pagesService";
import FooterPageEditor from "@/components/admin/FooterPageEditor";

function EditPageContent({ params }) {
      const resolvedParams = use(params);
      const slugOrId = resolvedParams?.slug;

      const [page, setPage] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
            let ignore = false;

            async function loadPage() {
                  if (!slugOrId) return;

                  try {
                        let result = null;

                        // 1. Try loading by ID
                        try {
                              result = await pagesService.getPageById(slugOrId);
                        } catch {
                              result = null;
                        }

                        // 2. If not found by ID, look up by slug search
                        if (!result) {
                              const listRes = await pagesService.getPages({
                                    search: slugOrId,
                                    limit: 10,
                              });

                              result = listRes.pages.find(
                                    (p) => String(p.slug).toLowerCase() === String(slugOrId).toLowerCase()
                              );

                              if (!result && listRes.pages.length === 1) {
                                    result = listRes.pages[0];
                              }
                        }

                        if (!ignore) {
                              if (result) {
                                    setPage(result);
                                    setError(null);
                              } else {
                                    setError(`Page "${slugOrId}" not found in database.`);
                              }
                        }
                  } catch (err) {
                        if (!ignore) {
                              setError(err.message || "Failed to load page from database.");
                        }
                  } finally {
                        if (!ignore) {
                              setLoading(false);
                        }
                  }
            }

            loadPage();

            return () => {
                  ignore = true;
            };
      }, [slugOrId]);

      if (loading) {
            return (
                  <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                        <Loader2 size={32} className="animate-spin text-pink-500" />
                        <p className="text-sm font-medium text-gray-500 font-poppins">
                              Loading page details...
                        </p>
                  </div>
            );
      }

      if (error || !page) {
            return (
                  <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm space-y-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                              <AlertCircle size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 font-poppins">
                              Page Not Found
                        </h2>
                        <p className="text-xs text-gray-500">
                              {error || "The requested footer page could not be located in the database."}
                        </p>
                        <div className="pt-2">
                              <Link
                                    href="/admin/footer-pages"
                                    className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-pink-600 cursor-pointer"
                              >
                                    <ArrowLeft size={15} />
                                    Back to Footer Pages
                              </Link>
                        </div>
                  </div>
            );
      }

      return (
            <div>
                  <FooterPageEditor initialPage={page} mode="edit" />
            </div>
      );
}

export default function AdminEditFooterPage(props) {
      return (
            <Suspense
                  fallback={
                        <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                              <Loader2 size={32} className="animate-spin text-pink-500" />
                              <p className="text-sm font-medium text-gray-500 font-poppins">
                                    Loading page details...
                              </p>
                        </div>
                  }
            >
                  <EditPageContent {...props} />
            </Suspense>
      );
}
