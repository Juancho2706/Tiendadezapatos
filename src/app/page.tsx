
"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import ProductCarousel from "@/components/ui/ProductCarousel";

// Mock Data - Extended to 15 items
const featuredProducts = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  name: `Air Max Pulse ${i + 1}`,
  price: 150000 + (i * 1000),
  category: i % 2 === 0 ? "HOMBRE" : "MUJER",
  image: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525966222134-fcfa99ca9776?q=80&w=998&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=2050&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop"
  ][i % 6]
}));

const categories = [
  { name: "HOMBRE", image: "https://images.unsplash.com/photo-1488161628813-99c974fc5b7b?q=80&w=2070&auto=format&fit=crop", link: "/shop?category=Hombre" },
  { name: "MUJER", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop", link: "/shop?category=Mujer" },
  { name: "ACCESORIOS", image: "https://images.unsplash.com/photo-1520975661595-dc22803a6058?q=80&w=2067&auto=format&fit=crop", link: "/shop?category=Accesorios" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Hero Section - Video Background */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero_optimized.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" /> {/* Slightly darker overlay for video text legibility */}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 drop-shadow-2xl"
          >
            STREET CULTURE
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Link href="/shop">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 border-none rounded-none px-12 py-5 text-sm font-bold tracking-widest uppercase shadow-xl transition-transform hover:scale-105">
                DESCUBRIR
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <Link href={cat.link} key={idx} className="group relative aspect-[4/5] overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white text-4xl font-black tracking-tighter uppercase border-b-4 border-transparent group-hover:border-white transition-all pb-1 italic">
                  {cat.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Slider - Extended Width */}
      <section className="py-20 mb-20 bg-[#fcfcfc] border-y border-gray-100">
        <div className="container-custom relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 italic">NEW ARRIVALS</h2>
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Lo último en tecnología y estilo.</p>
            </div>
            <Link href="/shop" className="group flex items-center gap-2 text-sm font-bold uppercase hover:text-gray-600 transition-colors bg-white px-6 py-3 border border-gray-200 rounded-full hover:border-black">
              VER TODO <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Carousel Component */}
          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      {/* Shop by Gender Section - Larger & Taller */}
      <section className="w-full px-4 md:px-8 py-20 mb-20 scroll-mt-20">
        <div className="max-w-[1800px] mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter uppercase text-center md:text-left">Compra por género</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[75vh] min-h-[600px]">
            {/* Hombre */}
            <Link href="/shop?category=Hombre" className="relative group overflow-hidden bg-gray-100 h-full w-full">
              <Image
                src="/Hombre 1.png"
                alt="Hombre"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end justify-center pb-12 bg-black/10 group-hover:bg-black/20 transition-colors">
                <span className="bg-white text-black px-12 py-5 rounded-full text-base font-black uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-colors">
                  Hombre
                </span>
              </div>
            </Link>

            {/* Mujer */}
            <Link href="/shop?category=Mujer" className="relative group overflow-hidden bg-gray-100 h-full w-full">
              <Image
                src="/Mujer 1.png"
                alt="Mujer"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end justify-center pb-12 bg-black/10 group-hover:bg-black/20 transition-colors">
                <span className="bg-white text-black px-12 py-5 rounded-full text-base font-black uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-colors">
                  Mujer
                </span>
              </div>
            </Link>

            {/* Niños */}
            <Link href="/shop?category=Ninos" className="relative group overflow-hidden bg-gray-100 h-full w-full">
              <Image
                src="/Nino P1.webp"
                alt="Niños"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end justify-center pb-12 bg-black/10 group-hover:bg-black/20 transition-colors">
                <span className="bg-white text-black px-12 py-5 rounded-full text-base font-black uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-colors">
                  Niños
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      {/* Footer Banner - Minimalist with Contrast */}
      <section className="py-24 text-center px-4 bg-[#f4f4f5]">
        <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">ÚNETE AL CLUB</h3>
        <p className="text-gray-500 max-w-lg mx-auto mb-10 font-bold tracking-wide uppercase text-xs">
          Suscríbete para recibir acceso exclusivo a lanzamientos limitados y descuentos especiales.
        </p>
        <div className="max-w-md mx-auto flex border-b border-black pb-2">
          <input
            type="email"
            placeholder="TU EMAIL"
            className="flex-1 bg-transparent px-4 py-2 text-sm font-bold uppercase placeholder:text-gray-400 focus:outline-none"
          />
          <button className="text-black px-4 py-2 text-sm font-black uppercase tracking-widest hover:text-gray-600 transition-colors">
            ENVIAR
          </button>
        </div>
      </section>

    </div>
  );
}
