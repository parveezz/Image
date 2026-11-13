
export default function LegalPageSkeleton() {
  return (
    <main className="min-h-screen bg-white py-10 sm:py-14">
      <div className="mx-auto w-[80%] max-w-6xl animate-pulse">

        {/* 1. Breadcrumb skeleton */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center justify-between pb-4 mb-8 border-b border-gray-100"
        >
          <ol className="flex items-center gap-2">
            <li>
              <div className="h-3.5 w-12 rounded bg-gray-100" />
            </li>
            <li aria-hidden="true" className="text-gray-200">/</li>
            <li>
              <div className="h-3.5 w-14 rounded bg-gray-100" />
            </li>
            <li aria-hidden="true" className="text-gray-200">/</li>
            <li>
              <div className="h-3.5 w-24 rounded bg-gray-100" />
            </li>
          </ol>

          <div className="flex items-center gap-2">
            <div className="h-7 w-16 rounded-lg bg-gray-100" />
            <div className="h-7 w-16 rounded-lg bg-gray-100" />
          </div>
        </nav>

        {/* 2. Hero Header skeleton */}
        <header className="mb-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-28 rounded-full bg-pink-50" />
            <div className="h-4 w-32 rounded bg-gray-100" />
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>

          <div className="h-10 w-2/5 rounded-xl bg-gray-200" />
          <div className="h-4 w-3/5 rounded bg-gray-100" />
        </header>

        {/* 3. Summary card skeleton */}
        <section
          aria-label="Summary loading"
          className="mb-10 rounded-2xl border border-gray-100 bg-gray-50/60 p-6 space-y-4"
        >
          <div className="h-4 w-44 rounded bg-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 rounded-xl bg-white border border-gray-100" />
            <div className="h-20 rounded-xl bg-white border border-gray-100" />
            <div className="h-20 rounded-xl bg-white border border-gray-100" />
          </div>
        </section>

        {/* 4. Quick Jump Pills skeleton */}
        <nav
          aria-label="On this page loading"
          className="mb-10 rounded-xl border border-gray-100 bg-white p-4"
        >
          <ul className="flex items-center gap-2">
            <li>
              <div className="h-8 w-28 rounded-lg bg-gray-100" />
            </li>
            <li>
              <div className="h-8 w-32 rounded-lg bg-gray-100" />
            </li>
            <li>
              <div className="h-8 w-24 rounded-lg bg-gray-100" />
            </li>
            <li>
              <div className="h-8 w-36 rounded-lg bg-gray-100" />
            </li>
          </ul>
        </nav>

        {/* 5. Legal Section Blocks skeleton */}
        <section
          aria-label="Legal content loading"
          className="space-y-6"
        >
          <article className="rounded-2xl border border-gray-100 bg-white p-8 space-y-3">
            <header className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-pink-50" />
              <div className="h-6 w-1/3 rounded bg-gray-200" />
            </header>

            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
            <div className="h-4 w-3/4 rounded bg-gray-100" />
          </article>

          <article className="rounded-2xl border border-gray-100 bg-white p-8 space-y-3">
            <header className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-pink-50" />
              <div className="h-6 w-1/4 rounded bg-gray-200" />
            </header>

            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-11/12 rounded bg-gray-100" />
            <div className="h-4 w-2/3 rounded bg-gray-100" />
          </article>
        </section>

      </div>
    </main>
  );
}
