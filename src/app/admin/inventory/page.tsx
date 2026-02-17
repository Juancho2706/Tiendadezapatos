"use client";

import { useState, useEffect } from "react";
import { Search, Check, AlertTriangle } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function InventoryPage() {
    const supabase = createSupabaseBrowserClient();
    const [variants, setVariants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState(0);

    useEffect(() => { loadInventory(); }, []);

    async function loadInventory() {
        const { data } = await (supabase
            .from("product_variants") as any)
            .select("*, products(name, product_images(url, is_main))")
            .order("stock_quantity", { ascending: true });
        setVariants(data || []);
        setLoading(false);
    }

    async function saveStock(variantId: string, newStock: number) {
        await (supabase.from("product_variants") as any).update({ stock_quantity: newStock }).eq("id", variantId);
        setVariants((v) => v.map((x: any) => x.id === variantId ? { ...x, stock_quantity: newStock } : x));
        setEditingId(null);
    }

    const filtered = variants.filter((v: any) => {
        const matchSearch = v.products?.name?.toLowerCase().includes(search.toLowerCase()) || v.sku?.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            filter === "all" ? true :
                filter === "out" ? v.stock_quantity === 0 :
                    filter === "low" ? v.stock_quantity > 0 && v.stock_quantity < 10 : true;
        return matchSearch && matchFilter;
    });

    const totalOut = variants.filter((v: any) => v.stock_quantity === 0).length;
    const totalLow = variants.filter((v: any) => v.stock_quantity > 0 && v.stock_quantity < 10).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Inventario</h1>
                <div className="flex gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-red-400"><AlertTriangle className="w-3 h-3" /> {totalOut} agotado{totalOut !== 1 && "s"}</span>
                    <span className="flex items-center gap-1.5 text-yellow-400"><AlertTriangle className="w-3 h-3" /> {totalLow} stock bajo</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="text" placeholder="Buscar por producto o SKU..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                </div>
                <div className="flex gap-2">
                    {["all", "low", "out"].map((f) => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-2 text-xs font-bold uppercase rounded-lg border transition-colors ${filter === f ? "border-[var(--color-neon)] text-[var(--color-neon)] bg-[var(--color-neon)]/10" : "border-zinc-800 text-zinc-500 hover:text-white"
                                }`}>
                            {f === "all" ? "Todos" : f === "low" ? "Stock Bajo" : "Agotado"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Producto</th>
                            <th className="px-4 py-3 text-left">Talla</th>
                            <th className="px-4 py-3 text-left hidden sm:table-cell">Color</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">SKU</th>
                            <th className="px-4 py-3 text-center">Stock</th>
                            <th className="px-4 py-3 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-8 bg-zinc-900 rounded animate-pulse" /></td></tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="py-12 text-center text-zinc-500">No se encontraron variantes</td></tr>
                        ) : (
                            filtered.map((v: any) => {
                                const img = v.products?.product_images?.find((i: any) => i.is_main)?.url || v.products?.product_images?.[0]?.url;
                                const isEditing = editingId === v.id;
                                return (
                                    <tr key={v.id} className="hover:bg-zinc-900/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-zinc-800 overflow-hidden relative flex-shrink-0">
                                                    {img && <Image src={img} alt="" fill className="object-cover" />}
                                                </div>
                                                <span className="text-white font-medium text-sm truncate max-w-[180px]">{v.products?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-white font-bold">{v.size}</td>
                                        <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">{v.color || "—"}</td>
                                        <td className="px-4 py-3 text-zinc-500 font-mono text-xs hidden md:table-cell">{v.sku || "—"}</td>
                                        <td className="px-4 py-3 text-center">
                                            {isEditing ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <input
                                                        type="number"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(Number(e.target.value))}
                                                        className="w-16 px-2 py-1 bg-zinc-950 border border-[var(--color-neon)] rounded text-white text-sm text-center focus:outline-none"
                                                        autoFocus
                                                        onKeyDown={(e) => { if (e.key === "Enter") saveStock(v.id, editValue); if (e.key === "Escape") setEditingId(null); }}
                                                    />
                                                    <button onClick={() => saveStock(v.id, editValue)} className="p-1 text-green-500 hover:text-green-400">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => { setEditingId(v.id); setEditValue(v.stock_quantity); }}
                                                    className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm transition-colors cursor-text"
                                                    title="Click para editar"
                                                >
                                                    {v.stock_quantity}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${v.stock_quantity === 0 ? "bg-red-500/10 text-red-400" : v.stock_quantity < 10 ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                                                }`}>
                                                {v.stock_quantity === 0 ? "Agotado" : v.stock_quantity < 10 ? "Bajo" : "OK"}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
