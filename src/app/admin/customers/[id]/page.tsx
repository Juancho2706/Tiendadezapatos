"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, User, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCLP } from "@/lib/utils";



export default function CustomerDetailPage() {
    const supabase = createSupabaseBrowserClient();
    const params = useParams();
    const [customer, setCustomer] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadCustomer(); }, []);

    async function loadCustomer() {
        const { data: profile } = await (supabase.from("profiles") as any).select("*").eq("id", params.id).single();
        setCustomer(profile);

        const { data: customerOrders } = await (supabase
            .from("orders") as any)
            .select("id, total_amount, status, created_at")
            .eq("user_id", params.id)
            .order("created_at", { ascending: false });
        setOrders(customerOrders || []);
        setLoading(false);
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>;
    }

    if (!customer) {
        return <div className="text-center py-20 text-zinc-500">Cliente no encontrado</div>;
    }

    const address = customer.shipping_address || {};
    const totalSpent = orders.reduce((s, o) => s + Number(o.total_amount), 0);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/customers" className="p-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-white">{customer.full_name || "Cliente"}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-white mx-auto">
                        {(customer.full_name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold text-lg">{customer.full_name || "Sin nombre"}</p>
                        <p className="text-xs text-zinc-500">Registrado: {new Date(customer.created_at).toLocaleDateString("es-CL")}</p>
                    </div>
                    <div className="border-t border-zinc-800 pt-4 space-y-2">
                        {customer.phone && <p className="text-sm text-zinc-400 flex items-center gap-2"><Phone className="w-3 h-3" /> {customer.phone}</p>}
                        {address.line1 && (
                            <div className="text-sm text-zinc-400 flex items-start gap-2">
                                <MapPin className="w-3 h-3 mt-0.5" />
                                <div>{address.line1}, {address.city}, {address.state}</div>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-zinc-800 pt-4 grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-xl font-bold text-white">{orders.length}</p>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Pedidos</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white">{formatCLP(totalSpent)}</p>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Gastado</p>
                        </div>
                    </div>
                </div>

                {/* Orders History */}
                <div className="md:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Historial de Pedidos</h3>
                    {orders.length === 0 ? (
                        <p className="text-zinc-500 text-sm text-center py-8">No tiene pedidos</p>
                    ) : (
                        <div className="divide-y divide-zinc-800">
                            {orders.map((order) => (
                                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between py-3 hover:bg-zinc-900/30 px-3 rounded-lg transition-colors -mx-3">
                                    <div>
                                        <p className="text-white text-sm font-mono">#{order.id.slice(0, 8)}</p>
                                        <p className="text-zinc-500 text-xs">{new Date(order.created_at).toLocaleDateString("es-CL")}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={order.status} />
                                        <span className="text-white font-bold text-sm">{formatCLP(Number(order.total_amount))}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
