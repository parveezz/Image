
"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/layout/Navbar";
import UtilityBar from "@/layout/UtilityBar";

export default function PublicNavigation() {
  const pathname = usePathname();

  const isAdmin =
    pathname === "/admin" ||
    pathname?.startsWith("/admin/");

  if (isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <UtilityBar />
    </>
  );
}
