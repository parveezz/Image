import { Suspense } from "react";
import AdminShell from "@/components/admin/AdminShell";

export const instant = false;

export default function AdminLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex">
          <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block" />
          <div className="flex-1 min-h-screen flex flex-col lg:pl-64 w-full">
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      }
    >
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
