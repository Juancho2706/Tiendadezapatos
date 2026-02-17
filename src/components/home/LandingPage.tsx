"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import BestSellers from "@/components/ui/BestSellers";
import type { Product } from "@/services/products";

interface LandingPageProps {
    bestSellers: Product[];
}

const stagger = {
    hidden: { opacity: 0, y: 40 },
    show: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

export default function LandingPage({ bestSellers }: LandingPageProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white overflow-hidden">

            {/* ═══════════════════════════════════════════ */}
            {/* 1. HERO — Fullscreen with Parallax */}
            {/* ═══════════════════════════════════════════ */}
            <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Parallax Background */}
                <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
                    <Image
                        src="/Hero New.png"
                        alt="Hero — Premium Urban Sneakers"
                        fill
                        className="object-cover scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />
                </motion.div>

                {/* Content */}
                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 w-full text-left"
                >
                    {/* Pill Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="mb-6"
                    >
                        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase text-zinc-300">
                            🔥 Nueva Colección SS26
                        </span>
                    </motion.div>

                    <motion.h1
                        custom={0}
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black leading-[0.85] tracking-[-0.04em] uppercase mb-6"
                    >
                        THE DROP<br />
                        <span className="text-[var(--color-neon)]">IS HERE</span>
                    </motion.h1>

                    <motion.p
                        custom={1}
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="text-base md:text-lg text-zinc-400 max-w-md mb-10 leading-relaxed"
                    >
                        Nuevas colecciones exclusivas cada semana.
                        Streetwear premium directo a tu puerta.
                    </motion.p>

                    <motion.div
                        custom={2}
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="/shop"
                            className="group bg-[var(--color-neon)] text-black px-8 py-4 font-bold uppercase text-sm tracking-widest hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Explorar Ahora
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/shop?sort=newest"
                            className="border border-white/20 text-white px-8 py-4 font-bold uppercase text-sm tracking-widest hover:bg-white hover:text-black transition-all duration-300 text-center"
                        >
                            Nuevos Drops
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-500">Scroll</span>
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════ */}
            {/* 2. MARQUEE TICKER */}
            {/* ═══════════════════════════════════════════ */}
            <div className="bg-[var(--color-neon)] py-3 overflow-hidden relative z-20">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="flex items-center mx-3 shrink-0">
                            <span className="text-black mx-3 text-xs">✦</span>
                            <span className="text-[13px] font-black tracking-[0.2em] uppercase text-black">ENVÍO GRATIS EN PEDIDOS +$50.000</span>
                            <span className="text-black mx-3 text-xs">✦</span>
                            <span className="text-[13px] font-black tracking-[0.2em] uppercase text-black">NUEVOS DROPS CADA VIERNES</span>
                            <span className="text-black mx-3 text-xs">✦</span>
                            <span className="text-[13px] font-black tracking-[0.2em] uppercase text-black">DEVOLUCIÓN GRATIS 30 DÍAS</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════ */}
            {/* 3. TRENDING NOW — Bento Grid */}
            {/* ═══════════════════════════════════════════ */}
            <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex items-end justify-between mb-10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-1 h-10 bg-[var(--color-neon)] rounded-full" />
                        <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-[-0.03em]">
                            Trending Now
                        </h2>
                    </div>
                    <Link href="/shop" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors border-b border-zinc-700 hover:border-white pb-1">
                        Ver Todo <ArrowRight className="w-3 h-3" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 md:h-[700px]">
                    {/* Card 1 — Large (2×2) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0 }}
                        className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-xl bg-[#141414] min-h-[400px]"
                    >
                        <Image src="/Hombre 1.png" alt="Street Culture Hombre" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-[var(--color-neon)] text-black text-[10px] font-black px-3 py-1.5 uppercase tracking-wider rounded-full">New Drop</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-1">Colección</p>
                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">Street Culture</h3>
                            <Link href="/shop?category=Hombre" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[var(--color-neon)] hover:text-white transition-colors">
                                Explorar <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none group-hover:border-[var(--color-neon)]/20 transition-colors" />
                    </motion.div>

                    {/* Card 2 — Tall (1×2) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="md:col-span-1 md:row-span-2 relative group overflow-hidden rounded-xl bg-[#141414] min-h-[300px]"
                    >
                        <Image src="/Mujer 1.png" alt="Essentials Mujer" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-wider rounded-full">30% Off</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-1">Mujer</p>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-3">Essentials</h3>
                            <Link href="/shop?category=Mujer" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[var(--color-neon)] hover:text-white transition-colors">
                                Ver <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none group-hover:border-[var(--color-neon)]/20 transition-colors" />
                    </motion.div>

                    {/* Card 3 — Square (1×1) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative group overflow-hidden rounded-xl bg-[#141414] min-h-[200px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-neon)]/10 to-transparent" />
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                            <span className="text-5xl mb-3">🔥</span>
                            <h3 className="text-lg font-black uppercase tracking-tight mb-1">Drops Exclusivos</h3>
                            <p className="text-[11px] text-zinc-500 mb-4 max-w-[200px]">Acceso anticipado a lanzamientos cada viernes.</p>
                            <Link href="/shop?sort=newest" className="border border-white/20 hover:bg-[var(--color-neon)] hover:text-black hover:border-[var(--color-neon)] transition-all px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                Ver Drops
                            </Link>
                        </div>
                        <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none" />
                    </motion.div>

                    {/* Card 4 — Square (1×1) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative group overflow-hidden rounded-xl min-h-[200px]"
                    >
                        <Image src="/Nino P1.webp" alt="Niños" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-white text-black text-[10px] font-black px-3 py-1.5 uppercase tracking-wider rounded-full">Nuevo</span>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-6">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-1">Kids Collection</h3>
                            <Link href="/shop" className="text-xs font-bold tracking-widest uppercase text-[var(--color-neon)] hover:text-white transition-colors">
                                Explorar →
                            </Link>
                        </div>
                        <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none group-hover:border-[var(--color-neon)]/20 transition-colors" />
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════ */}
            {/* 4. BEST SELLERS */}
            {/* ═══════════════════════════════════════════ */}
            <BestSellers products={bestSellers} />

            {/* ═══════════════════════════════════════════ */}
            {/* 5. SHOP BY BRAND */}
            {/* ═══════════════════════════════════════════ */}
            <section className="py-16 border-y border-white/5">
                <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-xs font-bold tracking-[0.3em] uppercase text-zinc-500 mb-10"
                    >
                        Marcas Destacadas
                    </motion.h2>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        {["Nike", "Jordan", "Adidas", "New Balance", "Puma"].map((brand, i) => (
                            <motion.div
                                key={brand}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <Link
                                    href={`/shop?brand=${brand.toLowerCase().replace(' ', '-')}`}
                                    className="text-2xl md:text-3xl font-display font-black uppercase tracking-[-0.03em] text-zinc-700 hover:text-white transition-all duration-300 hover:scale-110 inline-block"
                                >
                                    {brand}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════ */}
            {/* 6. NEWSLETTER */}
            {/* ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 relative overflow-hidden">
                {/* Glow background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-neon)] opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-xl mx-auto px-5 text-center relative z-10"
                >
                    <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-[-0.03em] mb-4">
                        Únete Al<br />
                        <span className="text-[var(--color-neon)]">Club</span>
                    </h2>
                    <p className="text-zinc-500 text-sm md:text-base mb-8 max-w-sm mx-auto">
                        Sé el primero en enterarte de nuevos drops y ofertas exclusivas.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="TU EMAIL"
                            className="flex-1 bg-[#141414] border border-white/10 px-5 py-4 text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors text-sm font-bold tracking-widest rounded-none"
                        />
                        <button type="button" className="bg-[var(--color-neon)] text-black px-8 py-4 font-bold uppercase text-sm tracking-widest hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300">
                            Suscribir
                        </button>
                    </form>
                </motion.div>
            </section>
        </div>
    );
}
