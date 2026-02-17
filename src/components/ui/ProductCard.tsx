"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatCLP } from "@/lib/utils";
import { BLUR_DATA_URL } from "@/lib/constants";

interface ProductCardProps {
    product: {
        id: number | string;
        name: string;
        price: number;
        salePrice?: number;
        category: string;
        brand?: string;
        image: string;
    };
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { addItem } = useCart();



    const [imgSrc, setImgSrc] = useState(product.image);

    const hasDiscount = product.salePrice && product.salePrice < product.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="group relative flex flex-col h-full"
        >
            <Link
                href={`/product/${product.id}`}
                className="block relative w-full aspect-square overflow-hidden rounded-xl bg-[#141414] mb-4"
            >
                <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    onError={() => setImgSrc("/hero_new.jpg")}
                />

                {/* Sale badge */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-[var(--color-sale)] text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-wider rounded-full">
                            Sale
                        </span>
                    </div>
                )}

                {/* Quick Add — slide up on hover */}
                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 hidden lg:block">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addItem({
                                id: product.id,
                                name: product.name,
                                price: product.salePrice || product.price,
                                image: product.image,
                                quantity: 1,
                                size: 42,
                                color: "default",
                            });
                        }}
                        className="w-full bg-[var(--color-neon)] text-black py-3 text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 rounded-lg"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
                    </button>
                </div>

                {/* Subtle border */}
                <div className="absolute inset-0 border border-white/5 rounded-xl pointer-events-none group-hover:border-[var(--color-neon)]/20 transition-colors" />
            </Link>

            <div className="space-y-1 px-1">
                {product.brand && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">{product.brand}</p>
                )}
                <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-white hover:text-[var(--color-neon)] transition-colors leading-tight">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center gap-2">
                    {hasDiscount ? (
                        <>
                            <span className="text-sm font-bold text-[var(--color-neon)]">{formatCLP(product.salePrice!)}</span>
                            <span className="text-xs text-zinc-600 line-through">{formatCLP(product.price)}</span>
                        </>
                    ) : (
                        <span className="text-sm font-bold text-white">{formatCLP(product.price)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
