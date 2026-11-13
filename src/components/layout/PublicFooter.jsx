
"use client";

import { usePathname } from "next/navigation";
import Footer from "@/layout/Footer";

export default function PublicFooter() {
  const pathname = usePathname();

  const isAdmin =
    pathname === "/admin" ||
    pathname?.startsWith("/admin/");

  if (isAdmin) {
    return null;
  }

  return <Footer />;
}
