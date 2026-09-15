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
                  className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                    ${
                      isActive
                        ? "bg-orange-50 text-orange-600 shadow-sm border border-orange-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-orange-600 border border-transparent"
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
      <header className="bg-white/90 backdrop-blur-lg shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-slate-100 sticky top-0 z-50 transition-all duration-300">
        {/* ===== Top Bar ===== */}
        <div className="container mx-auto px-4 py-3 lg:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 bg-gradient-to-tr from-orange-50 to-blue-50 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight group-hover:from-orange-600 group-hover:to-orange-400 transition-all duration-300">Dose care</div>
              <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
                Your Trusted Tech Store
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSearchModalOpen(true)}
              className="hover:bg-slate-100 rounded-full text-slate-600 hover:text-orange-500 transition-colors"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setRequestDrawerOpen(true)}
              className="hover:bg-slate-100 rounded-full text-slate-600 hover:text-orange-500 transition-colors hidden sm:inline-flex"
            >
              <FileText className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFavoritesDrawerOpen(true)}
              className="relative hover:bg-slate-100 rounded-full text-slate-600 hover:text-orange-500 transition-colors"
            >
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute 1 top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md border-2 border-white translate-x-1/4 -translate-y-1/4">
                  {favoritesCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartDrawerOpen(true)}
              className="relative hover:bg-slate-100 rounded-full text-slate-600 hover:text-orange-500 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-md border-2 border-white translate-x-1/4 -translate-y-1/4">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-slate-100 rounded-full text-slate-600 hover:text-orange-500 transition-colors ml-1"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* ===== Desktop Category Scroll ===== */}
        {categories.length > 0 && (
          <div className="hidden lg:block border-t border-slate-100 relative bg-slate-50/50">
            {showLeft && (
              <button
                onClick={() =>
                  scrollContainerRef.current?.scrollBy({
                    left: -200,
                    behavior: "smooth",
                  })
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md border border-slate-100 rounded-full p-2 text-slate-500 hover:text-orange-500 transition-colors ml-2"
              >
                <ChevronLeft size={18} />
              </button>
            )}

              <div
                ref={scrollContainerRef}
                style={{
                  scrollbarWidth: "none",       // Firefox
                  msOverflowStyle: "none",      // IE, Edge
                }}
                className="
                  container mx-auto px-4 py-3
                  flex space-x-3
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
                    className={`px-5 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap border transition-all duration-300
                      ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white border-transparent shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-orange-500 hover:text-orange-600 shadow-sm"
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
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md border border-slate-100 rounded-full p-2 text-slate-500 hover:text-orange-500 transition-colors mr-2"
              >
                <ChevronRight size={18} />
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
