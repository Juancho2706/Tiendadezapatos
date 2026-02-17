"use client";

import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    subtext: string;
    isWarning?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, subtext, isWarning }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-zinc-400 tracking-tight">{title}</h3>
                <div className={`p-2 rounded-lg ${isWarning ? "bg-red-500/10" : "bg-[var(--color-neon)]/10"}`}>
                    <Icon className={`h-4 w-4 ${isWarning ? "text-red-500" : "text-[var(--color-neon)]"}`} />
                </div>
            </div>
            <div className="pt-1">
                <div className="text-2xl font-bold text-white">{value}</div>
                <p className={`text-xs mt-1 ${isWarning ? "text-red-400" : "text-zinc-500"}`}>{subtext}</p>
            </div>
        </div>
    );
}
