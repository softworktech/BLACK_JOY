"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api'

// RequestDrawer এর জন্য prop type define করো
export interface RequestDrawerProps {
  open: boolean;  // Drawer খোলা/বন্ধের জন্য
  onOpenChange: (open: boolean) => void;  // Drawer close/open handle করার function
  prefilledProduct?: {  // Optional prop, future এ থাকতে বা না থাকতে পারে
    name: string;
    image: string;
    description: string;
  };
}
export function RequestDrawer({ open, onOpenChange, prefilledProduct }: RequestDrawerProps) {
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState({ name: "", phone: "", address: "", images: "" })
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files))
    setErrors(prev => ({ ...prev, images: "" }))
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { name: "", phone: "", address: "", images: "" }

    if (!formData.name.trim()) { newErrors.name = "Name is required"; valid = false }
    if (!formData.phone.trim()) { newErrors.phone = "Phone number is required"; valid = false }
    if (!formData.address.trim()) { newErrors.address = "Address is required"; valid = false }
    if (selectedFiles.length === 0) { newErrors.images = "Please upload at least one image"; valid = false }

    setErrors(newErrors)
    return valid
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  setStatusMsg(null);

  try {
    // Convert selected images to Base64
    const imagesBase64 = await Promise.all(
      selectedFiles.map(file =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      )
    );

    const payload = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      OrderID: "WEB" + Date.now(),
      account_id: "WEB",
      images: imagesBase64
    };

    const res = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload),
    });

    let data: any;
    const text = await res.text();

    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error("Invalid JSON response:", text);
      setStatusMsg({ type: "error", message: "Server returned invalid response. See console." });
      return;
    }

    if (res.ok) {
      setStatusMsg({ type: "success", message: `Request submitted! OrderID: ${data.request_id}` });
      setFormData({ name: "", phone: "", address: "" });
      setSelectedFiles([]);
      setErrors({ name: "", phone: "", address: "", images: "" });
    } else {
      let errorMessage = data.message || "Unknown error";
      if (res.status === 422 && data.errors) {
        // If it's a validation error, extract the first error message
        const firstErrorKey = Object.keys(data.errors)[0];
        errorMessage = data.errors[firstErrorKey][0];
      }
      setStatusMsg({ type: "error", message: `Failed: ${errorMessage}` });
    }
  } catch (err: any) {
    console.error("Submit error:", err);
    setStatusMsg({ type: "error", message: `Server error. ${err.message || ""}` });
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setFormData({ name: "", phone: "", address: "" })
    setSelectedFiles([])
    setErrors({ name: "", phone: "", address: "", images: "" })
    setStatusMsg(null)
    onOpenChange(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 w-full max-w-md h-full bg-white z-50 shadow-lg p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Product Request</h2>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                ✕
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {statusMsg && (
                <div
                  className={`p-2 rounded text-center font-medium ${
                    statusMsg.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {statusMsg.message}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Upload Images *</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className={errors.images ? "border-red-500" : ""}
                />
                {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="border p-1 rounded text-sm bg-gray-50">
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  আপনি ছবি দিতে পারেন অথবা ক্যামেরা থেকে তুলতে পারেন।
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
