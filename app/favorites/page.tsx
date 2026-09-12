"use client"

import React, { useState, useEffect } from "react"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, ShoppingCart, X } from "lucide-react"

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export default function FavoritesDrawerPage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false) // <-- Drawer state

  // 🔹 Load Favorites
  const loadFavoriteData = () => {
    const storedFavorites: number[] = JSON.parse(localStorage.getItem("favorites") || "[]")
    setFavorites(storedFavorites)

    const storedProductsData = localStorage.getItem("allProductsData")
    if (storedProductsData) {
      const loadedProducts = JSON.parse(storedProductsData) as Product[]
      setAllProducts(loadedProducts)
      const favProducts = loadedProducts.filter((p) => storedFavorites.includes(p.id))
      setFavoriteProducts(favProducts)
    }
  }

  useEffect(() => {
    loadFavoriteData()
    window.addEventListener("favoritesUpdated", loadFavoriteData)
    return () => {
      window.removeEventListener("favoritesUpdated", loadFavoriteData)
    }
  }, [])

  return (
    <>
      <TopBar />
      <Header />

      {/* 🔹 Button to open drawer */}
      <div className="fixed top-20 right-6 z-50">
        <Button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2">
          <Heart className="h-5 w-5" /> Favorites ({favorites.length})
        </Button>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-40 transform transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">My Favorites ({favorites.length})</h2>
          <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Drawer content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)] space-y-4">
          {favoriteProducts.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Favorites is empty!</p>
          ) : (
            favoriteProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden border">
                <div className="relative">
                  <img src={product.image} alt={product.title} className="w-full h-32 object-contain" />
                  <button
                    onClick={() => {
                      const updated = favorites.filter((id) => id !== product.id)
                      localStorage.setItem("favorites", JSON.stringify(updated))
                      setFavorites(updated)
                      setFavoriteProducts(allProducts.filter((p) => updated.includes(p.id)))
                      window.dispatchEvent(new Event("favoritesUpdated"))
                    }}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                </div>
                <CardContent className="p-2">
                  <h3 className="text-sm font-medium line-clamp-2">{product.title}</h3>
                  <p className="font-bold text-base">৳ {product.price.toLocaleString()}</p>
                </CardContent>
                <CardFooter className="p-2">
                  <Button size="sm" onClick={() => {
                    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
                    const index = cart.findIndex((item:any) => item.id === product.id)
                    if(index>-1) cart[index].quantity +=1
                    else cart.push({...product, quantity:1})
                    localStorage.setItem("cart", JSON.stringify(cart))
                    window.dispatchEvent(new Event("cartUpdated"))
                  }}>
                    <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
