
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-500"
        aria-hidden="true"
      >
        <FileQuestion size={32} />
      </div>

      <h1 className="font-poppins text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
        The page you are looking for doesn&apos;t exist or is currently
        unpublished. Please check the URL or return to the homepage.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Return Home
        </Link>

        <Link
          href="/help"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
        >
          Help Center
        </Link>
      </div>
    </main>
  );
}
