"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function FavoritesDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  // Load favorites and allProducts data
  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    const productsData = JSON.parse(localStorage.getItem("allProductsData") || "[]");
    setAllProducts(productsData);
    const favProducts = productsData.filter((p: any) => favIds.includes(p.id));
    setFavorites(favProducts);
  }, [open]);

  const handleRemove = (id: number) => {
    const storedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updatedFavs = storedFavs.filter((fid: number) => fid !== id);
    localStorage.setItem("favorites", JSON.stringify(updatedFavs));
    setFavorites(favorites.filter(f => f.id !== id));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Responsive width: mobile full screen, desktop 80/96 */}
      <SheetContent side="right" className="w-full sm:w-80 md:w-96">
        <SheetHeader className="flex justify-between items-center mb-4">
          <SheetTitle className="text-xl font-bold">Favorites</SheetTitle>
        </SheetHeader>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No favorites yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {favorites.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border rounded p-2">
                <img
                  src={item.image ? `https://softworktech.com/NEED_AGRO/${item.image}` : "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-contain"
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-accent font-bold">৳{item.price}</p>
                </div>
                <Button variant="outline" size="icon" onClick={() => handleRemove(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
