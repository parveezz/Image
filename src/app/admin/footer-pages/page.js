"use client";

import { useState } from "react";
import Link from "next/link";
import FooterPageTable from "@/components/admin/FooterPageTable";
import { CheckCircle2, Clock, Layers, Plus } from "lucide-react";

export default function AdminFooterPagesPage() {
      const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });

      return (
            <div className="space-y-8">
                  {/* Header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
                                    <Link href="/admin" className="hover:text-pink-600 transition">
                                          Admin
                                    </Link>
                                    <span>/</span>
                                    <span className="text-gray-900">Footer Pages</span>
                              </div>
                              <h1 className="text-2xl font-bold text-gray-900 font-poppins">
                                    Footer Pages
                              </h1>
                              <p className="mt-1 text-sm text-gray-500">
                                    Manage, edit, and publish your website&apos;s legal documents and support guides.
                              </p>
                        </div>

                        <Link
                              href="/admin/footer-pages/new"
                              className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-pink-600 self-start sm:self-auto cursor-pointer"
                        >
                              <Plus size={16} />
                              Create Page
                        </Link>
                  </div>

                  {/* Quick Stat Badges */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                              <div className="rounded-lg bg-pink-50 p-3 text-pink-600">
                                    <Layers size={20} />
                              </div>
                              <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                          Total Pages
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                              </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                                    <CheckCircle2 size={20} />
                              </div>
                              <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                          Published
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
                              </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                              <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
                                    <Clock size={20} />
                              </div>
                              <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                          Drafts
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                              </div>
                        </div>
                  </div>

                  {/* Main Management Table */}
                  <FooterPageTable onStatsUpdate={setStats} />
            </div>
      );
}
