
import { Suspense } from "react";

import "./globals.css";

import PublicNavigation from "@/components/layout/PublicNavigation";
import PublicFooter from "@/components/layout/PublicFooter";
import { AuthProvider } from "@/context/AuthContext";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Imagely - Discover Your Style",
    template: "%s | Imagely",
  },

  description:
    "Discover lifestyle, fashion and photography inspiration on Imagely. Explore creative visuals, styles and ideas.",

  applicationName: "Imagely",

  openGraph: {
    type: "website",
    siteName: "Imagely",
    title: "Imagely - Discover Your Style",
    description:
      "Discover lifestyle, fashion and photography inspiration on Imagely.",
    url: "/",
    images: [
      {
        url: "/og/imagely-default.jpg",
        width: 1200,
        height: 630,
        alt: "Imagely - Discover Your Style",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Imagely - Discover Your Style",
    description:
      "Discover lifestyle, fashion and photography inspiration on Imagely.",
    images: ["/og/imagely-default.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "Lifestyle",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-screen flex-col font-sans">
        <AuthProvider>
          <Suspense fallback={null}>
            <PublicNavigation />
          </Suspense>

          <div className="flex-1">
            {children}
          </div>

          <Suspense fallback={null}>
            <PublicFooter />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
