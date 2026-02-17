"use client";

import { useState } from "react";
import { Minus, Plus, Heart, ChevronDown, ChevronUp, Truck, RotateCcw, Shield } from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import SizeSelector from "@/components/product/SizeSelector";
import ProductCard from "@/components/ui/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { formatCLP } from "@/lib/utils";

// Related products passed as props
interface ProductViewProps {
    product: any;
    relatedProducts: any[];
}

export default function ProductView({ product, relatedProducts }: ProductViewProps) {
    const { addItem } = useCart();

    // Convert ID to number if needed, but we passed the product object directly so we use product.id

    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
    const [isShippingOpen, setIsShippingOpen] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = () => {
        if (selectedSize) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity,
                size: selectedSize,
                color: "Default",
            });
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-8 uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-white transition-colors">{product.category}</Link>
                    <span>/</span>
                    <span className="text-white font-bold">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">

                    {/* Gallery (7 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7"
                    >
                        <ProductGallery images={product.images} productName={product.name} />
                    </motion.div>

                    {/* Info (5 cols) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-5 lg:sticky lg:top-24 lg:h-fit space-y-6"
                    >
                        {/* Brand & Name */}
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-neon)] mb-1">{product.brand}</p>
                            <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-[-0.02em] leading-none">{product.name}</h1>
                        </div>

                        <p className="text-2xl font-bold">{formatCLP(product.price)}</p>

                        {/* Size Selector */}
                        <SizeSelector
                            sizes={product.sizes}
                            selectedSize={selectedSize}
                            onSelect={setSelectedSize}
                        />

                        {/* Quantity + Add to Cart */}
                        <div className="flex gap-3">
                            <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 font-bold text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedSize}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all rounded-lg ${addedToCart
                                    ? "bg-green-500 text-white"
                                    : selectedSize
                                        ? "bg-[var(--color-neon)] text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                    }`}
                            >
                                {addedToCart ? "✓ Agregado!" : !selectedSize ? "Selecciona una Talla" : `Agregar — ${formatCLP(product.price * quantity)}`}
                            </button>
                        </div>

                        {/* Wishlist */}
                        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                            <Heart className="w-4 h-4" /> Agregar a Favoritos
                        </button>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Truck, label: "Envío Gratis", sub: "+$50.000" },
                                { icon: RotateCcw, label: "Devolución", sub: "30 días" },
                                { icon: Shield, label: "Garantía", sub: "Original" },
                            ].map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="flex flex-col items-center text-center p-3 bg-[#141414] rounded-lg border border-white/5">
                                    <Icon className="w-4 h-4 text-[var(--color-neon)] mb-1.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                                    <span className="text-[9px] text-zinc-500">{sub}</span>
                                </div>
                            ))}
                        </div>

                        {/* Accordion: Description */}
                        <div className="border-t border-white/5 pt-4">
                            <button
                                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                className="flex justify-between items-center w-full text-xs font-bold uppercase tracking-widest text-zinc-300"
                            >
                                Descripción
                                {isDescriptionOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <AnimatePresence>
                                {isDescriptionOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 text-sm text-zinc-400 leading-relaxed">
                                            <p className="mb-4">{product.description}</p>
                                            <ul className="list-disc pl-5 space-y-1 text-zinc-500">
                                                {product.features && product.features.map((detail: string, idx: number) => (
                                                    <li key={idx}>{detail}</li>
                                                ))}
                                                {product.details && product.details.map((detail: string, idx: number) => (
                                                    <li key={idx}>{detail}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Accordion: Shipping */}
                        <div className="border-t border-white/5 pt-4">
                            <button
                                onClick={() => setIsShippingOpen(!isShippingOpen)}
                                className="flex justify-between items-center w-full text-xs font-bold uppercase tracking-widest text-zinc-300"
                            >
                                Envío y Devoluciones
                                {isShippingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <AnimatePresence>
                                {isShippingOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-4 text-sm text-zinc-400 leading-relaxed space-y-2">
                                            <p>• Envío gratis en pedidos superiores a $50.000</p>
                                            <p>• Entrega en 3-5 días hábiles</p>
                                            <p>• Devolución gratuita dentro de 30 días</p>
                                            <p>• Producto 100% original y certificado</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                <section className="mt-24 border-t border-white/5 pt-16">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-1 h-8 bg-[var(--color-neon)] rounded-full" />
                        <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-[-0.02em]">
                            También Te Puede Gustar
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {relatedProducts.map((p, i) => (
                            <ProductCard key={p.id} product={p} index={i} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
