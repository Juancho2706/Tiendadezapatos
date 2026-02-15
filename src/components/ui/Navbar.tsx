
"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { openCart, items } = useCart();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    // Scrolled state for glass effect intensity
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "HOME", href: "/" },
        { name: "DROPS", href: "/shop?sort=newest" },
        { name: "HOMBRE", href: "/shop?category=Hombre" },
        { name: "MUJER", href: "/shop?category=Mujer" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/5 backdrop-blur-md ${scrolled ? "bg-[var(--color-base)]/90 py-4" : "bg-transparent py-6"
                    }`}
            >
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

                    {/* Brand - Left */}
                    <div className="flex-shrink-0 z-50">
                        <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter text-white font-display">
                            SNEAKER.CL
                        </Link>
                    </div>

                    {/* Desktop Links - Center */}
                    <div className="hidden lg:flex items-center space-x-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative group text-sm font-bold tracking-[0.2em] text-white/90 hover:text-white transition-colors"
                            >
                                {link.name}
                                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[var(--color-neon)] transition-all duration-300 group-hover:w-full box-shadow-neon" />
                            </Link>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="hidden lg:flex items-center space-x-8 text-white z-50">
                        <button className="hover:text-[var(--color-neon)] transition-colors">
                            <Search className="w-6 h-6" />
                        </button>
                        <Link href="/admin/login" className="hover:text-[var(--color-neon)] transition-colors">
                            <User className="w-6 h-6" />
                        </Link>
                        <button
                            className="relative hover:text-[var(--color-neon)] transition-colors"
                            onClick={openCart}
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--color-neon)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden z-50 text-white flex gap-4 items-center">
                        <button
                            className="relative hover:text-[var(--color-neon)] transition-colors"
                            onClick={openCart}
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--color-neon)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button
                            className="hover:text-[var(--color-neon)] transition-colors"
                            onClick={() => setIsOpen(true)}
                        >
                            <Menu className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Full Screen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "-100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-100%" }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 bg-[var(--color-base)]/95 backdrop-blur-xl z-[60] flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-white hover:text-[var(--color-neon)] transition-colors"
                        >
                            <X className="w-10 h-10" />
                        </button>

                        <div className="flex flex-col items-center space-y-8 text-center">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 + 0.3 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-5xl md:text-7xl font-black text-transparent hover:text-[var(--color-neon)] transition-all font-display tracking-tighter stroke-text hover:stroke-neon"
                                        style={{ WebkitTextStroke: "1px white" }}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
