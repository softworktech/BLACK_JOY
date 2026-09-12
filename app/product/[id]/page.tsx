"use client";

import React, { useEffect, useState, use } from "react";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api';
import { Button } from "@/components/ui/button";
import { CustomLoader } from "@/components/CustomLoader";


import {
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  FileText,
  CreditCard,
  Banknote,
  MessageCircle,
  Heart
} from "lucide-react";
import Link from "next/link";
import { RequestDrawer } from "@/components/request-modal";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckoutDrawer } from "@/components/checkout-modal";

// AES-128-ECB encryption
function encryptKey(text: string) {
  const secretKey = "Robiul76248500$$"; // 16-char secret key
  const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  // Sync cartItems when "cartUpdated" event fires
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(updatedCart);
    };
    window.addEventListener("cartUpdated", handleStorageChange);
    return () => window.removeEventListener("cartUpdated", handleStorageChange);
  }, []);

  // Load favorites & addedToCart from localStorage
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addedToCart, setAddedToCart] = useState<number[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);

    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartIds = storedCart.map((item: any) => item.id);
    setAddedToCart(cartIds);
  }, []);

  // Fetch product & related products
  useEffect(() => {
    let isMounted = true;
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/products/${id}`);

        if (!res.ok) throw new Error("Product API response not OK");
        const data = await res.json();
        const productData = data.data || data;
        if (productData) {
          if (productData.in_stock !== undefined) {
            productData.inStock = Boolean(productData.in_stock) && Number(productData.stock_count) > 0;
          } else {
            productData.inStock = Number(productData.stock_count) > 0;
          }
        }

        if (isMounted) setProduct(productData);

        // Related products
        const relatedRes = await fetch(`${API_BASE}/products/${id}/related`);
        if (!relatedRes.ok) throw new Error("Related products API response not OK");
        const relatedData = await relatedRes.json();
        const rList = relatedData.data || relatedData || [];
        const rProducts = rList.map((r: any) => ({ ...r, inStock: r.in_stock !== undefined ? (Boolean(r.in_stock) && Number(r.stock_count) > 0) : r.inStock }));
        if (isMounted) setRelatedProducts(rProducts);

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    }
    fetchProduct();
    return () => { isMounted = false; };
  }, [id]);

  // Favorite toggle
  const toggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updatedFavorites = storedFavorites.includes(productId)
      ? storedFavorites.filter((id: number) => id !== productId)
      : [...storedFavorites, productId];

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  // Add to cart
  const handleAddToCart = (prod: any, e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!prod?.inStock ) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex((item: any) => item.id === prod.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        ...prod,
        quantity,
        unit: prod.unit,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
    setAddedToCart((prev) => [...prev, prod.id]);
    setTimeout(() => setAddedToCart((prev) => prev.filter((id) => id !== prod.id)), 2000);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCashOnDelivery = () => {
    if (!product?.inStock ) return;
    handleAddToCart(product);
    setCheckoutModalOpen(true);
  };

  const handleWhatsApp = () =>
    window.open(
      `https://wa.me/8801953575880?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (৳${product.price})`)}`,
      "_blank"
    );

  const handleShare = async () => {
    const shareData = {
      title: product?.name || "Product",
      text: `Check out ${product?.name || "this product"}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      } else {
        const manualCopy = window.prompt("Copy this link:", shareData.url);
        if (manualCopy) console.log("Link copied manually");
      }
    } catch (err) {
      console.error("Share failed:", err);
      alert("Could not share the link. Please copy manually.");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setImagePosition({ x, y });
    setImageScale(2);
  };

  const handleMouseLeave = () => {
    setImageScale(1);
    setImagePosition({ x: 50, y: 50 });
  };

  // --- UI ---
  return (
    <>
      <TopBar />
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[350px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
            </div>
          ) : !product ? (
            <div className="flex flex-col items-center justify-center min-h-[350px] text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
              <p className="text-gray-500 mb-6">Sorry, we couldn't find the product you're looking for.</p>
              <Link href="/">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Back to Home</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Product Section */}
              <div className="grid lg:grid-cols-2 gap-8 mt-6">
                {/* Product Image */}
                <div
                  className="relative w-full h-80 lg:h-[500px] overflow-hidden rounded-lg border bg-gray-100 cursor-zoom-in"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {product?.old_price && product?.price && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded text-sm font-semibold shadow-lg z-10">
                      {Math.round(((Number(product.old_price) - Number(product.price)) / Number(product.old_price)) * 100)}% OFF
                    </span>
                  )}
                  <img
                    src={product?.image_url || (product?.image ? (product.image.startsWith('http') ? product.image : `https://softworktech.com/SIYAM/storage/app/public/${product.image}`) : "/placeholder.svg")}
                    alt={product?.name || "Product"}
                    className="w-full h-full object-cover transition-transform duration-200 ease-out"
                    style={{ transform: `scale(${imageScale})`, transformOrigin: `${imagePosition.x}% ${imagePosition.y}%` }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-sm font-medium text-accent mb-2 capitalize">{typeof product?.category === 'object' ? product?.category?.name : (product?.category || "Category")}</p>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product?.name || "Product Name"}</h1>
                    <div className="flex items-baseline gap-3 mb-4">
                      <p className="text-4xl font-bold text-accent">৳{product?.price ?? "0"}</p>
                      {product?.oldPrice && <p className="text-lg text-gray-400 line-through">৳{product.oldPrice}</p>}
                      {product?.unit && <span className="text-xs px-2 py-1 bg-gray-200 rounded font-medium">{product.unit}</span>}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">{product?.description || "No description available."}</p>
                    {(!product?.inStock ) && <p className="text-red-600 font-semibold mt-2">Out of Stock</p>}
                  </div>

                  {/* Quantity & Actions */}
                  <div className="space-y-4 border-y py-6">
                    <label className="text-sm font-semibold mb-2 block">Quantity</label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!product?.inStock }>-</Button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} disabled={!product?.inStock }>+</Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white transition-colors" disabled={!product?.inStock }>
                        <CreditCard className="mr-2 h-5 w-5" /> Pay Online
                      </Button>
                      <Button size="lg" variant="outline" onClick={handleCashOnDelivery} disabled={!product?.inStock }>
                        <Banknote className="mr-2 h-5 w-5" /> Cash on Delivery
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button size="lg" className="w-full bg-[#25D366] hover:bg-[#20BA5A]" onClick={handleWhatsApp}>
                        <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Us
                      </Button>
                      <Button size="lg" onClick={(e) => handleAddToCart(product, e)} disabled={!product?.inStock }>
                        <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button size="lg" variant="outline" onClick={() => setRequestModalOpen(true)}>
                        <FileText className="mr-2 h-4 w-4" /> Request
                      </Button>
                      <Button size="lg" variant="outline" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                    </div>
                  </div>

                  {/* Info Icons */}
                  <div className="grid grid-cols-3 gap-4 py-6 border-y">
                    <div className="text-center">
                      <Truck className="h-6 w-6 mx-auto mb-2 text-accent" />
                      <p className="text-xs font-medium">Free Delivery</p>
                    </div>
                    <div className="text-center">
                      <RotateCcw className="h-6 w-6 mx-auto mb-2 text-accent" />
                      <p className="text-xs font-medium">7 Days Return</p>
                    </div>
                    <div className="text-center">
                      <Shield className="h-6 w-6 mx-auto mb-2 text-accent" />
                      <p className="text-xs font-medium">Secure Payment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <section className="py-12 md:py-16 bg-white">
                  <div className="container mx-auto px-2 sm:px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Related Products</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                      {relatedProducts.map((product) => {
                        const isFavorite = favorites.includes(product.id);
                        const isAdded = addedToCart.includes(product.id);
                        const isOnSale = product.old_price !== undefined && product.old_price > product.price;
                        const discount = isOnSale ? Math.round(((Number(product.old_price) - Number(product.price)) / Number(product.old_price)) * 100) : 0;
                        const inStock = product.inStock;

                        return (
                          <div key={product.id} className="group h-full flex flex-col">
                            <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-[330px] sm:h-[380px] md:h-[410px]`}>
                              <Link href={`/product/${product.id}`} className="relative flex items-center justify-center overflow-hidden h-[150px] sm:h-[180px] md:h-[220px] bg-gradient-to-br from-gray-50 to-gray-100">
                                <div className="relative aspect-square flex items-center justify-center overflow-hidden w-full h-full cursor-pointer">
                                  <img
                                    src={product.image_url || (product.image ? (product.image.startsWith('http') ? product.image : `https://softworktech.com/SIYAM/storage/app/public/${product.image}`) : "/placeholder.svg")}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 ease-out"
                                  />
                                </div>

                                {/* Favorite */}
                                <button onClick={(e) => toggleFavorite(product.id, e)} className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center transition-all duration-300">
                                  <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} />
                                </button>

                                {/* Discount */}
                                {isOnSale && (
                                  <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                                    -{discount}%
                                  </div>
                                )}
                              </Link>

                              {/* Content */}
                              <div className="p-3 sm:p-4 flex flex-col flex-1">
                                <Link href={`/product/${product.id}`}>
                                  <h3 className="font-semibold text-[13px] sm:text-sm mb-1 text-gray-800 line-clamp-1 min-h-[20px] group-hover:text-orange-600 transition-colors duration-300">
                                    {product.name}
                                  </h3>
                                </Link>
                                <p className="text-[11px] sm:text-xs text-gray-600 line-clamp-2 min-h-[30px] mb-2">{product.description || "No description available."}</p>
                                <div className="mb-3 flex items-center gap-2">
                                  <span className="text-[15px] sm:text-lg font-bold text-orange-600">৳ {product.price}</span>
                                  {isOnSale && <span className="text-xs text-gray-500 line-through">৳ {product.old_price}</span>}
                                  {product.unit && <span className="text-[10px] sm:text-xs bg-gray-200 px-1.5 py-0.5 rounded">{product.unit}</span>}
                                </div>
                                <button onClick={(e) => handleAddToCart(product, e)} disabled={!inStock} className={`w-full py-1.5 sm:py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-xs sm:text-sm transition-all duration-300 mt-auto ${!inStock ? "bg-gray-300 text-gray-600 cursor-not-allowed" : isAdded ? "bg-green-500 text-white" : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"}`}>
                                  <ShoppingCart size={14} /> {!inStock ? "Stock Out" : isAdded ? "যোগ হয়েছে!" : "কার্টে যোগ করুন"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

      {/* Request Drawer */}
      <RequestDrawer
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        prefilledProduct={{
          name: product?.name || "",
          image: product?.image || "",
          description: product?.description || "",
        }}
      />

      {/* Checkout Drawer */}
      <CheckoutDrawer
        open={checkoutModalOpen}
        onOpenChange={setCheckoutModalOpen}
        cartItems={cartItems}
        clearCart={() => {
          setCartItems([]);
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));
        }}
      />
    </>
  );
}
