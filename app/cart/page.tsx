"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Banknote, Edit, Tag } from "lucide-react"
import Link from "next/link"
import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckoutDrawer } from "@/components/checkout-modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery")
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [note, setNote] = useState("")
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    loadCart()
    window.addEventListener("cartUpdated", loadCart)
    return () => window.removeEventListener("cartUpdated", loadCart)
  }, [])

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]")
    setCart(cartData)
  }

  const updateQuantity = (id: number, change: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const finalTotal = total - discount

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") {
      setDiscount(total * 0.1)
      alert("Coupon applied! 10% discount")
    } else {
      alert("Invalid coupon code")
      setDiscount(0)
    }
  }

  const handleCheckout = () => {
    if (paymentMethod === "cash-on-delivery") {
      setCheckoutOpen(true)
    } else {
      alert("Redirecting to payment gateway...")
    }
  }

  if (cart.length === 0) {
    return (
      <>
        <TopBar />
        <Header />
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-6">
            <ShoppingBag className="h-14 w-14 text-gray-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-6 text-center text-sm sm:text-base">
            Add some products to get started!
          </p>
          <Button asChild size="default" className="px-5 sm:px-6">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <TopBar />
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 flex flex-col lg:flex-row gap-6">

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col sm:flex-row items-center gap-3 p-4 sm:p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 sm:gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-medium line-clamp-2">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.brand}</p>
                    {item.size && <p className="text-xs text-gray-400 mt-0.5">Size: <span className="font-medium">{item.size}</span></p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200 rounded-full transition" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200 rounded-full transition" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">৳{(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-500" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Note + Coupon */}
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <Button variant="outline" className="flex-1 text-sm flex items-center justify-center gap-1" onClick={() => setShowNoteInput(!showNoteInput)}>
                <Edit className="h-4 w-4" /> Add Note
              </Button>
              <Button variant="outline" className="flex-1 text-sm flex items-center justify-center gap-1" onClick={() => setShowCouponInput(!showCouponInput)}>
                <Tag className="h-4 w-4" /> Apply Coupon
              </Button>
            </div>

            {showNoteInput && (
              <Textarea placeholder="Add any special instructions..." value={note} onChange={(e) => setNote(e.target.value)} className="mt-2 min-h-[80px] rounded-xl border-gray-200"/>
            )}
            {showCouponInput && (
              <div className="flex gap-2 mt-2">
                <Input placeholder="Enter coupon code (SAVE10)" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="flex-1 text-sm rounded-xl"/>
                <Button size="sm" onClick={applyCoupon}>Apply</Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-5 sticky top-24 space-y-3">
              <h2 className="text-lg sm:text-xl font-semibold">Order Summary</h2>
              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>৳{total}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-৳{discount.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-1"><span>Total</span><span>৳{finalTotal.toFixed(2)}</span></div>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-3 flex flex-col gap-2">
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="pay-online" id="pay-online"/>
                  <Label htmlFor="pay-online" className="text-sm flex items-center gap-1"><CreditCard className="h-4 w-4"/>Pay Online</Label>
                </div>
                <div className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery"/>
                  <Label htmlFor="cash-on-delivery" className="text-sm flex items-center gap-1"><Banknote className="h-4 w-4"/>Cash on Delivery</Label>
                </div>
              </RadioGroup>

              <Button
                className="w-full text-sm py-2 mt-2 font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white transition"
                onClick={handleCheckout}
              >
                {paymentMethod === "pay-online" ? "Proceed to Payment" : "ক্যাশ অন ডেলিভারিতে অর্ডার করুন"}
              </Button>

              <Button variant="outline" className="w-full text-sm py-2 rounded-xl mt-1" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Checkout Modal with confirmation message */}


        <CheckoutDrawer
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          cartItems={cart}
          clearCart={() => {
            setCart([]) // React state খালি
            localStorage.removeItem("cart") // localStorage খালি
            window.dispatchEvent(new Event("cartUpdated")) // যদি অন্য component এ update লাগে
          }}
          confirmationMessage="আপনার অর্ডার আমাদের সিস্টেমে save হয়েছে। কিছুক্ষণের মধ্যে আমাদের একজন প্রতিনিধি আপনার অর্ডার নিশ্চিত করবেন।"
        />


    </>
  )
}
