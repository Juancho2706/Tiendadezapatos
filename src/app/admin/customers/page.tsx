"use client";

import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

const formatCLP = (n: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);

export default function CustomersPage() {
    const supabase = createSupabaseBrowserClient();
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => { loadCustomers(); }, []);

    async function loadCustomers() {
        const { data: profiles } = await (supabase.from("profiles") as any).select("*").eq("role", "customer").order("created_at", { ascending: false });

        if (profiles) {
            const withStats = await Promise.all(
                profiles.map(async (p: any) => {
                    const { data: orders } = await (supabase.from("orders") as any).select("total_amount").eq("user_id", p.id);
                    const totalOrders = orders?.length || 0;
                    const totalSpent = orders?.reduce((s: any, o: any) => s + Number(o.total_amount), 0) || 0;
                    return { ...p, totalOrders, totalSpent };
                })
            );
            setCustomers(withStats);
        }
        setLoading(false);
    }

    const filtered = customers.filter((c: any) =>
        c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search)
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Clientes</h1>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="text" placeholder="Buscar por nombre o teléfono..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
            </div>

            <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left">Cliente</th>
                            <th className="px-4 py-3 text-left hidden sm:table-cell">Teléfono</th>
                            <th className="px-4 py-3 text-center">Pedidos</th>
                            <th className="px-4 py-3 text-right">Total Gastado</th>
                            <th className="px-4 py-3 text-right hidden md:table-cell">Registro</th>
                            <th className="px-4 py-3 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-8 bg-zinc-900 rounded animate-pulse" /></td></tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500">No se encontraron clientes</td></tr>
                        ) : (
                            filtered.map((c: any) => (
                                <tr key={c.id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
                                                {(c.full_name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                            </div>
                                            <span className="text-white font-medium">{c.full_name || "Sin nombre"}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">{c.phone || "—"}</td>
                                    <td className="px-4 py-3 text-center text-white font-bold">{c.totalOrders}</td>
                                    <td className="px-4 py-3 text-right text-white font-medium">{formatCLP(c.totalSpent)}</td>
                                    <td className="px-4 py-3 text-right text-zinc-500 text-xs hidden md:table-cell">
                                        {new Date(c.created_at).toLocaleDateString("es-CL")}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={`/admin/customers/${c.id}`} className="p-2 inline-flex text-zinc-500 hover:text-[var(--color-neon)] transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
