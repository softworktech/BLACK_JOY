"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api'

type Product = {
  image_url?: string
  id: number
  name: string
  price: number
  oldPrice?: number
  image: string
  inStock: boolean
  stockCount?: number
  category: string
  subCategory: string
  description: string
  unit: string
}

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [addedToCart, setAddedToCart] = useState<number[]>([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/products`)
        const data = await res.json()
        let productsList = data.data || data || []
        
        if (Array.isArray(productsList)) {
          productsList = productsList.map((p: any) => ({
            ...p,
            inStock: p.in_stock !== undefined ? (Boolean(p.in_stock) && Number(p.stock_count) > 0) : true,
            oldPrice: p.old_price,
            image_url: p.image_url || (p.image ? `https://softworktech.com/SIYAM/storage/app/public/${p.image}` : null)
          }))
        } else {
          productsList = []
        }
        
        setProducts(productsList)
        localStorage.setItem("allProductsData", JSON.stringify(productsList))
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setProducts([])
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    setFavorites(storedFavorites)
  }, [])

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
        unit: product.unit
      })
    }

    localStorage.setItem("cart", JSON.stringify(existingCart))
    setAddedToCart((prev) => [...prev, product.id])
    setTimeout(() => setAddedToCart((prev) => prev.filter((id) => id !== product.id)), 2000)
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const toggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const updatedFavorites = storedFavorites.includes(productId)
      ? storedFavorites.filter((id: number) => id !== productId)
      : [...storedFavorites, productId]

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
    setFavorites(updatedFavorites)
    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // Responsive grid classes
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2 lg:grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">

          {products.map((product) => {
            const isFavorite = favorites.includes(product.id)
            const isAdded = addedToCart.includes(product.id)
            const isOnSale = product.oldPrice !== undefined && product.oldPrice > product.price
            const discount = isOnSale
              ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
              : 0

            return (
              <div key={product.id} className="group h-full flex flex-col">
                <div
                  className={`bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col
                    h-[330px] sm:h-[380px] md:h-[410px]`}
                >

                  {/* IMAGE */}
                  <Link
                    href={`/product/${product.id}`}
                    className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden 
                    h-[150px] sm:h-[180px] md:h-[220px]"
                  >
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 aspect-square flex items-center justify-center overflow-hidden cursor-pointer flex-1">
                      <img
                        src={product.image_url || product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Favorite */}
                    <button
                      onClick={(e) => toggleFavorite(product.id, e)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm 
                      shadow-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <Heart
                        size={18}
                        className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    </button>

                    {/* Discount */}
                    {isOnSale && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white 
                        px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                        -{discount}%
                      </div>
                    )}
                  </Link>

                  {/* CONTENT */}
                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-[13px] sm:text-sm mb-1 text-gray-800 line-clamp-1 min-h-[20px] 
                      group-hover:text-orange-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-[11px] sm:text-xs text-gray-600 line-clamp-2 min-h-[30px] mb-2">
                      {product.description}
                    </p>

                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-[15px] sm:text-lg font-bold text-orange-600">৳ {product.price}</span>
                      {isOnSale && (
                        <span className="text-xs text-gray-500 line-through">৳ {product.oldPrice}</span>
                      )}
                      <span className="text-[10px] sm:text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                        {product.unit}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={!product.inStock}
                      className={`w-full py-1.5 sm:py-2 rounded-lg font-semibold flex items-center justify-center gap-1 
                        text-xs sm:text-sm transition-all duration-300 mt-auto
                        ${
                          !product.inStock
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : isAdded
                            ? "bg-green-500 text-white"
                            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md"
                        }`}
                    >
                      <ShoppingCart size={14} />
                      {!product.inStock ? "Stock Out" : isAdded ? "যোগ হয়েছে!" : "কার্টে যোগ করুন"}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </section>
  )
}
