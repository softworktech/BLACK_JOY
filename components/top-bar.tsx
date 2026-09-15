"use client";

import { Phone, MessageCircle, MapPin } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center sm:justify-between gap-2">
        {/* Left / Info */}
        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm justify-center sm:justify-start w-full sm:w-auto">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 hidden sm:inline" />
          <span className="hidden sm:inline">
            বাংলাদেশের বিশ্বস্ত টেক স্টোর – ১০০% অরিজিনাল গ্যাজেট ও ফাস্ট ডেলিভারি ⚡
          </span>
          <span className="sm:hidden text-center flex items-center justify-center gap-1">
            ১০০% অরিজিনাল গ্যাজেট 🛡️
          </span>
        </div>

        {/* Right / Contact */}
        <div className="flex items-center gap-2 sm:gap-4 justify-center sm:justify-end w-full sm:w-auto font-medium">
          <a
            href="https://wa.me/8801784217430"
            className="flex items-center gap-1 sm:gap-1.5 hover:text-orange-200 transition-colors duration-300"
          >
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[10px] sm:text-sm">01784217430</span>
          </a>
          <a
            href="tel:01784217430"
            className="flex items-center gap-1 sm:gap-1.5 hover:text-orange-200 transition-colors duration-300"
          >
            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline text-sm">কল করুন:</span>
            <span className="text-[10px] sm:text-sm">01784217430</span>
          </a>
        </div>
      </div>
    </div>
  );
}
