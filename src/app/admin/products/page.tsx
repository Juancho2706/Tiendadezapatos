"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, Eye } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const formatCLP = (n: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);

export default function ProductsPage() {
    const supabase = createSupabaseBrowserClient();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("all");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => { loadProducts(); }, []);

    async function loadProducts() {
        setLoading(true);
        const { data } = await (supabase
            .from("products") as any)
            .select("*, brands(name), product_variants(stock_quantity), product_images(url, is_main)")
            .order("created_at", { ascending: false });
        setProducts(data || []);
        setLoading(false);
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        await (supabase.from("products") as any).delete().eq("id", deleteId);
        setProducts((p) => p.filter((x) => x.id !== deleteId));
        setDeleteId(null);
        setDeleting(false);
    }

    const filtered = products.filter((p: any) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === "all" || p.category === filterCat;
        return matchSearch && matchCat;
    });

    const categories = [...new Set(products.map((p: any) => p.category))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Productos</h1>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-neon)] text-black text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                >
                    <Plus className="w-4 h-4" /> Agregar Producto
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                    />
                </div>
                <select
                    value={filterCat}
                    onChange={(e) => setFilterCat(e.target.value)}
                    className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                >
                    <option value="all">Todas las categorías</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Producto</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Marca</th>
                            <th className="px-4 py-3 text-left hidden lg:table-cell">Categoría</th>
                            <th className="px-4 py-3 text-right">Precio</th>
                            <th className="px-4 py-3 text-center hidden sm:table-cell">Stock</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-10 bg-zinc-900 rounded animate-pulse" /></td></tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500">No se encontraron productos</td></tr>
                        ) : (
                            filtered.map((p: any) => {
                                const mainImg = p.product_images?.find((i: any) => i.is_main)?.url || p.product_images?.[0]?.url;
                                const totalStock = p.product_variants?.reduce((s: number, v: any) => s + v.stock_quantity, 0) || 0;
                                return (
                                    <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0 relative">
                                                    {mainImg && <Image src={mainImg} alt={p.name} fill className="object-cover" />}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-white">{p.name}</span>
                                                    <div className="flex gap-1 mt-0.5">
                                                        {p.is_featured && <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-bold">DESTACADO</span>}
                                                        {p.is_drop && <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-bold">DROP</span>}
                                                        {p.sale_price && <span className="text-[9px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded font-bold">OFERTA</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-400 hidden md:table-cell">{p.brands?.name || "—"}</td>
                                        <td className="px-4 py-3 text-zinc-400 hidden lg:table-cell">{p.category}</td>
                                        <td className="px-4 py-3 text-right">
                                            {p.sale_price ? (
                                                <div>
                                                    <span className="text-orange-400 font-bold">{formatCLP(p.sale_price)}</span>
                                                    <span className="text-zinc-600 line-through text-xs ml-1">{formatCLP(p.price)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-white font-medium">{formatCLP(p.price)}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${totalStock === 0 ? "bg-red-500/10 text-red-400" : totalStock < 10 ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                                                }`}>
                                                {totalStock} u.
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/products/${p.id}/edit`} className="p-2 text-zinc-500 hover:text-[var(--color-neon)] transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button onClick={() => setDeleteId(p.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Eliminar Producto"
                description="¿Estás seguro de que deseas eliminar este producto? Se eliminarán también todas sus variantes e imágenes. Esta acción no se puede deshacer."
                isLoading={deleting}
            />
        </div>
    );
}
