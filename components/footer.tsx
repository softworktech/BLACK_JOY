"use client";

import { Facebook, Youtube, MessageCircle, Smartphone } from "lucide-react";
import Link from "next/link";

export function Footer() {


  const phone = "8801953575880";
const message = "আমি আপনার প্রোডাক্ট সম্পর্কে জানতে চাই।"; // এখানে তোমার নতুন মেসেজ
const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (

    
    <footer className="relative bg-white rounded-t-2xl shadow-md overflow-hidden mt-12">
      
      {/* Subtle background shapes */}
      <div className="absolute w-40 h-40 bg-green-100/20 blur-3xl rounded-full -top-10 -left-10 animate-pulse"></div>
      <div className="absolute w-32 h-32 bg-yellow-100/20 blur-2xl rounded-full -bottom-8 -right-8 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

        {/* Brand */}
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-green-700">Vtech Store</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            A to Z Agro & Grocery Products
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex justify-center gap-4 md:gap-6 text-gray-700 text-xs md:text-sm flex-wrap">
          <Link href="./" className="hover:text-green-600 transition">Home</Link>
          <Link href="./about" className="hover:text-green-600 transition">About</Link>
          <Link href="#" className="hover:text-green-600 transition">Products</Link>
          <Link href="./contact" className="hover:text-green-600 transition">Contact</Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-end gap-3 md:gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61583163303353"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-600 transition transform hover:scale-110"
              >
                <Facebook className="h-5 w-5 md:h-6 md:w-6" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-600 transition transform hover:scale-110"
              >
                <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
              </a>

              <a
                href="https://www.youtube.com/@VtechStore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-600 transition transform hover:scale-110"
              >
                <Youtube className="h-5 w-5 md:h-6 md:w-6" />
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.msts.need"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-600 transition transform hover:scale-110"
              >
                <Smartphone className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </div>


      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 text-center text-gray-500 text-xs md:text-sm py-3">
        © 2025 <span className="font-semibold text-green-700">Vtech Store</span>. All Rights Reserved.
      </div>
    </footer>
  )
}
