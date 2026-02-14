
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Minus, Plus, ShoppingBag, Heart, ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/ui/Button";
import ProductGallery from "@/components/product/ProductGallery";
import SizeSelector from "@/components/product/SizeSelector";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

// Mock Data
const products = [
    {
        id: 1,
        name: "AIR MAX PULSE",
        price: 150000,
        description: "Inspiradas en la escena musical de Londres, las Nike Air Max Pulse aportan un toque underground a la icónica línea Air Max. Su entresuela envuelta en tela y detalles sellados al vacío mantienen un aspecto fresco y limpio.",
        details: [
            "Composición: 100% malla transpirable",
            "Suela de goma duradera",
            "Diseñado en Oregon, USA"
        ],
        category: "HOMBRE",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1965&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=2015&auto=format&fit=crop"
        ],
        sizes: [38, 39, 40, 41, 42, 43, 44, 45],
        colors: ["NEGRO", "BLANCO"]
    },
];

export default function ProductPage() {
    const { t } = useLanguage();
    const { addItem } = useCart();
    const params = useParams();
    const id = Number(params.id);

    const product = products.find(p => p.id === id) || products[0];

    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-12">
            <div className="container-custom">
                {/* Breadcrumb */}
                <div className="text-xs text-gray-500 mb-8 uppercase tracking-widest">
                    INICIO / {product.category} / <span className="text-black font-bold">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Image Gallery (Left - 7 cols) */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={product.images} productName={product.name} />
                    </div>

                    {/* Product Info (Right - 5 cols) */}
                    <div className="lg:col-span-5 sticky top-24 h-fit">
                        <h1 className="text-2xl font-bold uppercase tracking-tight mb-2">{product.name}</h1>
                        <p className="text-xl font-medium mb-6">{formatPrice(product.price)}</p>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <SizeSelector
                                sizes={product.sizes}
                                selectedSize={selectedSize}
                                onSelect={setSelectedSize}
                            />
                            {!selectedSize && <p className="text-red-500 text-xs mt-2 hidden" id="size-error">Por favor selecciona una talla</p>}
                        </div>

                        {/* Add to Cart */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex border border-gray-200 w-32">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 hover:bg-gray-100 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="flex-1 flex items-center justify-center font-bold text-sm">
                                    {quantity}
                                </div>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 hover:bg-gray-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    if (selectedSize) {
                                        addItem({
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            image: product.images[0],
                                            quantity: quantity,
                                            size: selectedSize,
                                            color: "Default"
                                        });
                                    } else {
                                        // Simple alert for now, or highlight border
                                        alert("Por favor selecciona una talla");
                                    }
                                }}
                                className="flex-1 bg-[#2c3e50] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#1a252f] transition-colors py-4"
                            >
                                AGREGAR AL CARRITO • {formatPrice(product.price * quantity)}
                            </button>
                        </div>

                        {/* Description Accordion */}
                        <div className="border-t border-gray-200 py-4">
                            <button
                                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                className="flex justify-between items-center w-full text-sm font-bold uppercase tracking-widest"
                            >
                                DESCRIPCIÓN
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
                                        <div className="pt-4 text-sm text-gray-600 leading-relaxed">
                                            <p className="mb-4">{product.description}</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                {product.details.map((detail, idx) => (
                                                    <li key={idx}>{detail}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="border-t border-gray-200 py-4">
                            <button className="flex justify-between items-center w-full text-sm font-bold uppercase tracking-widest text-gray-400 cursor-not-allowed">
                                ENVÍO Y DEVOLUCIONES
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
