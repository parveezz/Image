"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/layout/Navbar";
import Footer from "@/layout/Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
