"use client"

import { useSearchParams } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Search } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

import { useState, useEffect } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api'
function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function searchProducts() {
      if (!query) {
        setProducts([])
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/products?search=${encodeURIComponent(query)}`)
        const dataRaw = await res.json()
        const data = dataRaw.data || dataRaw || []
        setProducts(data)
      } catch (err) {
        console.error("Search error:", err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    searchProducts()
  }, [query])

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  return (
    <>
      <TopBar />
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground">
              {products.length} results found for "{query}"
            </p>
          </div>

          {loading ? (
             <div className="text-center py-16">
                Loading...
             </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">Try searching with different keywords</p>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border rounded-lg overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <Link href={`/product/${product.id}`} className="block relative">
                    <div className="aspect-square bg-white p-4 relative overflow-hidden">
                      <img
                        src={product.image_url || (product.image ? (product.image.startsWith('http') ? product.image : `https://softworktech.com/SIYAM/storage/app/public/${product.image}`) : "/placeholder.svg")}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                      <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-primary">{product.name}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-accent font-bold">৳{product.price}</span>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through">৳{product.oldPrice}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full h-8 text-xs"
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart(product)
                      }}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Quick Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
