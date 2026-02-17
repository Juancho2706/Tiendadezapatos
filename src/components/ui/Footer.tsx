"use client";

import Link from "next/link";
import { Instagram, Twitter, Youtube, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
    shop: [
        { name: "Nuevos Drops", href: "/shop?sort=newest" },
        { name: "Hombre", href: "/shop?category=Hombre" },
        { name: "Mujer", href: "/shop?category=Mujer" },
        { name: "Niños", href: "/shop?category=Kids" },
        { name: "Sale", href: "/shop?sale=true" },
    ],
    support: [
        { name: "Contacto", href: "#" },
        { name: "Envíos", href: "#" },
        { name: "Devoluciones", href: "#" },
        { name: "Guía de Tallas", href: "#" },
        { name: "FAQ", href: "#" },
    ],
};

const socials = [
    { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-black border-t border-white/5">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="text-2xl font-black font-display tracking-[-0.06em] text-white">
                            SNEAKHUB
                        </Link>
                        <p className="text-sm text-zinc-500 mt-4 leading-relaxed max-w-xs">
                            Zapatillas urbanas premium. Drops exclusivos cada viernes. Envío gratis en pedidos +$50.000.
                        </p>
                        <div className="flex gap-3 mt-6">
                            {socials.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-[var(--color-neon)] hover:border-[var(--color-neon)] transition-all duration-300"
                                    aria-label={label}
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-5">Tienda</h4>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-5">Soporte</h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter mini */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-5">Newsletter</h4>
                        <p className="text-sm text-zinc-500 mb-4">Drops y ofertas directo a tu inbox.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 bg-[#141414] border border-white/10 border-r-0 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-neon)] transition-colors"
                            />
                            <button className="bg-[var(--color-neon)] text-black px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors">
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-600">
                        © 2026 SneakHub. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacidad</Link>
                        <Link href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Términos</Link>
                        <button onClick={scrollToTop} className="text-zinc-600 hover:text-white transition-colors">
                            <ArrowUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
