// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";

// ✅ Server-side metadata
export const metadata: Metadata = {
  title: "Easy Point",
  description:
    "Easy Point - Online shop for premium tech, gadgets, and electronics in Bangladesh. Fast delivery & secure payments.",
  keywords: [
    "Easy Point", "Tech gadgets", "Electronics Online Store",
    "Smartphones", "Laptops", "Smart home devices",
    "Best electronics in BD", "Original gadgets",
  ],
  authors: [{ name: "Easy Point", url: "https://dosecare.com" }],
  creator: "Easy Point",
  publisher: "Easy Point",
  metadataBase: new URL("https://dosecare.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dosecare.com",
    title: "Easy Point",
    description:
      "Easy Point - Online shop for premium tech, gadgets, and electronics in Bangladesh. Fast delivery & secure payments.",
    siteName: "Easy Point",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Easy Point - Online Tech & Electronics Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Easy Point",
    description:
      "Easy Point - Online shop for premium tech, gadgets, and electronics in Bangladesh. Fast delivery & secure payments.",
    site: "@DoseCare",
    creator: "@DoseCare",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CartProvider>{children}</CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
