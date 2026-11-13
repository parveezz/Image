import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 mb-6">
        <FileQuestion size={32} />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-poppins sm:text-4xl">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-sm text-gray-500">
        The page you are looking for doesn&apos;t exist or is currently unpublished.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-pink-600 cursor-pointer"
        >
          <ArrowLeft size={15} />
          Return Home
        </Link>
        <Link
          href="/help"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 cursor-pointer"
        >
          Help Center
        </Link>
      </div>
    </div>
  );
}
