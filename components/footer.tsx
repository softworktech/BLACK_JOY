"use client";

import { Facebook, Youtube, Phone, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-white rounded-t-2xl shadow-md overflow-hidden mt-12">
      {/* Subtle background shapes */}
      <div className="absolute w-40 h-40 bg-orange-100/20 blur-3xl rounded-full -top-10 -left-10 animate-pulse"></div>
      <div className="absolute w-32 h-32 bg-blue-100/20 blur-2xl rounded-full -bottom-8 -right-8 animate-pulse"></div>

      <div className="container mx-auto px-4 py-8 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Brand */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 col-span-full">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Dose care</h2>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed">
              Dose care is your trusted online shop for premium tech, gadgets, and electronics. Fast delivery & secure payments.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-600 hover:text-orange-600 transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-slate-600 hover:text-orange-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-600 hover:text-orange-600 transition-colors">Contact</Link></li>
              <li><Link href="/track-order" className="text-slate-600 hover:text-orange-600 transition-colors">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Policies</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-slate-600 hover:text-orange-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-600 hover:text-orange-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/returns" className="text-slate-600 hover:text-orange-600 transition-colors">Return Policy</Link></li>
              <li><Link href="/shipping" className="text-slate-600 hover:text-orange-600 transition-colors">Shipping Info</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/dosecare" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.youtube.com/@Dosecare" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all"
              >
                <Youtube size={20} />
              </a>
            </div>
            <div className="mt-6">
              <p className="text-sm text-slate-600 flex flex-col gap-1.5">
                <span className="flex items-center gap-2"><Phone size={16} className="text-orange-600"/> 01784217430</span>
                <span className="flex items-center gap-2"><Mail size={16} className="text-orange-600"/> info@dosecare.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 mt-10 pt-6 pb-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} <span className="font-semibold text-slate-800">Dose care</span>. All Rights Reserved.
      </div>
    </footer>
  );
}
