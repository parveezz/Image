import { Suspense } from "react";
import "./globals.css";
import PublicNavigation from "@/components/layout/PublicNavigation";
import PublicFooter from "@/components/layout/PublicFooter";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Imagely - Discover Your Style",
  description: "Explore lifestyle, fashion and photography inspiration.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <AuthProvider>
          <Suspense fallback={null}>
            <PublicNavigation />
          </Suspense>
          <div className="flex-1 flex flex-col">{children}</div>
          <Suspense fallback={null}>
            <PublicFooter />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
