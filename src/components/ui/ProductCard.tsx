
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
    product: {
        id: number | string;
        name: string;
        price: number;
        category: string;
        image: string;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    return (
        <div className="group relative flex flex-col h-full">
            <Link href={`/product/${product.id}`} className="block relative w-full aspect-[4/5] overflow-hidden bg-gray-50 mb-6">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Quick Add Overlay - only visible on hover (desktop) */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10 hidden lg:block">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addItem({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                quantity: 1,
                                size: 42,
                                color: "default"
                            });
                        }}
                        className="w-full bg-white text-black py-4 text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-3"
                    >
                        <ShoppingBag className="w-3 h-3" /> AGREGAR
                    </button>
                </div>
            </Link>

            <div className="flex flex-col flex-1 space-y-1">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <Link href={`/product/${product.id}`}>
                            <h3 className="text-lg font-bold uppercase leading-none tracking-tight hover:underline underline-offset-2">{product.name}</h3>
                        </Link>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{product.category}</p>
                    </div>
                    <span className="text-sm font-bold font-mono">${product.price.toLocaleString("es-CL")}</span>
                </div>
            </div>
        </div>
    );
}
