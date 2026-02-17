"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import ImageUpload from "@/components/admin/ImageUpload";
import { Plus, X } from "lucide-react";

interface Variant {
    id?: string;
    size: string;
    color: string;
    stock_quantity: number;
    sku: string;
}

interface ProductFormProps {
    productId?: string; // If provided, it's edit mode
}

export default function ProductForm({ productId }: ProductFormProps) {
    const supabase = createSupabaseBrowserClient();
    const router = useRouter();
    const isEdit = !!productId;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("info");
    const [brands, setBrands] = useState<any[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        sale_price: "",
        category: "",
        brand_id: "",
        is_featured: false,
        is_drop: false,
    });

    const [variants, setVariants] = useState<Variant[]>([
        { size: "", color: "", stock_quantity: 0, sku: "" },
    ]);

    useEffect(() => {
        loadBrands();
        if (isEdit) loadProduct();
    }, []);

    async function loadBrands() {
        const { data } = await (supabase.from("brands") as any).select("id, name").order("name");
        setBrands(data || []);
    }

    async function loadProduct() {
        const { data: product } = await (supabase
            .from("products") as any)
            .select("*, product_variants(*), product_images(url, id, is_main, display_order)")
            .eq("id", productId)
            .single();

        if (product) {
            setForm({
                name: product.name,
                slug: product.slug,
                description: product.description || "",
                price: String(product.price),
                sale_price: product.sale_price ? String(product.sale_price) : "",
                category: product.category,
                brand_id: product.brand_id || "",
                is_featured: product.is_featured,
                is_drop: product.is_drop,
            });
            setVariants(
                product.product_variants?.map((v: any) => ({
                    id: v.id,
                    size: v.size,
                    color: v.color || "",
                    stock_quantity: v.stock_quantity,
                    sku: v.sku || "",
                })) || [{ size: "", color: "", stock_quantity: 0, sku: "" }]
            );
            setImages(
                product.product_images
                    ?.sort((a: any, b: any) => a.display_order - b.display_order)
                    .map((i: any) => i.url) || []
            );
        }
        setLoading(false);
    }

    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    async function handleSave() {
        setSaving(true);
        try {
            const productData = {
                name: form.name,
                slug: form.slug || generateSlug(form.name),
                description: form.description || null,
                price: Number(form.price),
                sale_price: form.sale_price ? Number(form.sale_price) : null,
                category: form.category,
                brand_id: form.brand_id || null,
                is_featured: form.is_featured,
                is_drop: form.is_drop,
            };

            let pid = productId;

            if (isEdit) {
                await (supabase.from("products") as any).update(productData).eq("id", productId);
            } else {
                const { data } = await (supabase.from("products") as any).insert(productData).select("id").single();
                pid = data?.id;
            }

            if (!pid) throw new Error("No product ID");

            // Save variants
            if (isEdit) {
                await (supabase.from("product_variants") as any).delete().eq("product_id", pid);
            }
            const variantRows = variants
                .filter((v) => v.size.trim() !== "")
                .map((v) => ({
                    product_id: pid,
                    size: v.size,
                    color: v.color || null,
                    stock_quantity: v.stock_quantity,
                    sku: v.sku || null,
                }));
            if (variantRows.length > 0) {
                await (supabase.from("product_variants") as any).insert(variantRows);
            }

            // Upload new image files to Supabase Storage
            if (newFiles.length > 0) {
                for (const file of newFiles) {
                    const fileExt = file.name.split(".").pop();
                    const fileName = `${pid}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
                    const { data: uploadData } = await supabase.storage
                        .from("product-images")
                        .upload(fileName, file);

                    if (uploadData) {
                        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
                        await (supabase.from("product_images") as any).insert({
                            product_id: pid,
                            url: urlData.publicUrl,
                            is_main: images.length === 0,
                            display_order: images.length,
                        });
                    }
                }
            }

            router.push("/admin/products");
        } catch (e) {
            console.error("Save error:", e);
            alert("Error al guardar el producto");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>;
    }

    const tabs = [
        { id: "info", label: "Información" },
        { id: "media", label: "Imágenes" },
        { id: "variants", label: "Inventario" },
        { id: "status", label: "Estado" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">
                        {isEdit ? "Editar Producto" : "Nuevo Producto"}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || !form.name || !form.price || !form.category}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-neon)] text-black text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isEdit ? "Guardar Cambios" : "Crear Producto"}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-zinc-950/50 rounded-xl border border-zinc-800 p-6">
                {activeTab === "info" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nombre</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => {
                                        setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) });
                                    }}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                                    placeholder="Ej: Air Jordan 1 High OG"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Slug (URL)</label>
                                <input
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[var(--color-neon)]"
                                    placeholder="air-jordan-1-high-og"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Descripción</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)] resize-none"
                                placeholder="Descripción del producto..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Categoría</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                    <option value="Unisex">Unisex</option>
                                    <option value="Basketball">Basketball</option>
                                    <option value="Running">Running</option>
                                    <option value="Lifestyle">Lifestyle</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Marca</label>
                                <select
                                    value={form.brand_id}
                                    onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                                >
                                    <option value="">Sin marca</option>
                                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Precio (CLP)</label>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                                    placeholder="149990"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 max-w-xs">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Precio Oferta (Opcional)</label>
                            <input
                                type="number"
                                value={form.sale_price}
                                onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                                placeholder="Dejar vacío si no hay oferta"
                            />
                        </div>
                    </div>
                )}

                {activeTab === "media" && (
                    <ImageUpload
                        images={images}
                        onImagesChange={setImages}
                        onFilesSelected={(files) => setNewFiles((prev) => [...prev, ...files])}
                    />
                )}

                {activeTab === "variants" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-medium">Matriz de Inventario</h3>
                            <button
                                type="button"
                                onClick={() => setVariants([...variants, { size: "", color: "", stock_quantity: 0, sku: "" }])}
                                className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Añadir Talla
                            </button>
                        </div>
                        <div className="border border-zinc-800 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Talla</th>
                                        <th className="px-4 py-3 text-left">Color</th>
                                        <th className="px-4 py-3 text-left">Stock</th>
                                        <th className="px-4 py-3 text-left">SKU</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {variants.map((v, i) => (
                                        <tr key={i} className="hover:bg-zinc-900/30">
                                            <td className="p-2">
                                                <input
                                                    value={v.size}
                                                    onChange={(e) => { const nv = [...variants]; nv[i].size = e.target.value; setVariants(nv); }}
                                                    className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                                                    placeholder="42"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    value={v.color}
                                                    onChange={(e) => { const nv = [...variants]; nv[i].color = e.target.value; setVariants(nv); }}
                                                    className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                                                    placeholder="Negro/Rojo"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    value={v.stock_quantity}
                                                    onChange={(e) => { const nv = [...variants]; nv[i].stock_quantity = Number(e.target.value); setVariants(nv); }}
                                                    className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-white text-sm focus:outline-none focus:border-[var(--color-neon)]"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    value={v.sku}
                                                    onChange={(e) => { const nv = [...variants]; nv[i].sku = e.target.value; setVariants(nv); }}
                                                    className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-white text-sm font-mono focus:outline-none focus:border-[var(--color-neon)]"
                                                    placeholder="SKU-001"
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                {variants.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setVariants(variants.filter((_, j) => j !== i))}
                                                        className="text-zinc-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "status" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
                            <div>
                                <p className="text-white font-medium">Producto Destacado</p>
                                <p className="text-sm text-zinc-500">Aparecerá en la sección &ldquo;Trending Now&rdquo; del home.</p>
                            </div>
                            <button
                                onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${form.is_featured ? "bg-[var(--color-neon)]" : "bg-zinc-700"}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.is_featured ? "translate-x-6" : ""}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
                            <div>
                                <p className="text-white font-medium">Es un Drop (Lanzamiento)</p>
                                <p className="text-sm text-zinc-500">Se destacará con la etiqueta &ldquo;DROP&rdquo; y badge especial.</p>
                            </div>
                            <button
                                onClick={() => setForm({ ...form, is_drop: !form.is_drop })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${form.is_drop ? "bg-purple-500" : "bg-zinc-700"}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${form.is_drop ? "translate-x-6" : ""}`} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
