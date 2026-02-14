
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#fafafa] pt-20 pb-10 border-t border-white">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="font-black text-3xl tracking-tighter block mb-6 uppercase">
                            SNEAKHUB
                        </Link>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider leading-relaxed max-w-xs">
                            Premium footwear for the modern athlete and style enthusiast. Designed for performance, engineered for style.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Shop</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <li><Link href="/shop" className="hover:text-black transition-colors">All Products</Link></li>
                            <li><Link href="/new-arrivals" className="hover:text-black transition-colors">New Arrivals</Link></li>
                            <li><Link href="/brands" className="hover:text-black transition-colors">Brands</Link></li>
                            <li><Link href="/sale" className="hover:text-red-600 transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Support</h3>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <li><Link href="/help" className="hover:text-black transition-colors">Help Center</Link></li>
                            <li><Link href="/shipping" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/size-guide" className="hover:text-black transition-colors">Size Guide</Link></li>
                            <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-sm uppercase tracking-widest mb-6 text-gray-900">Follow Us</h3>
                        <div className="flex space-x-6 mb-8">
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors"><Twitter className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-10 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        &copy; {new Date().getFullYear()} SneakHub. All rights reserved.
                    </p>
                    <div className="flex space-x-8 mt-4 md:mt-0 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-black">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
