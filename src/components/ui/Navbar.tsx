"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { openCart, items } = useCart();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    // Scroll-aware: hide on scroll down, show on scroll up
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const lastScrollY = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const direction = latest > lastScrollY.current ? "down" : "up";
        lastScrollY.current = latest;
        setScrolled(latest > 50);
        if (latest > 200) {
            setHidden(direction === "down");
        } else {
            setHidden(false);
        }
    });

    const navLinks = [
        { name: "NUEVOS", href: "/shop?sort=newest" },
        { name: "HOMBRE", href: "/shop?category=Hombre" },
        { name: "MUJER", href: "/shop?category=Mujer" },
        { name: "MARCAS", href: "/shop?view=brands" },
        { name: "SALE", href: "/shop?sale=true", accent: true },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: hidden ? -100 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "glass-nav py-3"
                    : "bg-transparent py-5 border-b border-transparent"
                    }`}
            >
                <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 flex items-center justify-between">

                    {/* Brand - Left */}
                    <Link href="/" className="text-xl md:text-2xl font-black tracking-[-0.06em] text-white font-display z-50 hover:text-[var(--color-neon)] transition-colors">
                        SNEAKHUB
                    </Link>

                    {/* Desktop Links - Center */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`relative group text-[13px] font-bold tracking-[0.15em] transition-colors ${link.accent
                                    ? "text-red-500 hover:text-red-400"
                                    : "text-zinc-400 hover:text-white"
                                    }`}
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--color-neon)] transition-all duration-300 ease-out group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="hidden lg:flex items-center gap-6 z-50">
                        <Link href="/admin" className="text-zinc-400 hover:text-[var(--color-neon)] transition-colors text-xs font-bold border border-zinc-800 px-3 py-1.5 rounded-full hover:border-[var(--color-neon)] hover:bg-white/5">
                            ADMIN
                        </Link>
                        <button className="text-zinc-400 hover:text-white transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button
                            className="relative text-zinc-400 hover:text-white transition-colors"
                            onClick={openCart}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-[var(--color-neon)] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center"
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </button>
                    </div>

                    {/* Mobile */}
                    <div className="lg:hidden z-50 flex gap-4 items-center">
                        <button className="relative text-zinc-400 hover:text-white transition-colors" onClick={openCart}>
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--color-neon)] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button className="text-white" onClick={() => setIsOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Fullscreen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-[#0a0a0a] z-[60] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-5">
                            <span className="text-xl font-black tracking-[-0.06em] font-display">SNEAKHUB</span>
                            <button onClick={() => setIsOpen(false)} className="text-white">
                                <X className="w-7 h-7" />
                            </button>
                        </div>

                        {/* Links */}
                        <div className="flex-1 flex flex-col justify-center px-8 gap-2">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 + 0.1, duration: 0.4 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block text-5xl font-black font-display tracking-[-0.04em] py-2 transition-colors ${link.accent ? "text-red-500" : "text-white hover:text-[var(--color-neon)]"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Bottom */}
                        <div className="px-8 pb-10 text-xs text-zinc-500 font-medium tracking-widest uppercase">
                            <p>Envío gratis +$50.000</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
