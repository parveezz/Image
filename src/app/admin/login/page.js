"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, AlertCircle, ArrowRight, Loader2, ShieldCheck, Image as ImageIcon } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email.trim() || !formData.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      router.push("/admin");
    } catch (err) {
      setErrorMessage(
        err.message || "Invalid administrative credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Brand & Admin Badge */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <ImageIcon size={28} className="text-pink-500" />
            <span className="text-2xl font-bold tracking-tight text-gray-900 font-poppins">
              Imagely<span className="text-pink-500">.</span>
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white mb-3">
            <ShieldCheck size={14} className="text-pink-400" />
            Admin Portal
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-poppins">
            Admin Sign In
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-inter">
            Sign in to access your administrative control panel
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 font-inter"
              >
                Admin Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@imagely.com"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-inter"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2 font-inter"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-inter"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-pink-500 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-pink-600 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed mt-2 font-poppins"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to website link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-medium text-gray-500 hover:text-gray-900 transition font-inter"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
