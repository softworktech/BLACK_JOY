"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ShoppingCart, Heart, Star, X, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api';

interface Product {
  id: number;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
  image?: string;
  description?: string;
  unit?: string;
}

interface FilterState {
  collections: string[];
  availability: string[];
  priceRange: [number, number];
}

// ================= Product Filters =================
const ProductFilters = ({
  currentCategory,
  filters,
  onFilterChange,
  mobileClose
}: {
  currentCategory: string,
  filters: FilterState,
  onFilterChange: (filters: FilterState) => void,
  mobileClose?: () => void
}) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch(`${API_BASE}/categories/${currentCategory}/subcategories`);
        const dataRaw = await res.json();
        const data = dataRaw.data || dataRaw || [];
        if (Array.isArray(data)) {
          setCategories(data.map((c: any) => c.name || c));
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Collections fetch error:", err);
        setCategories([]);
      }
    }
    fetchCollections();
  }, [currentCategory]);

  const handleCollectionToggle = (subCat: string) => {
    const updated = filters.collections.includes(subCat)
      ? filters.collections.filter(c => c !== subCat)
      : [...filters.collections, subCat];
    onFilterChange({ ...filters, collections: updated });
  };

  const handleAvailabilityToggle = (type: "in" | "out") => {
    const updated = filters.availability.includes(type)
      ? filters.availability.filter(t => t !== type)
      : [...filters.availability, type];
    onFilterChange({ ...filters, availability: updated });
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl space-y-6 w-72 md:w-full h-full relative border border-gray-200">
      {mobileClose && (
        <button
          onClick={mobileClose}
          className="md:hidden absolute top-3 right-3 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow hover:bg-white transition"
        >
          <X size={20} />
        </button>
      )}

      {/* Sub Categories */}
      <div>
        <h5 className="font-semibold mb-3 text-gray-700 text-center w-full">Filters</h5>
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-3 py-2 rounded-lg text-left font-medium text-sm transition-all duration-200 ${
                filters.collections.includes(cat)
                  ? "bg-orange-100 border border-orange-400 text-orange-600 shadow-sm"
                  : "border border-gray-200 hover:border-orange-300 hover:bg-orange-50"
              }`}
              onClick={() => handleCollectionToggle(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-700">Availability</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-gray-700">
            <input type="checkbox" checked={filters.availability.includes("in")} onChange={() => handleAvailabilityToggle("in")} className="accent-orange-500 w-4 h-4" /> In Stock
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input type="checkbox" checked={filters.availability.includes("out")} onChange={() => handleAvailabilityToggle("out")} className="accent-orange-500 w-4 h-4" /> Out of Stock
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl shadow-lg space-y-3 border border-gray-200">
        <h5 className="font-semibold mb-3 text-gray-800 text-lg text-center">Price Range</h5>
        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>৳ {filters.priceRange[0]}</span>
          <span>৳ {filters.priceRange[1]}</span>
        </div>
        <div className="relative h-6">
          <input
            type="range"
            min={0}
            max={5000}
            value={filters.priceRange[0]}
            onChange={(e) => {
              const minValue = Math.min(Number(e.target.value), filters.priceRange[1] - 1);
              onFilterChange({ ...filters, priceRange: [minValue, filters.priceRange[1]] });
            }}
            className="absolute w-full h-2 rounded-lg accent-orange-500 pointer-events-auto"
          />
          <input
            type="range"
            min={0}
            max={5000}
            value={filters.priceRange[1]}
            onChange={(e) => {
              const maxValue = Math.max(Number(e.target.value), filters.priceRange[0] + 1);
              onFilterChange({ ...filters, priceRange: [filters.priceRange[0], maxValue] });
            }}
            className="absolute w-full h-2 rounded-lg accent-orange-500 pointer-events-auto"
          />
        </div>
      </div>
    </div>
  );
};

// ================= Category Page =================
export default function CategoryPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam ?? "";
  const currentCategory = slug.toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    collections: [],
    availability: [],
    priceRange: [0, 5000],
  });

  const [addedToCart, setAddedToCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/products?category_id=${currentCategory}`);

        const dataRaw = await res.json();
        const data = dataRaw.data || dataRaw || [];
        if (Array.isArray(data)) {
          setProducts(data.map((p: any) => ({...p, inStock: p.in_stock !== undefined ? (Boolean(p.in_stock) && Number(p.stock_count) > 0) : p.inStock})));
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Products fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [currentCategory]);

  // Load favorites
  useEffect(() => {
    const storedFav = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFav);
  }, []);

  const filteredProducts = products
    .filter(p => filters.collections.length ? filters.collections.includes(p.subCategory || "") : true)
    .filter(p => filters.availability.length
      ? (filters.availability.includes("in") && p.inStock) || (filters.availability.includes("out") && !p.inStock)
      : true
    )
    .filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

  const showEmpty = !loading && filteredProducts.length === 0;

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = existingCart.findIndex((item: any) => item.id === product.id);
    if (idx > -1) existingCart[idx].quantity += 1;
    else existingCart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(existingCart));
    setAddedToCart(prev => [...prev, product.id]);
    setTimeout(() => setAddedToCart(prev => prev.filter(id => id !== product.id)), 2000);
    setTimeout(() => window.dispatchEvent(new Event("cartUpdated")), 0);
  };

  const toggleFavorite = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setFavorites(prev => {
      let updatedFav;
      if (prev.includes(product.id)) updatedFav = prev.filter(id => id !== product.id);
      else updatedFav = [...prev, product.id];
      localStorage.setItem("favorites", JSON.stringify(updatedFav));
      setTimeout(() => window.dispatchEvent(new Event("favoritesUpdated")), 0);
      return updatedFav;
    });
  };

  return (
    <>
      <TopBar />
      <Header />
      <div className="min-h-screen bg-background relative">
        {/* Mobile Filter Button */}
        <button
          className="lg:hidden fixed bottom-4 left-4 z-[60] p-3 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <SlidersHorizontal size={20} />
        </button>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white flex flex-col overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold text-gray-800">ফিল্টার</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-600 hover:text-red-500 text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <ProductFilters
                  currentCategory={currentCategory}
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    setFilters(newFilters);
                    setMobileFiltersOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Desktop Filter */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky" style={{ top: "140px" }}>
                <ProductFilters
                  currentCategory={currentCategory}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </div>

            {/* Products Section */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center min-h-[350px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
                </div>
              ) : showEmpty ? (
                <div className="flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-3xl shadow-md p-8 md:p-12 min-h-[350px]">
                  <div className="text-6xl mb-4">🛒</div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
                  </h2>
                  <p className="text-gray-800 text-lg md:text-xl font-semibold mb-4 leading-relaxed">
                    দুঃখিত! এই মুহূর্তে এই ক্যাটাগরির কোনো পণ্য উপলব্ধ নেই।  
                    তবে আপনি আমাদের <span className="text-orange-600">অ্যাপ</span> বা <span className="text-orange-600">ওয়েবসাইট</span> থেকে অর্ডার করতে পারবেন।  
                  </p>
                  <p className="text-gray-800 text-lg md:text-xl font-semibold leading-relaxed">
                    সরাসরি অর্ডার করতে আমাদের সাথে যোগাযোগ করুন: 
                    <a href="tel:01784217430" className="text-orange-600 hover:underline ml-1 font-bold">
                      01784217430
                    </a>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Link
                      href="/"
                      className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
                    >
                      হোম পেজে যান
                    </Link>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.msts.need"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl border border-orange-500 text-orange-600 font-semibold hover:bg-orange-50 transition inline-block"
                    >
                      অ্যাপ ডাউনলোড করুন
                    </a>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Product Cards */}
                  {filteredProducts.map(product => {
                    const isFavorite = favorites.includes(product.id);
                    const isAdded = addedToCart.includes(product.id);
                    const isOnSale = !!product.oldPrice && product.oldPrice > product.price;

                    return (
                      <div key={product.id} className="group flex flex-col h-full">
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full">
                          <Link
                            href={`/product/${product.id}`}
                            className="relative aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
                          >
                            <img
                              src={(product as any).image_url || (product.image?.trim() ? (product.image.startsWith('http') ? product.image : `https://softworktech.com/SIYAM/storage/app/public/${product.image}`) : "/placeholder.svg")}
                              alt={product.name || "Product Image"}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <button
                              onClick={(e) => toggleFavorite(product, e)}
                              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                              <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} />
                            </button>
                            {isOnSale && (
                              <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                -{Math.round((product.oldPrice! - product.price) / (product.oldPrice! / 100))}%
                              </div>
                            )}
                            {!product.inStock && (
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                Out of Stock
                              </div>
                            )}
                          </Link>

                          <div className="p-4 flex flex-col flex-1">
                            <Link href={`/product/${product.id}`}>
                              <h3 className="font-semibold text-sm mb-1 text-gray-800 line-clamp-1 hover:text-orange-600">{product.name}</h3>
                            </Link>
                            <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="text-lg font-bold text-orange-600">৳ {product.price}</span>
                              {isOnSale && <span className="text-sm text-gray-400 line-through">৳ {product.oldPrice}</span>}
                              {product.unit && <span className="text-xs px-2 py-1 bg-gray-200 rounded">{product.unit}</span>}
                            </div>
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              disabled={!product.inStock}
                              className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm transition mt-auto
                                ${!product.inStock ? "bg-gray-300 text-gray-600 cursor-not-allowed" : isAdded ? "bg-green-500 text-white" : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"}`}
                            >
                              <ShoppingCart size={16} />
                              {!product.inStock ? "Out of Stock" : isAdded ? "যোগ হয়েছে!" : "কার্টে যোগ করুন"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
