"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X, Minus, Plus, ShoppingBag, Edit, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api'

// ================= Cart & Checkout Types =================
interface CartItem {
  id: number
  name: string
  brand?: string
  price: number | string
  image?: string
  image_url?: string
  quantity: number | string
  size?: string
  discount?: number
}

// ================= Checkout Drawer =================
interface CheckoutDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cartItems: CartItem[]
  clearCart: () => void
}

export function CheckoutDrawer({ open, onOpenChange, cartItems, clearCart }: CheckoutDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    shippingMethod: "rajshahi-city",
    orderNote: "",
  })

  const shippingCosts: Record<string, number> = {
    "rajshahi-city": 20,
    "outside-rajshahi": 130,
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0
    const qty = Number(item.quantity) || 0
    return sum + price * qty
  }, 0)

  const deliveryCharge = shippingCosts[formData.shippingMethod] || 0
  const total = subtotal + deliveryCharge

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      alert("কার্ট খালি")
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          order_note: "",
          shipping_method: "Standard",
          delivery_charge: deliveryCharge,
          items: cartItems.map((item) => ({
            product_id: Number(item.id),
            product_name: item.name,
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || Number(item.qty) || 1,
          })),
        }),
      })
      const result = await res.json()
      if (res.ok) {
        onOpenChange(false)
        clearCart()
        setShowConfirmation(true)
      } else {
        alert(result.message || "অর্ডার ব্যর্থ হয়েছে")
      }
    } catch (err) {
      console.error(err)
      alert("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-6">
          <SheetHeader className="flex justify-between items-center mb-4">
            <SheetTitle className="text-xl sm:text-2xl font-bold">অর্ডার সম্পন্ন করুন</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6">
            {/* Customer Info */}
            <div className="space-y-4">
              <Input
                placeholder="আপনার নাম *"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="ফোন নাম্বার *"
                required
                pattern="01[3-9][0-9]{8}"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Textarea
                placeholder="এড্রেস *"
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            {/* Shipping */}
            <div className="space-y-2">
              <p className="font-semibold">শিপিং মেথড</p>
              {Object.entries(shippingCosts).map(([key, cost]) => (
                <label
                  key={key}
                  className={`flex justify-between items-center border p-3 rounded cursor-pointer ${
                    formData.shippingMethod === key ? "bg-accent/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="shipping"
                      value={key}
                      checked={formData.shippingMethod === key}
                      onChange={() => setFormData({ ...formData, shippingMethod: key })}
                    />
                    <span>{key === "rajshahi-city" ? "রাজশাহী সিটির ভিতরে" : "রাজশাহী সিটির বাহিরে"}</span>
                  </div>
                  <b>Tk {cost}</b>
                </label>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border rounded-lg p-4 space-y-2 bg-muted/10">
              <h3 className="font-semibold text-lg">অর্ডার সামারি</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>Tk {(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2">
                <span>সাবটোটাল</span>
                <span>Tk {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ</span>
                <span>Tk {deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-accent">
                <span>সর্বমোট</span>
                <span>Tk {total.toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" className="w-full py-3 mt-2" disabled={loading}>
              {loading ? "Processing..." : "অর্ডার কনফার্ম করুন"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-4">অর্ডার সফল হয়েছে 🎉</h2>
            <p className="mb-4">আপনার অর্ডারটি সংরক্ষিত হয়েছে। শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।</p>
            <Button onClick={() => setShowConfirmation(false)} className="w-full">ঠিক আছে</Button>
          </div>
        </div>
      )}
    </>
  )
}

// ================= Cart Drawer =================
interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [note, setNote] = useState("")
  const [coupon, setCoupon] = useState("")
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    if (open) loadCart()
  }, [open])

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
  }

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    )
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id)
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const applyCoupon = () => {
    const total = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
    if (coupon.toUpperCase() === "SAVE10") {
      setDiscount(total * 0.1)
      alert("Coupon applied! 10% discount")
    } else {
      alert("Invalid coupon")
      setDiscount(0)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
  const finalTotal = subtotal - discount

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b bg-accent/5">
            <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold">
              <ShoppingBag className="h-5 w-5 text-accent" />
              Shopping Cart
            </SheetTitle>
          </SheetHeader>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6 space-y-4">
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <Button onClick={() => onOpenChange(false)}>Continue Shopping</Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border relative">
                      <img
                        src={item.image_url || (item.image && item.image.trim() !== "" ? (item.image.startsWith('http') ? item.image : `https://softworktech.com/SIYAM/storage/app/public/${item.image}`) : "/placeholder.svg")}
                        alt={item.name || "Product Image"}
                        className="w-full h-full object-contain p-2"
                      />
                      {item.discount && (
                        <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                          {item.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm sm:text-base line-clamp-2">{item.name}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 hover:bg-red-50 text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {item.brand && <p className="text-xs sm:text-sm text-muted-foreground">{item.brand}</p>}
                      {item.size && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Size: <span className="font-medium">{item.size}</span>
                        </p>
                      )}

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-background"
                            onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-background"
                            onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-semibold text-lg sm:text-xl text-accent">৳{(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Note & Coupon */}
                <div className="mt-4 space-y-2">
                  <Textarea placeholder="Add note..." value={note} onChange={(e) => setNote(e.target.value)} />
                  <div className="flex gap-2">
                    <Input placeholder="Coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                    <Button onClick={applyCoupon}>Apply</Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-white border-t px-6 py-4 sticky bottom-0 shadow-inner space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-৳{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-accent">
                  <span>Total</span>
                  <span>৳{finalTotal.toFixed(2)}</span>
                </div>

                <Button onClick={() => { setCheckoutOpen(true); onOpenChange(false) }} className="w-full py-3">
                  ক্যাশ অন ডেলিভারিতে অর্ডার করুন
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDrawer
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cartItems={cartItems}
        clearCart={() => {
          setCartItems([])
          localStorage.removeItem("cart")
          window.dispatchEvent(new Event("cartUpdated"))
        }}
      />
    </>
  )
}
