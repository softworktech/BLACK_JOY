import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <Header />

      <main className="min-h-screen bg-white">

        {/* 🌿 HERO SECTION */}
        <section className="relative w-full h-[85vh] flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Vtech Store Banner"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

          {/* Content */}
          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wide drop-shadow-md">
              Vtech Store
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mt-4">
              নিরাপদ, পুষ্টিকর ও বিশ্বস্ত কৃষিপণ্য — সরাসরি কৃষকের হাত থেকে।
            </p>
          </div>
        </section>

        {/* 🍀 ABOUT SECTION */}
        <section className="py-20 px-6 md:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Image */}
            <div>
              <Image
                src="/logo.png"
                alt="About Vtech Store"
                width={650}
                height={420}
                className="rounded-3xl shadow-xl object-cover"
              />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6 leading-snug">
                আমরা বিশ্বাস করি — **বিশুদ্ধ খাবারই স্বাস্থ্যকর জীবন।**
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                <span className="font-semibold text-green-600">Vtech Store</span> একটি বিশ্বস্ত কৃষিপণ্য
                সরবরাহকারী প্রতিষ্ঠান, যারা দেশের বিভিন্ন অঞ্চলের
                পরিশ্রমী কৃষকদের কাছ থেকে সরাসরি পণ্য সংগ্রহ করে।
                আমরা নিশ্চিত করি যাতে পণ্যটি তার আসল স্বাদ, গন্ধ এবং
                পুষ্টিমান অক্ষুণ্ণ রেখে ক্রেতার কাছে পৌঁছাতে পারে।
              </p>

              <p className="text-gray-600 leading-relaxed text-lg mt-4">
                আমাদের লক্ষ্য — <span className="font-semibold text-gray-800">
                কৃষকের ন্যায্য মূল্য নিশ্চিত করা এবং ক্রেতার হাতে বিশুদ্ধ পণ্য পৌঁছে দেওয়া।
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 🌱 MISSION / VISION */}
        <section className="py-16 px-6 md:px-24 bg-gradient-to-br from-green-50 to-green-100 rounded-t-[45px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">

            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">আমাদের লক্ষ্য</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                পরিষ্কার ও মানসম্মত কৃষিপণ্য দেশব্যাপী সহজলভ্য করা
                এবং একটি সুস্থ খাদ্য সংস্কৃতি প্রচার করা।
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">আমাদের অঙ্গীকার</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                কৃষকের অধিকার ও মূল্য নিশ্চিত করে একটি স্বচ্ছ ও ন্যায়সঙ্গত সাপ্লাই-চেইন গঠন করা।
              </p>
            </div>

          </div>
        </section>

        {/* 👥 TEAM SECTION
        
        <section className="py-20 px-6 md:px-24 text-center bg-white">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">আমাদের পরামর্শক</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {[
              { name: "Md: Golam Kibria", role: "প্রধান পরামর্শক" },
              { name: "Robiul Islam", role: "পরিচালক ও পরামর্শক" },
            ].map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl p-8 shadow hover:shadow-xl transition">
                <div className="w-24 h-24 mx-auto rounded-full bg-green-300 flex items-center justify-center text-3xl font-extrabold text-green-800">
                  {p.name[0]}
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-gray-800">{p.name}</h3>
                <p className="text-gray-500 mt-1">{p.role}</p>
              </div>
            ))}
          </div>
        </section>
        
        */}
        

      </main>

      <Footer />
    </>
  )
}
