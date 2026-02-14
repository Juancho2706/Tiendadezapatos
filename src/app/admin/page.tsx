
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Package } from "lucide-react";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import InventoryTable from "@/components/admin/InventoryTable";

// Mock Data
const initialProducts = [
    { id: "1", name: "Air Max Pulse", sku: "AMP-001", stock: 45, price: 150000, category: "Men's Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" },
    { id: "2", name: "Zoom Freak 4", sku: "ZF4-002", stock: 8, price: 130000, category: "Basketball Shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" },
];

export default function AdminDashboard() {
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleEdit = (id: string) => {
        console.log("Edit product", id);
        // Navigate to edit page or open modal
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-500 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your store's inventory.</p>
                    </div>

                    <Link href="/admin/add">
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-5 h-5" /> Add New Product
                        </Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden p-6">
                    <InventoryTable
                        products={products}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
}
