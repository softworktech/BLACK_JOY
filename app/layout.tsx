// app/layout.tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";

// ✅ Server-side metadata
export const metadata: Metadata = {
  title: "Vtech Store",
  description:
    "Vtech Store - Online shop for all agro & grocery products in Bangladesh. Buy Oil, Ghee, Dates, Honey, Masala, Nuts & Seeds, Tea/Coffee, Honeycomb, Organic Zone, Pickles and more. Fast delivery & secure payments.",
  keywords: [
    "Vtech Store", "Agro Products Bangladesh", "Grocery Products Online",
    "Oil online Bangladesh", "Ghee online Bangladesh", "Dates Bangladesh",
    "Honey online Bangladesh", "Masala online Bangladesh",
    "Nuts & Seeds online", "Tea online Bangladesh", "Coffee online Bangladesh"
  ],
  authors: [{ name: "Vtech Store", url: "https://vtechstore.com" }],
  generator: "MSTS",
  robots: "index, follow",
  metadataBase: new URL("https://vtechstore.com"),
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
  openGraph: {
    title: "Vtech Store",
    description:
      "Shop all agro & grocery products online in Bangladesh. Oil, Ghee, Dates, Honey, Masala, Nuts & Seeds, Tea/Coffee, Honeycomb, Organic Zone, Pickles and more.",
    url: "/", // relative, metadataBase সাথে যোগ হবে
    siteName: "Vtech Store",
    images: [
      {
        url: "https://softworktech.com/NEED_AGRO/Need.png", // আপনার logo
        width: 1200,
        height: 630,
        alt: "Vtech Store - Online Agro & Grocery Store",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vtech Store",
    description:
      "Shop all agro & grocery products online in Bangladesh. Oil, Ghee, Dates, Honey, Masala, Nuts & Seeds, Tea/Coffee, Honeycomb, Organic Zone, Pickles and more.",
    site: "@VtechStore",
    images: ["https://softworktech.com/NEED_AGRO/Need.png"], // logo
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
