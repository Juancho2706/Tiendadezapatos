"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, CreditCard, Activity, AlertTriangle, ArrowUpRight } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrders } from "@/lib/mock/store";
import { getProducts } from "@/lib/mock/store";
import Link from "next/link";
import { formatCLP } from "@/lib/utils";

export default function DashboardPage() {
    const [stats, setStats] = useState({ revenue: 0, sales: 0, activePedidos: 0, outOfStock: 0 });
    const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    async function loadDashboard() {
        try {
            const orders = await getOrders();
            const products = await getProducts();

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            // KPI: Revenue + Sales count this month
            const monthOrders = orders.filter((o: any) =>
                o.created_at >= startOfMonth &&
                ["paid", "processing", "shipped", "delivered"].includes(o.status)
            );
            const revenue = monthOrders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0);
            const salesCount = monthOrders.length;

            // KPI: Active orders
            const activePedidos = orders.filter((o: any) => ["pending", "processing"].includes(o.status)).length;

            // KPI: Out of stock variants
            let outOfStock = 0;
            products.forEach((p: any) => {
                p.variants?.forEach((v: any) => {
                    if (v.stock_quantity === 0) outOfStock++;
                });
            });

            setStats({
                revenue,
                sales: salesCount,
                activePedidos,
                outOfStock,
            });

            // Chart: Last 7 days revenue
            const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            const last7 = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d;
            });

            const weekOrders = orders.filter((o: any) => {
                const od = new Date(o.created_at);
                return od >= last7[0];
            });

            const chart = last7.map((d: any) => {
                const dayOrders = weekOrders.filter((o: any) => {
                    const od = new Date(o.created_at);
                    return od.toDateString() === d.toDateString();
                });
                return { name: days[d.getDay()], total: dayOrders.reduce((s: number, o: any) => s + Number(o.total_amount), 0) };
            });
            setChartData(chart);

            // Recent orders
            const recent = orders.slice(0, 5);
            const withProfiles = recent.map((order: any) => {
                let customerName = "Invitado";
                if (order.shipping_details) {
                    const { firstName, lastName, full_name } = order.shipping_details;
                    if (full_name) customerName = full_name;
                    else if (firstName && lastName) customerName = `${firstName} ${lastName}`;
                    else if (firstName) customerName = firstName;
                }
                return { ...order, customerName };
            });
            setRecentOrders(withProfiles);
        } catch (e) {
            console.error("Dashboard load error:", e);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 rounded-xl border border-zinc-800 bg-zinc-950 animate-pulse" />
                    ))}
                </div>
                <div className="h-[400px] rounded-xl border border-zinc-800 bg-zinc-950 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Ingresos del Mes" value={formatCLP(stats.revenue)} icon={DollarSign} subtext="Total del mes actual" />
                <StatsCard title="Ventas" value={`+${stats.sales}`} icon={CreditCard} subtext="Pedidos completados este mes" />
                <StatsCard title="Pedidos Activos" value={String(stats.activePedidos)} icon={Activity} subtext="Pendientes y en proceso" />
                <StatsCard title="Sin Stock" value={String(stats.outOfStock)} icon={AlertTriangle} subtext="Variantes agotadas" isWarning={stats.outOfStock > 0} />
            </div>

            {/* Charts + Recent Orders */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart */}
                <div className="col-span-4 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                    <h3 className="font-semibold text-lg mb-4 text-white">Ingresos — Últimos 7 Días</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: 8 }}
                                    itemStyle={{ color: "#fff" }}
                                    formatter={(value: number | undefined) => [formatCLP(value ?? 0), "Total"]}
                                    cursor={{ fill: "transparent" }}
                                />
                                <Bar dataKey="total" fill="var(--color-neon)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="col-span-3 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-white">Pedidos Recientes</h3>
                        <Link href="/admin/orders" className="text-xs text-[var(--color-neon)] hover:underline flex items-center gap-1">
                            Ver todos <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <p className="text-zinc-500 text-sm text-center py-8">No hay pedidos aún</p>
                        ) : (
                            recentOrders.map((order: any) => (
                                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 transition-colors">
                                    <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                                        {order.customerName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{order.customerName}</p>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <span className="font-bold text-white text-sm">{formatCLP(Number(order.total_amount))}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
