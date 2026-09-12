"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  FileText,
  Heart,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { RequestDrawer } from "./request-modal";
import { CartDrawer } from "./cart-drawer";
import { SignInModal } from "./sign-in-modal";
import SearchModal from "./search-modal";
import { FavoritesDrawer } from "./favorites-drawer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api';

/* ================= TYPES ================= */
type Category = { name: string; id: number };

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
};

/* ================= MOBILE MENU ================= */
function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 w-72 h-full bg-white shadow-xl z-50"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <div className="text-lg font-bold text-primary">Menu</div>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="p-4 space-y-2 overflow-y-auto">
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.id}`;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  onClick={onClose}
                  className={`block px-3 py-2 rounded text-sm font-medium
                    ${
                      isActive
                        ? "bg-gray-100 text-orange-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                    }
                  `}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= HEADER ================= */
export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [requestDrawerOpen, setRequestDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /* ===== scroll arrow state ===== */
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        const dataRaw = await res.json();
        const data: Category[] = Array.isArray(dataRaw)
          ? dataRaw.map((c: any) => ({ id: Number(c.id), name: c.name }))
          : [];

        setCategories(data);
      } catch (err) {
        console.error("Category load error:", err);
      }
    }
    loadCategories();
  }, []);

  /* ================= CART & FAVORITES COUNT ================= */
  useEffect(() => {
    const update = () => {
      setCartCount(JSON.parse(localStorage.getItem("cart") || "[]").length);
      setFavoritesCount(
        JSON.parse(localStorage.getItem("favorites") || "[]").length
      );
    };
    update();
    window.addEventListener("cartUpdated", update);
    window.addEventListener("favoritesUpdated", update);
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("favoritesUpdated", update);
    };
  }, []);

  /* ================= SCROLL CHECK ================= */
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const isScrollable = el.scrollWidth > el.clientWidth;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(
      isScrollable && el.scrollLeft + el.clientWidth < el.scrollWidth - 5
    );
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  /* ================= JSX ================= */
  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* ===== Top Bar ===== */}
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image src="/logo.png" alt="Logo" fill className="rounded-full" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-primary">Vtech Store</div>
              <div className="text-xs text-muted-foreground">
                A to Z Agro & Grocery Products
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchModalOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setRequestDrawerOpen(true)}>
              <FileText className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFavoritesDrawerOpen(true)}
              className="relative"
            >
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="badge">{favoritesCount}</span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartDrawerOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* ===== Desktop Category Scroll ===== */}
        {categories.length > 0 && (
          <div className="hidden lg:block border-t relative bg-white">
            {showLeft && (
              <button
                onClick={() =>
                  scrollContainerRef.current?.scrollBy({
                    left: -200,
                    behavior: "smooth",
                  })
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow rounded-full p-2"
              >
                <ChevronLeft />
              </button>
            )}

              <div
                ref={scrollContainerRef}
                style={{
                  scrollbarWidth: "none",       // Firefox
                  msOverflowStyle: "none",      // IE, Edge
                }}
                className="
                  container mx-auto px-4 py-2
                  flex space-x-4
                  overflow-x-auto
                  scroll-smooth
                "
              >
              {categories.map((cat) => {
                const isActive = pathname === `/category/${cat.id}`;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                      ${
                        isActive
                          ? "text-orange-600"
                          : "text-gray-700 hover:text-orange-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>

            {showRight && (
              <button
                onClick={() =>
                  scrollContainerRef.current?.scrollBy({
                    left: 200,
                    behavior: "smooth",
                  })
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow rounded-full p-2"
              >
                <ChevronRight />
              </button>
            )}
          </div>
        )}
      </header>

      {/* ===== Drawers & Modals ===== */}
      <FavoritesDrawer open={favoritesDrawerOpen} onOpenChange={setFavoritesDrawerOpen} />
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <RequestDrawer open={requestDrawerOpen} onOpenChange={setRequestDrawerOpen} />
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} />
      <SignInModal open={signInModalOpen} onOpenChange={setSignInModalOpen} />
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
      />
    </>
  );
}
