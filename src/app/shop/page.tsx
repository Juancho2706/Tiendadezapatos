
"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const products = [
    { id: 1, name: "Air Max Pulse", price: 150000, category: "Men's Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, name: "Zoom Freak 4", price: 130000, category: "Basketball Shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" },
    { id: 3, name: "Blazer Mid '77", price: 100000, category: "Casual", image: "https://images.unsplash.com/photo-1525966222134-fcfa99ca9776?q=80&w=998&auto=format&fit=crop" },
    { id: 4, name: "Air Force 1 '07", price: 110000, category: "Lifestyle", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=2050&auto=format&fit=crop" },
    { id: 5, name: "Nike Dunk Low", price: 120000, category: "Lifestyle", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop" },
    { id: 6, name: "Metcon 9", price: 140000, category: "Training", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop" },
];

export default function ShopPage() {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        // Check immediately
        checkScreenSize();

        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const categories = [
        { id: "All", label: t.shop.all },
        { id: "Men's Shoes", label: t.shop.mens },
        { id: "Women's Shoes", label: t.shop.womens },
        { id: "Basketball Shoes", label: t.shop.basketball },
        { id: "Running", label: t.shop.running },
        { id: "Lifestyle", label: t.shop.lifestyle },
    ];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 pb-8 border-b border-gray-100">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">{t.shop.title}</h1>
                        <p className="text-gray-400 font-bold tracking-widest text-xs uppercase">{filteredProducts.length} {t.shop.results}</p>
                    </motion.div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t.shop.searchPlaceholder}
                                className="w-full pl-8 pr-4 py-2 text-sm font-bold uppercase tracking-wider border-b border-gray-200 focus:border-black focus:outline-none transition-colors placeholder:text-gray-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="hidden md:flex gap-2 border-gray-200 hover:border-black rounded-none px-6 py-2 text-xs font-bold uppercase tracking-widest"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal className="w-3 h-3" /> {t.shop.filters}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Filters */}
                    <AnimatePresence>
                        {(showFilters || isLargeScreen) && (
                            <motion.aside
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="hidden lg:block w-64 space-y-12 shrink-0"
                            >
                                <div>
                                    <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-400">{t.shop.categories}</h3>
                                    <ul className="space-y-4">
                                        {categories.map((cat) => (
                                            <li key={cat.id}>
                                                <button
                                                    onClick={() => setSelectedCategory(cat.id)}
                                                    className={`text-sm tracking-wide transition-all hover:translate-x-1 ${selectedCategory === cat.id
                                                        ? "font-black text-black"
                                                        : "font-medium text-gray-500 hover:text-black"
                                                        }`}
                                                >
                                                    {cat.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold uppercase tracking-widest text-xs mb-6 text-gray-400">{t.shop.priceRange}</h3>
                                    <div className="space-y-4">
                                        {["$0 - $50", "$50 - $100", "$100 - $150", "$150+"].map((price, i) => (
                                            <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                                                <div className="w-4 h-4 border border-gray-200 flex items-center justify-center group-hover:border-black transition-colors">
                                                    {/* Mock checkbox state */}
                                                </div>
                                                <span className="text-sm font-medium text-gray-500 group-hover:text-black transition-colors">{price}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Mobile Categories Scroll */}
                        <div className="lg:hidden flex overflow-x-auto pb-4 mb-8 gap-4 scrollbar-hide">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`whitespace-nowrap px-6 py-3 text-xs font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat.id
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-500 border-gray-200"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16"
                        >
                            <AnimatePresence>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            key={product.id}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full text-center py-32"
                                    >
                                        <p className="text-lg text-gray-400 font-light uppercase tracking-widest">{t.shop.noResults}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
