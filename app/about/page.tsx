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
              Easy Point - About Us
            </h1>
            <p className="text-xl text-gray-200 mt-4 max-w-2xl mx-auto leading-relaxed">
              We are a dedicated team providing you with premium electronics, smart gadgets, and quality tech accessories at the best prices.
            </p>
          </div>
        </section>

        {/* 🍀 ABOUT SECTION */}
        <section className="py-20 px-6 md:px-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[450px]">
              <Image 
                src="/Hero.jpeg" 
                alt="About Easy Point" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="font-semibold text-orange-600">Easy Point</span> is a trusted tech store, providing 100% authentic and original gadgets across Bangladesh. We source the best products from top brands to ensure quality and reliability.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg mt-4">
                Our Mission — <span className="font-semibold text-gray-800">
                To make premium electronics accessible and provide the best customer experience.
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
