
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="flex flex-col gap-4">
            {/* Main Image with Zoom */}
            <div
                className="relative bg-[#f5f5f5] aspect-[4/5] w-full overflow-hidden cursor-crosshair group"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
            >
                <Image
                    src={activeImage}
                    alt={productName}
                    fill
                    className="object-cover transition-transform duration-500"
                    priority
                />

                {/* Zoom Lens / Magnified View */}
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
                                backgroundSize: "200%", // 2x Zoom level
                                backgroundColor: "white"
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Mobile Pinch hint or indicator could go here */}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveImage(img)}
                        className={`
                relative aspect-square cursor-pointer border-2 transition-all overflow-hidden
                ${activeImage === img ? 'border-black opacity-100' : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'}
            `}
                    >
                        <Image
                            src={img}
                            alt={`${productName} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
