"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/ui/CartDrawer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">{children}</main>
            <Footer />
        </>
    );
}
