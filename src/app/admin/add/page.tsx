
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AddProductPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        sizes: [] as number[],
        colors: [] as string[],
        images: [] as string[]
    });

    // Handlers for form inputs would go here

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // await supabase.from('products').insert([ ... ])

        alert("Product added successfully!");
        setIsLoading(false);
        // redirect to admin dashboard
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/admin" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold tracking-tight mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
                    <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                placeholder="e.g. Air Max 90"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                <option value="Men's Shoes">Men's Shoes</option>
                                <option value="Women's Shoes">Women's Shoes</option>
                                <option value="Basketball">Basketball</option>
                                <option value="Running">Running</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            placeholder="Product description..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
                    <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-4">Media</h2>
                    <ImageUpload onImagesSelected={(files) => {
                        // In a real app, you'd upload these to Supabase Storage here or store them in state to upload on submit
                        console.log("Images selected:", files);
                        // For now, we just simulate adding them to formData URLs (mock)
                        const newImages = files.map(f => URL.createObjectURL(f));
                        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
                    }} />
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-6">
                    <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-800 pb-4">Variants</h2>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {[7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12].map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => {
                                        const sizes = formData.sizes.includes(size)
                                            ? formData.sizes.filter(s => s !== size)
                                            : [...formData.sizes, size];
                                        setFormData({ ...formData, sizes });
                                    }}
                                    className={`px-3 py-1 rounded border text-sm transition-colors ${formData.sizes.includes(size) ? "bg-black text-white border-black dark:bg-white dark:text-black" : "border-gray-200"}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href="/admin">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
