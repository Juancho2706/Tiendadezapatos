"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BLUR_DATA_URL } from "@/lib/constants";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(images[0]);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePosition({ x, y });
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Main Image with Zoom */}
            <div
                className="relative bg-[#141414] aspect-[4/5] w-full overflow-hidden cursor-crosshair rounded-xl border border-white/5"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={activeImage}
                            alt={productName}
                            fill
                            className="object-cover"
                            priority
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Zoom Lens */}
                <AnimatePresence>
                    {isZoomed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-10 pointer-events-none hidden md:block"
                            style={{
                                backgroundImage: `url(${activeImage})`,
                                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                                backgroundSize: "200%",
                                backgroundColor: "#141414",
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveImage(img)}
                        className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${activeImage === img
                            ? "border-[var(--color-neon)] opacity-100"
                            : "border-white/5 opacity-50 hover:opacity-100 hover:border-white/20"
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${productName} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
