"use client";

import { Phone, MessageCircle, MapPin } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center sm:justify-between gap-2">
        {/* Left / Info */}
        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm justify-center sm:justify-start w-full sm:w-auto">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">
            ঘরে বসেই বাজার করুন – দ্রুত, সহজ ও নিরাপদ 🛒
          </span>
          <span className="sm:hidden text-center">
            ৬-৯ AM & ৩-১০ PM 🚚
          </span>
        </div>

        {/* Right / Contact */}
        <div className="flex items-center gap-2 sm:gap-4 justify-center sm:justify-end w-full sm:w-auto">
          <a
            href="https://wa.me/8801345678910"
            className="flex items-center gap-1 sm:gap-1.5 hover:opacity-90 transition-opacity duration-300"
          >
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-[10px] sm:text-sm">01345678910</span>
          </a>
          <a
            href="tel:01345678910"
            className="flex items-center gap-1 sm:gap-1.5 hover:opacity-90 transition-opacity duration-300"
          >
            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline text-sm">কল করুন:</span>
            <span className="text-[10px] sm:text-sm">01345678910</span>
          </a>
        </div>
      </div>
    </div>
  );
}
