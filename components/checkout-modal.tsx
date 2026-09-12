"use client"

import { useState, useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, X } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api'

interface CartItem {
  id: number
  name: string
  price: number | string
  qty: number | string
}

interface CheckoutDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cartItems: CartItem[]
  clearCart: () => void
}

export function CheckoutDrawer({
  open,
  onOpenChange,
  cartItems,
  clearCart,
}: CheckoutDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    shippingMethod: "rajshahi-city",
    orderNote: "",
  })

  /* ✅ Shipping Cost */
  const shippingCosts: Record<string, number> = {
    "rajshahi-city": 20,
    "outside-rajshahi": 130,
  }

  /* ===============================
     ✅ NaN SAFE CALCULATIONS
     =============================== */

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price)
      const qty = Number((item.quantity || item.qty))

      if (isNaN(price) || isNaN(qty)) return sum

      return sum + price * qty
    }, 0)
  }, [cartItems])

  const deliveryCharge =
    Number(shippingCosts[formData.shippingMethod]) || 0

  const total = subtotal + deliveryCharge

  /* ===============================
     ✅ SUBMIT ORDER
     =============================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cartItems.length) {
      alert("কার্ট খালি")
      return
    }

    if (loading) return
    setLoading(true)

    try {
      const payload = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        order_note: formData.orderNote,
        shipping_method: (formData.shippingMethod || "Standard"),
        delivery_charge: deliveryCharge,
        items: cartItems.map(item => {
          const price = Number(item.price) || 0
          const quantity = Number((item.quantity || item.qty)) || 1

          return {
            product_id: Number(item.id),
            product_name: item.name,
            price: price,
            quantity: quantity,
          }
        }),
      }

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (res.ok) {
        onOpenChange(false)
        clearCart()
        setShowConfirmation(true)
      } else {
        alert(result?.message || "অর্ডার ব্যর্থ হয়েছে")
      }
    } catch (err) {
      console.error("ORDER ERROR:", err)
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
            <SheetTitle className="text-xl font-bold">
              অর্ডার সম্পন্ন করুন
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6">

            {/* Customer Info */}
            <div className="space-y-4">
              <div>
                <Label>আপনার নাম *</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label>ফোন নাম্বার *</Label>
                <Input
                  required
                  pattern="01[3-9][0-9]{8}"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label>এড্রেস *</Label>
                <Textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            {/* Shipping */}
            <div className="space-y-2">
              <Label>শিপিং মেথড</Label>
              <RadioGroup
                value={formData.shippingMethod}
                onValueChange={v =>
                  setFormData({ ...formData, shippingMethod: v })
                }
              >
                <div className="flex justify-between border p-3 rounded">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="rajshahi-city" />
                    <span>রাজশাহী সিটির ভিতরে</span>
                  </div>
                  <b>Tk 20</b>
                </div>

                <div className="flex justify-between border p-3 rounded">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="outside-rajshahi" />
                    <span>রাজশাহী সিটির বাহিরে</span>
                  </div>
                  <b>Tk 130</b>
                </div>
              </RadioGroup>
            </div>

            {/* Order Summary */}
            <div className="border rounded-lg p-4 space-y-2 bg-muted/10">
              <h3 className="font-semibold text-lg">অর্ডার সামারি</h3>

              {cartItems.map(item => {
                const price = Number(item.price) || 0
                const qty = Number((item.quantity || item.qty)) || 0
                const lineTotal = price * qty

                return (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} × {qty}</span>
                    <span>Tk {lineTotal.toFixed(2)}</span>
                  </div>
                )
              })}

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

            {/* Notes & Buttons */}
            <div className="space-y-3">
              <Textarea
                placeholder="Order note"
                rows={2}
                value={formData.orderNote}
                onChange={e =>
                  setFormData({ ...formData, orderNote: e.target.value })
                }
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "অর্ডার কনফার্ম করুন"}
              </Button>

              <Button type="button" variant="outline" className="w-full">
                <CreditCard className="mr-2 h-5 w-5" />
                Pay Online (Coming Soon)
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Confirmation */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              অর্ডার সফল হয়েছে 🎉
            </DialogTitle>
          </DialogHeader>
          <p>আপনার অর্ডারটি সংরক্ষিত হয়েছে। শীঘ্রই যোগাযোগ করা হবে।</p>
          <Button onClick={() => setShowConfirmation(false)} className="w-full">
            ঠিক আছে
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
