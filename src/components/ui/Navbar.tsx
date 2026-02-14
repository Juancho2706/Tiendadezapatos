
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
    const { t } = useLanguage();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    // Scrolled state for border
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Top Banner */}
            <div className="bg-[#2c3e50] text-white text-[10px] md:text-xs font-bold py-2 text-center uppercase tracking-widest">
                DESPACHO GRATIS EN COMPRAS SOBRE $54.990 A TODO CHILE.
            </div>

            <nav
                className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? "shadow-sm" : ""
                    }`}
            >
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                    {/* Mobile Menu Trigger */}
                    <button
                        className="lg:hidden p-2 -ml-2"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Desktop Left Links */}
                    <div className="hidden lg:flex items-center space-x-8 text-xs font-bold tracking-widest uppercase">
                        <Link href="/" className="hover:text-gray-500 transition-colors">{t.nav.home}</Link>
                        <Link href="/shop" className="hover:text-gray-500 transition-colors">{t.nav.products}</Link>
                        <Link href="/shop?filter=offers" className="text-red-600 hover:text-red-700 transition-colors">{t.nav.offers}</Link>
                        <Link href="/about" className="hover:text-gray-500 transition-colors">{t.nav.about}</Link>
                    </div>

                    {/* Centered Logo */}
                    <Link href="/" className="text-2xl font-black tracking-tighter uppercase absolute left-1/2 transform -translate-x-1/2">
                        SNEAKHUB
                    </Link>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-6">
                        <button className="hidden lg:block hover:text-gray-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/admin/login" className="hidden lg:block hover:text-gray-500 transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                        <button
                            className="relative hover:text-gray-500 transition-colors"
                            onClick={openCart}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-50 lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white z-50 lg:hidden shadow-xl"
                        >
                            <div className="p-4 flex justify-between items-center border-b border-gray-100">
                                <span className="font-bold text-lg">MENU</span>
                                <button onClick={() => setIsOpen(false)}><X className="w-6 h-6" /></button>
                            </div>
                            <div className="flex flex-col p-6 space-y-6 text-sm font-bold tracking-widest uppercase">
                                <Link href="/" onClick={() => setIsOpen(false)}>{t.nav.home}</Link>
                                <Link href="/shop" onClick={() => setIsOpen(false)}>{t.nav.products}</Link>
                                <Link href="/shop?filter=offers" className="text-red-600" onClick={() => setIsOpen(false)}>{t.nav.offers}</Link>
                                <Link href="/about" onClick={() => setIsOpen(false)}>{t.nav.about}</Link>
                                <div className="h-px bg-gray-100 my-2" />
                                <Link href="/admin/login" className="text-gray-500" onClick={() => setIsOpen(false)}>Mi Cuenta</Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
