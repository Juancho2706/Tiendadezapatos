
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black py-20 border-t border-white/5 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="font-display font-black text-3xl tracking-tighter block mb-6 uppercase text-white hover:text-[var(--color-neon)] transition-colors">
                            SNEAKHUB
                        </Link>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                            Premium footwear for the modern athlete and style enthusiast. Designed for performance, engineered for style.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-display font-black text-sm uppercase tracking-widest mb-6 text-white">Shop</h3>
                        <ul className="space-y-4 text-sm font-bold tracking-wide text-gray-500">
                            <li><Link href="/shop" className="hover:text-[var(--color-neon)] transition-colors">All Products</Link></li>
                            <li><Link href="/new-arrivals" className="hover:text-[var(--color-neon)] transition-colors">New Arrivals</Link></li>
                            <li><Link href="/brands" className="hover:text-[var(--color-neon)] transition-colors">Brands</Link></li>
                            <li><Link href="/sale" className="hover:text-[var(--color-neon)] transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-display font-black text-sm uppercase tracking-widest mb-6 text-white">Support</h3>
                        <ul className="space-y-4 text-sm font-bold tracking-wide text-gray-500">
                            <li><Link href="/help" className="hover:text-[var(--color-neon)] transition-colors">Help Center</Link></li>
                            <li><Link href="/shipping" className="hover:text-[var(--color-neon)] transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/size-guide" className="hover:text-[var(--color-neon)] transition-colors">Size Guide</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--color-neon)] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-display font-black text-sm uppercase tracking-widest mb-6 text-white">Follow Us</h3>
                        <div className="flex space-x-4 mb-8">
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-[var(--color-neon)] hover:text-black transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-[var(--color-neon)] hover:text-black transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-[var(--color-neon)] hover:text-black transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-600">
                        &copy; {new Date().getFullYear()} SneakHub. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-xs font-bold uppercase tracking-widest text-gray-600">
                        <Link href="/privacy" className="hover:text-[var(--color-neon)] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[var(--color-neon)] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
