"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";

// Mock Data: 12 products (3 pages x 4 products)
const products = [
    {
        id: 1,
        name: "Nike Air Force 1 '07",
        category: "Zapatillas para Hombre",
        price: 119990,
        originalPrice: null,
        discount: null,
        image: "/Jordan 3.png", // Using existing placeholder
        colorsCount: "2 Colores",
    },
    {
        id: 2,
        name: "Nike Dunk Low Retro",
        category: "Zapatillas para Hombre",
        price: 99990,
        originalPrice: 129990,
        discount: "23% OFF",
        image: "/Hombre 1.png",
        colorsCount: "5 Colores",
    },
    {
        id: 3,
        name: "Air Jordan 1 Mid",
        category: "Zapatillas para Mujer",
        price: 134990,
        originalPrice: null,
        discount: null,
        image: "/Mujer 1.png",
        colorsCount: "3 Colores",
    },
    {
        id: 4,
        name: "Nike Air Max 90",
        category: "Zapatillas Unisex",
        price: 149990,
        originalPrice: null,
        discount: null,
        image: "/Jordan 3.png",
        colorsCount: "1 Color",
    },
    {
        id: 5,
        name: "Nike Blazer Mid '77",
        category: "Zapatillas Vintage",
        price: 89990,
        originalPrice: 109990,
        discount: "18% OFF",
        image: "/Hombre 1.png",
        colorsCount: "2 Colores",
    },
    {
        id: 6,
        name: "Nike Air Max Plus",
        category: "Zapatillas para Hombre",
        price: 169990,
        originalPrice: null,
        discount: null,
        image: "/Mujer 1.png",
        colorsCount: "4 Colores",
    },
    {
        id: 7,
        name: "Nike Pegasus 40",
        category: "Running",
        price: 129990,
        originalPrice: null,
        discount: null,
        image: "/Jordan 3.png",
        colorsCount: "6 Colores",
    },
    {
        id: 8,
        name: "Jordan Stay Loyal 3",
        category: "Basketball",
        price: 109990,
        originalPrice: 139990,
        discount: "21% OFF",
        image: "/Hombre 1.png",
        colorsCount: "2 Colores",
    },
    {
        id: 9,
        name: "Nike Tech Hera",
        category: "Zapatillas para Mujer",
        price: 114990,
        originalPrice: null,
        discount: null,
        image: "/Mujer 1.png",
        colorsCount: "3 Colores",
    },
    {
        id: 10,
        name: "Nike Cortez",
        category: "Zapatillas Unisex",
        price: 79990,
        originalPrice: 94990,
        discount: "15% OFF",
        image: "/Jordan 3.png",
        colorsCount: "2 Colores",
    },
    {
        id: 11,
        name: "Nike Gamma Force",
        category: "Zapatillas para Mujer",
        price: 96990,
        originalPrice: null,
        discount: null,
        image: "/Hombre 1.png",
        colorsCount: "4 Colores",
    },
    {
        id: 12,
        name: "Nike Ebernon Low",
        category: "Zapatillas Casual",
        price: 64990,
        originalPrice: null,
        discount: null,
        image: "/Mujer 1.png",
        colorsCount: "1 Color",
    },
];

const ITEMS_PER_PAGE = 4;

export default function BestSellers() {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const paginatedProducts = products.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    return (
        <section className="py-24 bg-[var(--color-dark-slate)]">
            <div className="container-custom">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tighter text-white">
                        Los Más <span className="text-[var(--color-neon)]">Vendidos</span>
                    </h2>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 0}
                            className={`w-12 h-12 rounded-full bg-[var(--color-concrete)]/20 hover:bg-[var(--color-concrete)]/40 flex items-center justify-center transition-all ${currentPage === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                }`}
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages - 1}
                            className={`w-12 h-12 rounded-full bg-[var(--color-concrete)]/20 hover:bg-[var(--color-concrete)]/40 flex items-center justify-center transition-all ${currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                }`}
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="overflow-hidden min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {paginatedProducts.map((product) => (
                                <div key={product.id} className="group cursor-pointer">
                                    {/* Image Container */}
                                    <div className="relative aspect-square bg-[var(--color-base)] border border-white/5 rounded-sm mb-4 overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Fav Icon */}
                                        <div className="absolute top-4 right-4 bg-black/20 p-2 rounded-full hover:bg-black/40 transition-colors">
                                            <Heart className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-[var(--color-neon)] transition-colors">
                                                {product.name}
                                            </h3>
                                            {product.discount && (
                                                <span className="text-[var(--color-neon)] font-bold text-xs">
                                                    {product.discount}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-[var(--color-concrete)] text-sm font-medium">
                                            {product.category}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {product.colorsCount}
                                        </p>

                                        <div className="pt-2 flex items-center gap-3">
                                            {product.originalPrice ? (
                                                <>
                                                    <span className="text-white font-bold text-base">
                                                        ${product.price.toLocaleString("es-CL")}
                                                    </span>
                                                    <span className="text-gray-500 text-sm line-through">
                                                        ${product.originalPrice.toLocaleString("es-CL")}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-white font-bold text-base">
                                                    ${product.price.toLocaleString("es-CL")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
