"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Store,
    Image as ImageIcon
} from "lucide-react";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/products", icon: Package },
    { name: "Inventario", href: "/admin/inventory", icon: Store },
    { name: "Pedidos", href: "/admin/orders", icon: ShoppingBag },
    { name: "Clientes", href: "/admin/customers", icon: Users },
    { name: "Editor Web", href: "/admin/site-builder", icon: ImageIcon },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950 hidden md:flex flex-col fixed h-full z-50">
                <div className="h-16 flex items-center px-6 border-b border-zinc-800">
                    <Link href="/admin" className="font-display font-black text-xl tracking-tighter text-white">
                        SNEAKER<span className="text-[var(--color-neon)]">CMS</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? "bg-[var(--color-neon)]/10 text-[var(--color-neon)]"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span className="font-medium text-white">Admin</span>
                        <span>/</span>
                        <span className="capitalize">{pathname.split("/").pop() || "Dashboard"}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                            AD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
