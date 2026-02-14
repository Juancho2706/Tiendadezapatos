
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
    products: any[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === "left" ? -400 : 400;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="relative group">
            {/* Scroll Buttons */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={() => scroll("right")}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Carousel Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        className="min-w-[280px] md:min-w-[320px] snap-start"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
