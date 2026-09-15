"use client"

import React, { useState } from "react"
import { TopBar } from "@/components/top-bar"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://softworktech.com/SIYAM/api'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      };

      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Server reply:", result);

      if (result.status === "success") {
        alert("✅ ধন্যবাদ! আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করবো।");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        // show server message for debugging
        alert("❌ " + (result.message || "কিছু সমস্যা হয়েছে! আবার চেষ্টা করুন।"));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("⚠️ সার্ভার/নেটওয়ার্ক সমস্যা। কনসোল বা নেটওয়ার্ক ট্যাব দেখো।");
    }

    setLoading(false);
  };

  return (
    <>
      <TopBar />
      <Header />

      {/* 🌿 Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center bg-[url('/need-agro-banner.jpg')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <h1 className="relative z-10 text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          যোগাযোগ করুন
        </h1>
      </section>

      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-14">
          {/* LEFT SIDE INFO */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800">Dose care Support Center</h2>
            <p className="text-gray-600 mt-4 leading-relaxed text-lg">
              Have questions about our products or your order? Need help choosing the right gadget? Reach out to us. Our support team is here to assist you with anything you need.
            </p>

            <div className="mt-10 space-y-8">
              {/* Phone */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">Call Us</h4>
                  <p className="text-gray-600 mt-1">Saturday - Thursday, 9:00 AM to 8:00 PM</p>
                  <p className="text-gray-800 font-bold text-lg mt-1">+880 1784-217430</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">Email Us</h4>
                  <p className="text-gray-600 mt-1">We usually respond within 2-4 hours</p>
                  <p className="text-gray-600 text-sm mt-1 font-medium">contact@dosecare.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-600/10 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">ঠিকানা</h3>
                  <p className="text-gray-600 text-sm">কেশবপুর, ভেরিপারা মোর, রাজপাড়া</p>
                  <p className="text-gray-600 text-sm">Rajshahi, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-600/10 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">অফিস সময়</h3>
                  <p className="text-gray-600 text-sm">শনিবার - বৃহস্পতিবার: সকাল ৯টা - রাত ৯টা</p>
                  <p className="text-gray-600 text-sm">শুক্রবার: বিকাল ২টা - রাত ১০টা</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">বার্তা পাঠান</h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <Input
                    placeholder="নাম *"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />

                  <Input
                    type="email"
                    placeholder="ইমেইল *"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="সঠিক ইমেইল দিন। উদাহরণ: example@gmail.com"
                  />
                  <Input
                    type="tel"
                    placeholder="ফোন *"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    pattern="0[0-9]{9,10}"
                    title="বাংলাদেশের ফোন নম্বর দিন। উদাহরণ: 01323456789"
                  />


                  <Input
                    placeholder="বিষয় *"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />

                  <Textarea
                    rows={5}
                    placeholder="আপনার বার্তা..."
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />

                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                  >
                    {loading ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
                  </Button>
                </form>
              </div>

        </div>
      </div>

      <Footer />
    </>
  )
}
