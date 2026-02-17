"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Store,
    Image as ImageIcon,
    Tags,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Productos", href: "/admin/products", icon: Package },
    { name: "Marcas", href: "/admin/brands", icon: Tags },
    { name: "Inventario", href: "/admin/inventory", icon: Store },
    { name: "Pedidos", href: "/admin/orders", icon: ShoppingBag },
    { name: "Clientes", href: "/admin/customers", icon: Users },
    { name: "Editor Web", href: "/admin/site-builder", icon: ImageIcon },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseBrowserClient();
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Don't show sidebar on login page
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    const NavContent = () => (
        <>
            <div className="h-16 flex items-center px-6 border-b border-zinc-800">
                <Link href="/admin" className="font-display font-black text-xl tracking-tighter text-white">
                    SNEAKER<span className="text-[var(--color-neon)]">CMS</span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
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

            <div className="p-4 border-t border-zinc-800 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                >
                    <Store className="w-4 h-4" />
                    Ver Tienda
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950 hidden md:flex flex-col fixed h-full z-50">
                <NavContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
                        <NavContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden p-2 text-zinc-400 hover:text-white"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <span className="font-medium text-white">Admin</span>
                            <span>/</span>
                            <span className="capitalize">{pathname.split("/").filter(Boolean).pop() || "Dashboard"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-neon)]/10 border border-[var(--color-neon)]/30 flex items-center justify-center text-xs font-bold text-[var(--color-neon)]">
                            AD
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 md:p-8 flex-1">{children}</div>
            </main>
        </div>
    );
}
