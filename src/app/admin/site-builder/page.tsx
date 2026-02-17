"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Save, Loader2, Image as ImageIcon, Type, MousePointerClick } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface ContentBlock {
    id: string;
    section_name: string;
    title: string | null;
    subtitle: string | null;
    button_text: string | null;
    button_link: string | null;
    image_url: string | null;
    is_active: boolean;
}

const sectionLabels: Record<string, { label: string; description: string; icon: any }> = {
    hero_home: { label: "Hero Principal", description: "Sección principal del home con imagen y texto", icon: ImageIcon },
    marquee_top: { label: "Marquee Superior", description: "Barra de texto animado debajo del hero", icon: Type },
    banner_promo: { label: "Banner Promocional", description: "Banner de promoción o colección especial", icon: MousePointerClick },
    newsletter_home: { label: "Newsletter", description: "Sección de suscripción al boletín", icon: Type },
};

export default function SiteBuilderPage() {
    const supabase = createSupabaseBrowserClient();
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<ContentBlock>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadBlocks(); }, []);

    async function loadBlocks() {
        const { data } = await (supabase.from("content_blocks") as any).select("*").order("section_name");
        setBlocks(data || []);
        setLoading(false);
    }

    function startEdit(block: ContentBlock) {
        setEditingId(block.id);
        setEditForm({ ...block });
    }

    async function saveBlock() {
        if (!editingId) return;
        setSaving(true);
        await (supabase.from("content_blocks") as any).update({
            title: editForm.title,
            subtitle: editForm.subtitle,
            button_text: editForm.button_text,
            button_link: editForm.button_link,
            image_url: editForm.image_url,
            is_active: editForm.is_active,
        }).eq("id", editingId);

        setBlocks((b) => b.map((x) => x.id === editingId ? { ...x, ...editForm } as ContentBlock : x));
        setEditingId(null);
        setSaving(false);
    }

    async function toggleActive(block: ContentBlock) {
        const newActive = !block.is_active;
        await (supabase.from("content_blocks") as any).update({ is_active: newActive }).eq("id", block.id);
        setBlocks((b) => b.map((x) => x.id === block.id ? { ...x, is_active: newActive } : x));
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-white">Editor Web</h1>
                <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-32 rounded-xl border border-zinc-800 animate-pulse bg-zinc-900" />)}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Editor Web</h1>
                <p className="text-zinc-500 text-sm mt-1">Edita las secciones del sitio sin tocar código</p>
            </div>

            {blocks.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">
                    <p>No hay bloques de contenido. Necesitas insertar registros en la tabla <code className="text-[var(--color-neon)]">content_blocks</code>.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {blocks.map((block) => {
                        const config = sectionLabels[block.section_name] || { label: block.section_name, description: "Bloque de contenido", icon: Type };
                        const Icon = config.icon;
                        const isEditing = editingId === block.id;

                        return (
                            <div key={block.id} className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-zinc-800">
                                            <Icon className="w-4 h-4 text-[var(--color-neon)]" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold">{config.label}</h3>
                                            <p className="text-xs text-zinc-500">{config.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleActive(block)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${block.is_active ? "bg-green-500/10 text-green-400" : "bg-zinc-800 text-zinc-500"
                                                }`}
                                        >
                                            {block.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {block.is_active ? "Activo" : "Inactivo"}
                                        </button>
                                        {!isEditing && (
                                            <button onClick={() => startEdit(block)} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors">
                                                Editar
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Edit Form or Preview */}
                                {isEditing ? (
                                    <div className="p-4 space-y-4 bg-zinc-900/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Título</label>
                                                <input value={editForm.title || ""} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Subtítulo</label>
                                                <input value={editForm.subtitle || ""} onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Texto del Botón</label>
                                                <input value={editForm.button_text || ""} onChange={(e) => setEditForm({ ...editForm, button_text: e.target.value })}
                                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Link del Botón</label>
                                                <input value={editForm.button_link || ""} onChange={(e) => setEditForm({ ...editForm, button_link: e.target.value })}
                                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">URL de Imagen</label>
                                            <input value={editForm.image_url || ""} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-zinc-400 bg-zinc-800 rounded-lg hover:text-white">Cancelar</button>
                                            <button onClick={saveBlock} disabled={saving}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black bg-[var(--color-neon)] rounded-lg disabled:opacity-50">
                                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-4 py-3 text-sm text-zinc-400 grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div><span className="text-[10px] uppercase text-zinc-600 block">Título</span>{block.title || "—"}</div>
                                        <div><span className="text-[10px] uppercase text-zinc-600 block">Subtítulo</span>{block.subtitle || "—"}</div>
                                        <div><span className="text-[10px] uppercase text-zinc-600 block">Botón</span>{block.button_text || "—"}</div>
                                        <div><span className="text-[10px] uppercase text-zinc-600 block">Imagen</span>{block.image_url ? "✓ Configurada" : "—"}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
