"use client"

import { useState, useEffect, useMemo } from "react"
import { X, Search } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api'

interface Product {
  id: number
  name: string
  price: number
  image: string
  onSale: boolean
  salePrice?: number | null
  originalPrice?: number
}

// SearchModal Props
interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { addToCart } = useCart()
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set())
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch products from API on modal open
  useEffect(() => {
    if (!isOpen) return

    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/products`)
        const dataRaw = await res.json()
        const data = dataRaw.data || dataRaw || []
        if (Array.isArray(data)) {
          const formatted: Product[] = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image_url || p.image || "/placeholder.svg",
            onSale: p.oldPrice && p.oldPrice > p.price ? true : false,
            salePrice: p.oldPrice && p.oldPrice > p.price ? p.price : null,
            originalPrice: p.oldPrice || undefined,
          }))
          setProducts(formatted)
        } else {
          console.error("API did not return an array:", data)
          setProducts([])
        }
      } catch (err) {
        console.error("Failed to fetch products:", err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [isOpen])

  // Filter products based on searchQuery
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return []
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, products])

  // Add to cart (context + localStorage)
  const handleAddToCart = (product: Product) => {
    // Add to context
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    // Add to LocalStorage cart
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1
    } else {
      existingCart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(existingCart))
    window.dispatchEvent(new Event("cartUpdated"))

    // Highlight added item
    setAddedItems((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[80vh] flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
        {/* Search Header */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <Search className="text-primary" size={24} />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg outline-none focus:ring-0 text-foreground placeholder-muted-foreground bg-transparent"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-foreground"
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : searchQuery.trim() === "" ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">পণ্য খুঁজতে টাইপ করুন</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">"{searchQuery}" এর জন্য কোনো পণ্য পাওয়া যায়নি</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-6">
                "{searchQuery}" এর জন্য {filteredProducts.length} টি পণ্য পাওয়া গেছে
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <img
                        src={
                          product.image && product.image.trim() !== "" && !product.image.includes("placeholder.svg")
                            ? (product.image.startsWith("http") ? product.image : `https://softworktech.com/SIYAM/storage/${product.image}`)
                            : "/placeholder.svg"
                        }
                        alt={product.name || "Product Image"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.onSale && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          ছাড়
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col gap-2">
                      <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm font-bold text-orange-600">
                          ৳ {product.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleAddToCart(product)
                          }}
                          className={`p-1.5 rounded transition ${
                            addedItems.has(product.id)
                              ? "bg-green-500 text-white"
                              : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                          }`}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
