"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
      CheckCircle,
      Clock,
      ArrowUpRight,
      Edit,
      Layers,
      AlertCircle,
      RefreshCw,
} from "lucide-react";
import pagesService from "@/services/pagesService";

export default function AdminDashboard() {
      const [stats, setStats] = useState({
            total: 0,
            published: 0,
            draft: 0,
      });
      const [recentPages, setRecentPages] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [reloadKey, setReloadKey] = useState(0);

      useEffect(() => {
            let ignore = false;

            async function loadDashboardData() {
                  setLoading(true);
                  setError(null);

                  try {
                        const [allPagesRes, publishedRes, draftRes] = await Promise.all([
                              pagesService.getPages({ page: 1, limit: 4 }),
                              pagesService.getPages({ page: 1, limit: 1, status: "published" }),
                              pagesService.getPages({ page: 1, limit: 1, status: "draft" }),
                        ]);

                        if (!ignore) {
                              setStats({
                                    total: allPagesRes.total,
                                    published: publishedRes.total,
                                    draft: draftRes.total,
                              });
                              setRecentPages(allPagesRes.pages);
                        }
                  } catch (err) {
                        if (!ignore) {
                              setError(err.message || "Failed to load dashboard data from backend.");
                        }
                  } finally {
                        if (!ignore) {
                              setLoading(false);
                        }
                  }
            }

            loadDashboardData();

            return () => {
                  ignore = true;
            };
      }, [reloadKey]);

      const statCards = [
            {
                  title: "Total Footer Pages",
                  value: loading ? "—" : stats.total.toString(),
                  description: "Available system pages in database",
                  icon: Layers,
            },
            {
                  title: "Published Pages",
                  value: loading ? "—" : stats.published.toString(),
                  description: "Live on public website",
                  icon: CheckCircle,
            },
            {
                  title: "Draft Pages",
                  value: loading ? "—" : stats.draft.toString(),
                  description: "Drafts and pending review",
                  icon: Clock,
            },
      ];

      return (
            <div className="space-y-8">
                  {/* Welcome section */}
                  <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                              <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                                    Welcome back, Admin!
                              </h2>
                              <p className="mt-1 text-sm text-gray-500">
                                    Here&apos;s what&apos;s happening with your website today.
                              </p>
                        </div>
                        <button
                              type="button"
                              onClick={() => setReloadKey((k) => k + 1)}
                              title="Refresh dashboard"
                              className="self-start rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-50 hover:text-black transition cursor-pointer"
                        >
                              <RefreshCw size={17} className={loading ? "animate-spin text-pink-500" : ""} />
                        </button>
                  </section>

                  {/* Error state */}
                  {error && (
                        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                              <div className="flex items-center gap-3">
                                    <AlertCircle size={18} className="shrink-0 text-red-500" />
                                    <span>{error}</span>
                              </div>
                              <button
                                    type="button"
                                    onClick={() => setReloadKey((k) => k + 1)}
                                    className="rounded-md bg-red-100 px-3 py-1 font-semibold text-red-800 hover:bg-red-200 transition text-xs"
                              >
                                    Retry
                              </button>
                        </div>
                  )}

                  {/* Statistics */}
                  <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {statCards.map((stat) => {
                              const Icon = stat.icon;

                              return (
                                    <div
                                          key={stat.title}
                                          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                                    >
                                          <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-500">
                                                      {stat.title}
                                                </p>
                                                <div className="rounded-lg bg-pink-50 p-3 text-pink-600">
                                                      <Icon size={21} />
                                                </div>
                                          </div>

                                          <h3 className="mt-5 text-3xl font-bold text-gray-900 font-poppins">
                                                {stat.value}
                                          </h3>

                                          <p className="mt-1 text-sm text-gray-400">
                                                {stat.description}
                                          </p>
                                    </div>
                              );
                        })}
                  </section>

                  {/* Quick action */}
                  <section className="flex flex-col justify-between gap-5 rounded-xl bg-gray-900 p-7 text-white sm:flex-row sm:items-center shadow-sm">
                        <div>
                              <h3 className="text-xl font-semibold font-poppins">
                                    Manage your footer content
                              </h3>
                              <p className="mt-2 text-sm text-gray-300">
                                    Create, edit, and publish your website pages from one place.
                              </p>
                        </div>

                        <Link
                              href="/admin/footer-pages"
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
                        >
                              Manage Pages
                              <ArrowUpRight size={17} />
                        </Link>
                  </section>

                  {/* Recent pages */}
                  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                              <div>
                                    <h3 className="font-semibold text-gray-900">
                                          Footer Pages
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                          Recently configured pages in database
                                    </p>
                              </div>

                              <Link
                                    href="/admin/footer-pages"
                                    className="text-sm font-medium text-pink-600 hover:text-pink-700"
                              >
                                    View all
                              </Link>
                        </div>

                        <div className="divide-y divide-gray-100">
                              {loading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                          <div key={`rec-skel-${i}`} className="flex items-center justify-between px-6 py-4 animate-pulse">
                                                <div className="space-y-2">
                                                      <div className="h-4 w-32 rounded bg-gray-200" />
                                                      <div className="h-3 w-20 rounded bg-gray-100" />
                                                </div>
                                                <div className="h-6 w-16 rounded-full bg-gray-200" />
                                          </div>
                                    ))
                              ) : recentPages.length > 0 ? (
                                    recentPages.map((page) => (
                                          <div
                                                key={page.id || page.slug}
                                                className="flex items-center justify-between px-6 py-4 transition hover:bg-gray-50/50"
                                          >
                                                <div>
                                                      <div className="flex items-center gap-2">
                                                            <p className="font-medium text-gray-800">
                                                                  {page.title}
                                                            </p>
                                                      </div>
                                                      <p className="mt-1 text-xs text-gray-400">
                                                            /{page.slug}
                                                      </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                      <span
                                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                                  page.status === "Published"
                                                                        ? "bg-green-50 text-green-700"
                                                                        : "bg-yellow-50 text-yellow-700"
                                                            }`}
                                                      >
                                                            {page.status}
                                                      </span>

                                                      <Link
                                                            href={`/admin/footer-pages/${page.id || page.slug}`}
                                                            aria-label={`Edit ${page.title}`}
                                                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-pink-600 transition"
                                                      >
                                                            <Edit size={17} />
                                                      </Link>
                                                </div>
                                          </div>
                                    ))
                              ) : (
                                    <div className="px-6 py-8 text-center text-sm text-gray-500">
                                          No footer pages have been created yet.
                                    </div>
                              )}
                        </div>
                  </section>
            </div>
      );
}
