"use client";

import { useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/services/products";

interface ShopBrowserProps {
    initialProducts: Product[];
}

const categories = [
    { id: "All", label: "Todos" },
    { id: "Hombre", label: "Hombre" },
    { id: "Mujer", label: "Mujer" },
    { id: "Basketball", label: "Basketball" },
    { id: "Running", label: "Running" },
    { id: "Lifestyle", label: "Lifestyle" },
];

const brands = ["Nike", "Adidas", "New Balance", "Puma", "Jordan", "Converse"];

const sortOptions = [
    { value: "newest", label: "Más Recientes" },
    { value: "price-asc", label: "Precio: Bajo a Alto" },
    { value: "price-desc", label: "Precio: Alto a Bajo" },
];

export default function ShopBrowser({ initialProducts }: ShopBrowserProps) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    // Convert products to match ProductCard expectations if not already matched
    // ProductCard expects: { ... product ... }
    // Our Product type from service matches closely but we need to ensure `image` property exists for ProductCard if it uses it.
    // ProductCard uses `image` (singular). Our product has `images` (array).
    // Let's map it.
    const products = initialProducts.map(p => ({
        ...p,
        image: p.images[0] || "/placeholder.jpg",
        salePrice: p.salePrice ?? undefined,
        category: p.category || "General",
    }));

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };

    let filteredProducts = products.filter((p) => {
        const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
        return matchesCat && matchesSearch && matchesBrand;
    });

    // Sort
    if (sortBy === "price-asc") filteredProducts.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") filteredProducts.sort((a, b) => b.price - a.price);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-20">
            <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-[-0.04em] mb-2">
                        Tienda
                    </h1>
                    <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase">
                        {filteredProducts.length} productos
                    </p>
                </motion.div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/5">
                    <div className="relative flex-1 max-w-sm w-full">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full pl-7 pr-4 py-2 text-sm bg-transparent border-b border-white/10 focus:border-[var(--color-neon)] focus:outline-none transition-colors placeholder:text-zinc-600 font-bold tracking-wider uppercase"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#141414] border border-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-300 focus:outline-none focus:border-[var(--color-neon)] transition-colors appearance-none cursor-pointer"
                        >
                            {sortOptions.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 border text-xs font-bold uppercase tracking-widest transition-all ${showFilters ? "border-[var(--color-neon)] text-[var(--color-neon)]" : "border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
                                }`}
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5" /> Filtros
                        </button>
                    </div>
                </div>

                <div className="flex gap-10">
                    {/* Sidebar Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.aside
                                initial={{ opacity: 0, width: 0, marginRight: 0 }}
                                animate={{ opacity: 1, width: 240, marginRight: 0 }}
                                exit={{ opacity: 0, width: 0, marginRight: 0 }}
                                transition={{ duration: 0.3 }}
                                className="hidden md:block shrink-0 overflow-hidden"
                            >
                                <div className="w-60 space-y-8">
                                    {/* Categories */}
                                    <div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Categorías</h3>
                                        <div className="space-y-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setSelectedCategory(cat.id)}
                                                    className={`block text-sm font-medium tracking-wide transition-all ${selectedCategory === cat.id
                                                        ? "text-white font-bold"
                                                        : "text-zinc-500 hover:text-zinc-300"
                                                        }`}
                                                >
                                                    {selectedCategory === cat.id && (
                                                        <span className="inline-block w-2 h-2 bg-[var(--color-neon)] rounded-full mr-2" />
                                                    )}
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Brands */}
                                    <div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4">Marcas</h3>
                                        <div className="space-y-2">
                                            {brands.map((b) => (
                                                <label key={b} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedBrands.includes(b)
                                                        ? "bg-[var(--color-neon)] border-[var(--color-neon)]"
                                                        : "border-zinc-700 group-hover:border-zinc-500"
                                                        }`}>
                                                        {selectedBrands.includes(b) && (
                                                            <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-sm transition-colors ${selectedBrands.includes(b) ? "text-white font-bold" : "text-zinc-500 group-hover:text-zinc-300"}`}
                                                        onClick={() => toggleBrand(b)}
                                                    >
                                                        {b}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-1 min-w-0">
                        {/* Mobile Categories */}
                        <div className="md:hidden flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`whitespace-nowrap px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all ${selectedCategory === cat.id
                                        ? "bg-[var(--color-neon)] text-black border-[var(--color-neon)]"
                                        : "bg-transparent text-zinc-400 border-white/10 hover:border-white/30"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            <AnimatePresence>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product, i) => (
                                        <ProductCard key={product.id} product={product} index={i} />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full text-center py-32"
                                    >
                                        <p className="text-zinc-500 text-sm uppercase tracking-widest">No se encontraron productos</p>
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
