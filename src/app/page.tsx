
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import BestSellers from "@/components/ui/BestSellers";

export default function Home() {
  return (
    <div className="bg-[var(--color-base)] min-h-screen text-white overflow-hidden">

      {/* 1. IMMERSIVE HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          {/* Fallback image or video placeholder */}
          <Image
            src="/Hero New.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom text-center md:text-left pt-20">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter mb-6 uppercase">
              El Flow Que <br />
              <span className="text-transparent stroke-text" style={{ WebkitTextStroke: "2px white" }}>Pisa Fuerte</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-10 font-medium tracking-wide">
              Las siluetas más duras de Viña y todo Chile. <br className="hidden md:block" />
              Streetwear premium, sin atajos.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/shop"
                className="bg-[var(--color-neon)] text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Ver Colección <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/shop?sort=newest"
                className="border border-white text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                Nuevos Drops
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
        </motion.div>
      </section>

      {/* 2. INFINITE MARQUEE */}
      <div className="bg-[var(--color-neon)] py-3 overflow-hidden relative z-20">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center mx-4">
              <span className="text-[var(--color-base)] mx-4 font-black">✦</span>
              <span className="text-sm md:text-base font-black tracking-[0.2em] uppercase text-[var(--color-base)]">ENVÍOS A TODO CHILE</span>
              <span className="text-[var(--color-base)] mx-4 font-black">✦</span>
              <span className="text-sm md:text-base font-black tracking-[0.2em] uppercase text-[var(--color-base)]">3 CUOTAS SIN INTERÉS</span>
              <span className="text-[var(--color-base)] mx-4 font-black">✦</span>
              <span className="text-sm md:text-base font-black tracking-[0.2em] uppercase text-[var(--color-base)]">ZAPATILLAS ORIGINALES</span>
              <span className="text-[var(--color-base)] mx-4 font-black">✦</span>
              <span className="text-sm md:text-base font-black tracking-[0.2em] uppercase text-[var(--color-base)]">NUEVO DROP VIERNES</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TRENDING NOW (BENTO GRID) */}
      <section className="py-24 container-custom">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter">
            Lo Que Se <span className="text-[var(--color-neon)]">Està Llevando</span>
          </h2>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-[var(--color-neon)] pb-1 hover:text-[var(--color-neon)] transition-colors">
            Ver Todo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[repeat(2,500px)] md:h-[800px]">
          {/* Item 1 - Large (2x2) */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden border border-white/10 bg-[var(--color-dark-slate)]">
            <Image src="/Jordan 3.png" alt="Jordan 3" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-[var(--color-neon)] text-black text-xs font-black px-3 py-1 uppercase tracking-wider">HOT</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
              <h3 className="text-3xl font-black uppercase mb-2">Air Jordan 3 Retro</h3>
              <p className="text-sm text-gray-300 mb-4">El clásico redefinido para las calles.</p>
              <span className="text-xl font-bold text-[var(--color-neon)]">$189.990</span>
            </div>
          </div>

          {/* Item 2 - Tall (1x2) */}
          <div className="md:col-span-1 md:row-span-2 relative group overflow-hidden border border-white/10 bg-[var(--color-dark-slate)]">
            <Image src="/Hombre 1.png" alt="Hombre" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-white text-black text-xs font-black px-3 py-1 uppercase tracking-wider">NUEVO</span>
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
              <h3 className="text-2xl font-black uppercase mb-2">Street Culture</h3>
              <Link href="/shop?category=Hombre" className="underline decoration-[var(--color-neon)] decoration-2 underline-offset-4 font-bold">Ver Colección</Link>
            </div>
          </div>

          {/* Item 3 - Square (1x1) */}
          <div className="relative group overflow-hidden border border-white/10 bg-[var(--color-dark-slate)]">
            <Image src="/Mujer 1.png" alt="Mujer" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-red-600 text-white text-xs font-black px-3 py-1 uppercase tracking-wider">30% OFF</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
              <h4 className="font-bold uppercase text-sm">Essentials Mujer</h4>
            </div>
          </div>

          {/* Item 4 - Square (1x1) */}
          <div className="relative group overflow-hidden border border-white/10 bg-[var(--color-dark-slate)]">
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-base)]">
              <span className="text-[var(--color-neon)] text-6xl font-black opacity-20 rotate-12">DROPS</span>
            </div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
              <Star className="w-12 h-12 text-[var(--color-neon)] mb-4" />
              <h3 className="text-xl font-black uppercase mb-2">Únete al Club</h3>
              <p className="text-xs text-gray-400 mb-4">Acceso anticipado a lanzamientos exclusivos.</p>
              <button className="border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all px-4 py-2 text-xs font-bold uppercase tracking-widest">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </section>

      <BestSellers />

      {/* Newsletter Section (Updated visuals) */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-neon)] opacity-5 blur-[100px] pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase mb-6">
            No Te Pierdas <br /><span className="text-[var(--color-neon)]">Nada</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Suscríbete para recibir noticias sobre nuevos lanzamientos, ofertas exclusivas y eventos.
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="TU EMAIL"
              className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-neon)] transition-colors text-sm font-bold tracking-widest"
            />
            <button type="button" className="bg-[var(--color-neon)] text-black px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors">
              Enviar
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
