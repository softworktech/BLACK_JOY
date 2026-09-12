"use client";

import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import HeroSection from "@/components/hero-section";
import { PromoSection } from "@/components/promo-section";
import { ProductsSection } from "@/components/products-section";
import { FeaturedProducts } from "@/components/featured-products";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context"; // ✅ add this import

export default function Home() {
  return (
    <CartProvider> {/* ✅ everything inside CartProvider */}
      <div className="min-h-screen  flex flex-col">
        <TopBar />
        <Header />
        <main className="flex-1">
          <HeroSection />
          <PromoSection />
          <ProductsSection />
          <FeaturedProducts />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
