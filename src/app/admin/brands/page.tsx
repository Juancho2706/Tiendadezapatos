"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Loader2, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Image from "next/image";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function BrandsPage() {
    const supabase = createSupabaseBrowserClient();
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editBrand, setEditBrand] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState({ name: "", slug: "", logo_url: "" });

    useEffect(() => { loadBrands(); }, []);

    async function loadBrands() {
        const { data } = await supabase.from("brands").select("*, products(id)").order("name");
        setBrands(data || []);
        setLoading(false);
    }

    function openCreate() {
        setEditBrand(null);
        setForm({ name: "", slug: "", logo_url: "" });
        setModalOpen(true);
    }

    function openEdit(brand: any) {
        setEditBrand(brand);
        setForm({ name: brand.name, slug: brand.slug, logo_url: brand.logo_url || "" });
        setModalOpen(true);
    }

    function generateSlug(name: string) {
        return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    async function handleSave() {
        setSaving(true);
        const data: any = { name: form.name, slug: form.slug || generateSlug(form.name), logo_url: form.logo_url || null };
        if (editBrand) {
            await (supabase.from("brands") as any).update(data).eq("id", editBrand.id);
        } else {
            await (supabase.from("brands") as any).insert(data);
        }
        setModalOpen(false);
        setSaving(false);
        loadBrands();
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        await supabase.from("brands").delete().eq("id", deleteId);
        setBrands((b) => b.filter((x) => x.id !== deleteId));
        setDeleteId(null);
        setDeleting(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Marcas</h1>
                <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-neon)] text-black text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                    <Plus className="w-4 h-4" /> Agregar Marca
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-xl border border-zinc-800 animate-pulse bg-zinc-900" />)}
                </div>
            ) : brands.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">No hay marcas registradas. Agrega la primera.</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {brands.map((brand) => (
                        <div key={brand.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 group hover:border-zinc-700 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                {brand.logo_url ? (
                                    <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-zinc-800">
                                        <Image src={brand.logo_url} alt={brand.name} fill className="object-contain p-1" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                                        {brand.name.slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(brand)} className="p-1.5 text-zinc-500 hover:text-[var(--color-neon)] transition-colors">
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setDeleteId(brand.id)} className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-white">{brand.name}</h3>
                            <p className="text-xs text-zinc-500 font-mono mt-0.5">/{brand.slug}</p>
                            <p className="text-xs text-zinc-500 mt-2">{brand.products?.length || 0} productos</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
                    <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg">{editBrand ? "Editar Marca" : "Nueva Marca"}</h3>
                            <button onClick={() => setModalOpen(false)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nombre</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" placeholder="Nike" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Slug</label>
                                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[var(--color-neon)]" placeholder="nike" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Logo URL (Opcional)</label>
                                <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" placeholder="https://..." />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-zinc-400 bg-zinc-800 rounded-lg hover:text-white transition-colors">Cancelar</button>
                            <button onClick={handleSave} disabled={saving || !form.name} className="px-4 py-2 text-sm font-bold text-black bg-[var(--color-neon)] rounded-lg disabled:opacity-50">
                                {saving ? "Guardando..." : editBrand ? "Guardar" : "Crear Marca"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
                title="Eliminar Marca" description="¿Estás seguro? Los productos quedarán sin marca asignada." isLoading={deleting} />
        </div>
    );
}
