"use client";

import React from 'react';

export function CustomLoader() {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-[300px] gap-6">
      <div className="relative flex justify-center items-center w-20 h-20">
        {/* Outer subtle spinning ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-orange-100 animate-[spin_3s_linear_infinite]"></div>
        
        {/* Inner fast spinning gradient ring */}
        <div className="absolute inset-2 rounded-full border-[3px] border-t-orange-500 border-r-orange-400 border-b-transparent border-l-transparent animate-[spin_1s_cubic-bezier(0.55,0.15,0.45,0.85)_infinite]"></div>
        
        {/* Pulsing center dot */}
        <div className="w-5 h-5 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full border-[2px] border-orange-500/20 animate-[ping_2s_ease-out_infinite]"></div>
      </div>
      
      {/* Loading text with animated dots */}
      <div className="flex items-center gap-1 text-sm font-semibold text-slate-500 tracking-wider uppercase">
        Loading
        <span className="flex gap-0.5">
          <span className="animate-[bounce_1.4s_infinite_0ms] text-orange-500 text-lg leading-none">.</span>
          <span className="animate-[bounce_1.4s_infinite_200ms] text-orange-500 text-lg leading-none">.</span>
          <span className="animate-[bounce_1.4s_infinite_400ms] text-orange-500 text-lg leading-none">.</span>
        </span>
      </div>
    </div>
  );
}
