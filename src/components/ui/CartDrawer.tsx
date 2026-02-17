"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatCLP } from "@/lib/utils";

export default function CartDrawer() {
    const { items, removeItem, updateQuantity, subtotal, isOpen, closeCart } = useCart();



    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-md pointer-events-auto"
                    >
                        <div className="flex h-full flex-col bg-[#0a0a0a] border-l border-white/5">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5 text-[var(--color-neon)]" />
                                    <h2 className="text-sm font-black uppercase tracking-widest text-white">
                                        Tu Carrito
                                    </h2>
                                    {items.length > 0 && (
                                        <span className="text-[10px] font-bold text-zinc-500 tracking-wider">
                                            ({items.length})
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={closeCart}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                {items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-5">
                                        <div className="w-20 h-20 rounded-full bg-[#141414] flex items-center justify-center">
                                            <ShoppingBag className="w-8 h-8 text-zinc-600" />
                                        </div>
                                        <p className="text-zinc-500 text-sm">Tu carrito está vacío</p>
                                        <button
                                            onClick={closeCart}
                                            className="text-xs font-bold uppercase tracking-widest text-[var(--color-neon)] hover:text-white transition-colors border-b border-[var(--color-neon)]/30 hover:border-white pb-0.5"
                                        >
                                            Seguir Comprando
                                        </button>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-white/5 -mt-2">
                                        {items.map((item) => (
                                            <li key={`${item.id}-${item.size}-${item.color}`} className="flex py-5 gap-4">
                                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#141414] border border-white/5">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={80}
                                                        height={80}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex flex-1 flex-col min-w-0">
                                                    <div className="flex justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <Link
                                                                href={`/product/${item.id}`}
                                                                onClick={closeCart}
                                                                className="text-sm font-bold uppercase tracking-tight text-white hover:text-[var(--color-neon)] transition-colors truncate block"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                                                                Talla: {item.size} • {item.color}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm font-bold text-white whitespace-nowrap">
                                                            {formatCLP(item.price * item.quantity)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-auto pt-2">
                                                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                                                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="px-3 text-xs font-bold">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                                                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeItem(item.id, item.size, item.color)}
                                                            className="text-zinc-600 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Footer */}
                            {items.length > 0 && (
                                <div className="border-t border-white/5 px-6 py-6 bg-[#0d0d0d]">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Subtotal</span>
                                        <span className="text-lg font-black text-white">{formatCLP(subtotal)}</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-600 mb-5">Envío calculado en checkout</p>
                                    <Link
                                        href="/checkout"
                                        onClick={closeCart}
                                        className="flex items-center justify-center w-full bg-[var(--color-neon)] text-black px-6 py-4 text-sm font-bold uppercase tracking-widest hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all duration-300"
                                    >
                                        Ir al Checkout
                                    </Link>
                                    <button
                                        onClick={closeCart}
                                        className="w-full mt-3 text-center text-xs text-zinc-500 font-bold uppercase tracking-widest hover:text-white transition-colors py-2"
                                    >
                                        Seguir Comprando
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
