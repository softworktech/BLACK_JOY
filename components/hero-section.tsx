"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Zap, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#fafbfc] overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-blue-100/50 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-orange-100/50 blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100"
            >
              <Zap size={16} className="text-orange-500 fill-orange-500" />
              <span>Premium Tech & Electronics</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15]">
                Latest Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Gadgets</span> <br className="hidden md:block" />
                At Your Fingertips
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-600 text-lg md:text-xl max-w-lg leading-relaxed"
            >
              সেরা মানের ইলেকট্রনিক্স পণ্য, স্মার্টফোন, ল্যাপটপ এবং গ্যাজেট কিনুন অত্যন্ত সাশ্রয়ী মূল্যে। আমাদের স্টোরে পাচ্ছেন ১০০% অরিজিনাল সব পণ্য দারুণ অফারে।
            </motion.p>

            {/* Features */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm font-semibold text-slate-700 pt-2"
            >
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100">
                <ShieldCheck size={18} className="text-blue-500" />
                <span>100% Original Products</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-100">
                <CheckCircle size={18} className="text-orange-500" />
                <span>Best Market Prices</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto"
            >
              <button 
                onClick={() => window.scrollTo({ top: document.getElementById('products')?.offsetTop || 800, behavior: 'smooth'})}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold text-lg shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] hover:scale-[1.02] transition-all"
              >
                <ShoppingCart size={20} />
                Shop Now
              </button>
              
              <a 
                href="https://play.google.com/store/apps/details?id=com.msts.need" 
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-3.5 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
              >
                Download App
                <ArrowRight size={20} />
              </a>
            </motion.div>
          </div>

          {/* Right Image/Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:h-[500px] flex justify-center items-center mt-8 lg:mt-0"
          >
            {/* Main Image */}
            <div className="relative z-10 w-full max-w-md mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img 
                src="/Hero.jpeg" 
                alt="Latest Electronics" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 aspect-4/3 sm:aspect-auto"
              />
              
              {/* Overlay Gradient for pop */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating Logo Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 sm:bottom-4 sm:-left-8 z-20 bg-white p-3 rounded-2xl shadow-xl border border-slate-100"
            >
              <img src="/logo.png" alt="Dose care" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            </motion.div>

            {/* Floating Discount Badge */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-4 -right-4 sm:top-10 sm:-right-8 z-20 bg-gradient-to-br from-blue-600 to-blue-500 text-white p-4 rounded-full shadow-[0_8px_20px_rgba(59,130,246,0.4)] flex flex-col items-center justify-center w-24 h-24"
            >
              <span className="text-sm font-medium">Up to</span>
              <span className="text-2xl font-black leading-none">20%</span>
              <span className="text-sm font-medium">OFF</span>
            </motion.div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
