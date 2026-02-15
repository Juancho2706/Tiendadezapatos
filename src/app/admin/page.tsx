"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import {
    DollarSign,
    Users,
    CreditCard,
    Activity
} from "lucide-react";

const data = [
    { name: "Lun", total: 120000 },
    { name: "Mar", total: 240000 },
    { name: "Mié", total: 180000 },
    { name: "Jue", total: 320000 },
    { name: "Vie", total: 450000 },
    { name: "Sáb", total: 580000 },
    { name: "Dom", total: 390000 },
];

const recentSales = [
    { name: "Juan Pérez", email: "juan@example.com", amount: "+$129.990", avatar: "JP" },
    { name: "Sofia Silva", email: "sofia@example.com", amount: "+$89.990", avatar: "SS" },
    { name: "Carlos Ruiz", email: "carlos@example.com", amount: "+$210.000", avatar: "CR" },
    { name: "Ana Gomez", email: "ana@example.com", amount: "+$150.000", avatar: "AG" },
    { name: "Pedro Diaz", email: "pedro@example.com", amount: "+$99.990", avatar: "PD" },
];

export default function OverviewPage() {
    return (
        <div className="space-y-8">
            {/* Title */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card title="Ingresos Totales" value="$2.450.900" icon={DollarSign} subtext="+20.1% desde el mes pasado" />
                <Card title="Ventas" value="+27" icon={CreditCard} subtext="+15% desde el mes pasado" />
                <Card title="Pedidos Activos" value="12" icon={Activity} subtext="+4 nuevos en la última hora" />
                <Card title="Productos sin Stock" value="3" icon={Activity} subtext="Requiere atención inmediata" isWarning />
            </div>

            {/* Charts & Recent Sales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Main Chart */}
                <div className="col-span-4 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                    <h3 className="font-semibold text-lg mb-4 text-white">Resumen de Ingresos</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a" }}
                                    itemStyle={{ color: "#fff" }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="var(--color-neon)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Sales */}
                <div className="col-span-3 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                    <h3 className="font-semibold text-lg mb-4 text-white">Ventas Recientes</h3>
                    <div className="space-y-6">
                        {recentSales.map((sale, i) => (
                            <div key={i} className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white mr-4">
                                    {sale.avatar}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none text-white">{sale.name}</p>
                                    <p className="text-xs text-zinc-400">{sale.email}</p>
                                </div>
                                <div className="ml-auto font-medium text-white">{sale.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function Card({ title, value, icon: Icon, subtext, isWarning }: any) {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-zinc-400">{title}</h3>
                <Icon className={`h-4 w-4 ${isWarning ? 'text-red-500' : 'text-zinc-400'}`} />
            </div>
            <div className="pt-2">
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className="text-xs text-zinc-500 mt-1">{subtext}</p>
            </div>
        </div>
    );
}
