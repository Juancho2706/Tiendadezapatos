"use client";

const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Pendiente", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    paid: { label: "Pagado", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    processing: { label: "En Proceso", className: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
    shipped: { label: "Enviado", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    delivered: { label: "Entregado", className: "bg-green-500/10 text-green-500 border-green-500/20" },
    cancelled: { label: "Cancelado", className: "bg-red-500/10 text-red-500 border-red-500/20" },
};

interface StatusBadgeProps {
    status: string;
    size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
    const config = statusConfig[status] || { label: status, className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${config.className} ${size === "sm" ? "text-[10px]" : "text-xs"
                }`}
        >
            {config.label}
        </span>
    );
}
