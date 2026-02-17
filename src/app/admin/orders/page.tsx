"use client";

import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCLP } from "@/lib/utils";


const statuses = ["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];
const statusLabels: Record<string, string> = { all: "Todos", pending: "Pendiente", paid: "Pagado", processing: "En Proceso", shipped: "Enviado", delivered: "Entregado", cancelled: "Cancelado" };

export default function OrdersPage() {
    const supabase = createSupabaseBrowserClient();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    useEffect(() => { loadOrders(); }, []);

    async function loadOrders() {
        const { data } = await (supabase
            .from("orders") as any)
            .select("*, order_items(quantity, unit_price)")
            .order("created_at", { ascending: false });

        if (data) {
            const withProfiles = await Promise.all(
                data.map(async (order: any) => {
                    let customerName = "Invitado";
                    let customerEmail = "";

                    if (order.user_id) {
                        const { data: profile } = await (supabase.from("profiles") as any).select("full_name").eq("id", order.user_id).single();
                        customerName = profile?.full_name || "Cliente";
                    } else if (order.shipping_details) {
                        // Handle guest checkout names
                        const { firstName, lastName, full_name } = order.shipping_details;
                        if (full_name) customerName = full_name;
                        else if (firstName && lastName) customerName = `${firstName} ${lastName}`;
                    }

                    return { ...order, customerName, customerEmail };
                })
            );
            setOrders(withProfiles);
        }
        setLoading(false);
    }

    const filtered = orders.filter((o: any) => {
        const matchStatus = filter === "all" || o.status === filter;
        const matchSearch = o.customerName?.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
        return matchStatus && matchSearch;
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Pedidos</h1>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap">
                {statuses.map((s) => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border transition-colors ${filter === s ? "border-[var(--color-neon)] text-[var(--color-neon)] bg-[var(--color-neon)]/10" : "border-zinc-800 text-zinc-500 hover:text-white"
                            }`}>
                        {statusLabels[s]}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input type="text" placeholder="Buscar por cliente o # pedido..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
            </div>

            {/* Table */}
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-left"># Pedido</th>
                            <th className="px-4 py-3 text-left hidden sm:table-cell">Cliente</th>
                            <th className="px-4 py-3 text-center">Estado</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3 text-right hidden md:table-cell">Fecha</th>
                            <th className="px-4 py-3 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-8 bg-zinc-900 rounded animate-pulse" /></td></tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500">No se encontraron pedidos</td></tr>
                        ) : (
                            filtered.map((order: any) => (
                                <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-zinc-400">#{order.id.slice(0, 8)}</td>
                                    <td className="px-4 py-3 text-white hidden sm:table-cell">{order.customerName}</td>
                                    <td className="px-4 py-3 text-center"><StatusBadge status={order.status} /></td>
                                    <td className="px-4 py-3 text-right font-bold text-white">{formatCLP(Number(order.total_amount))}</td>
                                    <td className="px-4 py-3 text-right text-zinc-500 text-xs hidden md:table-cell">
                                        {new Date(order.created_at).toLocaleDateString("es-CL")}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={`/admin/orders/${order.id}`} className="p-2 inline-flex text-zinc-500 hover:text-[var(--color-neon)] transition-colors">
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
