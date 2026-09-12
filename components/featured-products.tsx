"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api';

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/products?featured=1`);

        if (!res.ok) throw new Error("Failed to fetch featured products");

        const data = await res.json();
        const productsList = data.data || data || [];
        setFeaturedProducts(productsList);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const shimmerCards = Array.from({ length: 6 }).map((_, idx) => (
    <div
      key={idx}
      className="bg-gray-200 animate-pulse rounded-2xl h-full aspect-square"
    />
  ));

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-balance">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Handpicked favorites just for you
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {loading
            ? shimmerCards
            : featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="group overflow-hidden h-full rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={
                            product.image_url || (product.image ? `https://softworktech.com/SIYAM/storage/app/public/${product.image}` : "/placeholder.svg")
                          }
                          alt={product.name}
                          className="w-full h-full object-contain transition-none"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start p-3 gap-1">
                      <p className="text-xs text-muted-foreground capitalize">
                        {typeof product.category === 'object' ? product.category?.name : product.category}
                      </p>
                      <h3 className="font-semibold text-sm line-clamp-2 text-balance">
                        {product.name}
                      </h3>
                      <p className="text-accent font-bold text-base mt-1">
                        ৳{product.price}
                      </p>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
