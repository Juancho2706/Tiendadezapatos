"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MapPin, Phone, CreditCard, Package } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import StatusBadge from "@/components/admin/StatusBadge";

const formatCLP = (n: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);
const statusFlow = ["pending", "paid", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
    const supabase = createSupabaseBrowserClient();
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => { loadOrder(); }, []);

    async function loadOrder() {
        const { data } = await (supabase
            .from("orders") as any)
            .select("*, order_items(*, product_variants(*, products(name, product_images(url, is_main))))")
            .eq("id", params.id)
            .single();

        if (data) {
            setOrder(data);
            setItems(data.order_items || []);
            if (data.user_id) {
                const { data: profile } = await (supabase.from("profiles") as any).select("*").eq("id", data.user_id).single();
                setCustomer(profile);
            }
        }
        setLoading(false);
    }

    async function updateStatus(newStatus: string) {
        setUpdating(true);
        await (supabase.from("orders") as any).update({ status: newStatus }).eq("id", params.id);
        setOrder({ ...order, status: newStatus });
        setUpdating(false);
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>;
    }

    if (!order) {
        return <div className="text-center text-zinc-500 py-20">Pedido no encontrado</div>;
    }

    const shipping = order.shipping_details || {};

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Pedido #{order.id.slice(0, 8)}</h1>
                        <p className="text-xs text-zinc-500">{new Date(order.created_at).toLocaleString("es-CL")}</p>
                    </div>
                </div>
                <StatusBadge status={order.status} size="md" />
            </div>

            {/* Status Change */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">Cambiar Estado</h3>
                <div className="flex flex-wrap gap-2">
                    {[...statusFlow, "cancelled"].map((s) => (
                        <button key={s} onClick={() => updateStatus(s)} disabled={updating || order.status === s}
                            className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg border transition-all ${order.status === s ? "border-[var(--color-neon)] bg-[var(--color-neon)]/10 text-[var(--color-neon)]" : s === "cancelled" ? "border-zinc-800 text-red-500 hover:bg-red-500/10" : "border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600"
                                } disabled:opacity-50`}>
                            {s === "pending" ? "Pendiente" : s === "paid" ? "Pagado" : s === "processing" ? "En Proceso" : s === "shipped" ? "Enviado" : s === "delivered" ? "Entregado" : "Cancelar"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"><Package className="w-4 h-4" /> Productos</h3>
                    <div className="divide-y divide-zinc-800">
                        {items.map((item, i) => {
                            const variant = item.product_variants;
                            const product = variant?.products;
                            const img = product?.product_images?.find((i: any) => i.is_main)?.url || product?.product_images?.[0]?.url;
                            return (
                                <div key={i} className="flex items-center gap-4 py-4">
                                    <div className="w-14 h-14 rounded-lg bg-zinc-800 overflow-hidden relative flex-shrink-0">
                                        {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-sm truncate">{product?.name || "Producto"}</p>
                                        <p className="text-zinc-500 text-xs">Talla: {variant?.size} {variant?.color && `— ${variant.color}`}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white text-sm font-bold">{formatCLP(Number(item.unit_price) * item.quantity)}</p>
                                        <p className="text-zinc-500 text-xs">{item.quantity} × {formatCLP(Number(item.unit_price))}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="border-t border-zinc-800 pt-4 flex justify-between">
                        <span className="font-bold text-white">Total</span>
                        <span className="font-bold text-white text-lg">{formatCLP(Number(order.total_amount))}</span>
                    </div>
                </div>

                {/* Customer + Shipping */}
                <div className="space-y-6">
                    {customer && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Cliente</h3>
                            <p className="text-white font-medium">{customer.full_name || "Sin nombre"}</p>
                            {customer.phone && <p className="text-zinc-400 text-sm flex items-center gap-2"><Phone className="w-3 h-3" /> {customer.phone}</p>}
                            <Link href={`/admin/customers/${customer.id}`} className="text-xs text-[var(--color-neon)] hover:underline">Ver perfil completo →</Link>
                        </div>
                    )}

                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Dirección de Envío</h3>
                        {shipping.line1 ? (
                            <div className="text-sm text-zinc-400 space-y-1">
                                <p>{shipping.line1}</p>
                                {shipping.line2 && <p>{shipping.line2}</p>}
                                <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
                                <p>{shipping.country}</p>
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm">Sin información de envío</p>
                        )}
                    </div>

                    {order.payment_id && (
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Pago</h3>
                            <p className="text-zinc-400 text-xs font-mono">{order.payment_id}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
