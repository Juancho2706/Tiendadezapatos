"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";

const allProducts = [
    { id: 1, name: "Air Max Pulse", brand: "Nike", price: 149990, category: "Lifestyle", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Zoom Freak 5", brand: "Nike", price: 129990, salePrice: 99990, category: "Basketball", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Forum Low", brand: "Adidas", price: 109990, category: "Lifestyle", image: "https://images.unsplash.com/photo-1525966222134-fcfa99ca9776?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Air Force 1 '07", brand: "Nike", price: 119990, category: "Lifestyle", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Dunk Low Retro", brand: "Nike", price: 134990, category: "Lifestyle", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "Ultraboost 23", brand: "Adidas", price: 179990, salePrice: 139990, category: "Running", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop" },
    { id: 7, name: "550 White Green", brand: "New Balance", price: 124990, category: "Lifestyle", image: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop" },
    { id: 8, name: "Suede Classic", brand: "Puma", price: 89990, category: "Lifestyle", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop" },
];

const ITEMS_PER_PAGE = 4;

export default function BestSellers() {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
    const currentProducts = allProducts.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

    const nextPage = () => setCurrentPage((p) => (p + 1) % totalPages);
    const prevPage = () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages);

    return (
        <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">
            {/* Header */}
            <div className="flex items-end justify-between mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                >
                    <div className="w-1 h-10 bg-[var(--color-neon)] rounded-full" />
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-[-0.03em]">
                            Best Sellers
                        </h2>
                        <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase mt-1">Los más populares</p>
                    </div>
                </motion.div>

                <div className="hidden md:flex items-center gap-3">
                    <button
                        onClick={prevPage}
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={nextPage}
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Product Grid with page transitions */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                    {currentProducts.map((product, i) => (
                        <ProductCard key={product.id} product={product} index={i} />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPage ? "w-8 bg-[var(--color-neon)]" : "w-3 bg-zinc-700 hover:bg-zinc-500"
                            }`}
                    />
                ))}
            </div>

            {/* View all link */}
            <div className="text-center mt-8">
                <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors border-b border-zinc-700 hover:border-white pb-1">
                    Ver Todos los Productos <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </section>
    );
}
