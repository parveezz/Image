"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/layout/Navbar";
import UtilityBar from "@/layout/UtilityBar";

export default function PublicNavigation() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <Navbar />
      <UtilityBar />
    </>
  );
}
