"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Save, Loader2, Image as ImageIcon, Type, MousePointerClick } from "lucide-react";
import { getContentBlocks, updateContentBlock } from "@/lib/mock/store";

interface ContentBlock {
    id: string;
    key: string;
    content: string;
    type: string;
    updated_at: string;
}

const sectionLabels: Record<string, { label: string; description: string; icon: any }> = {
    hero_title: { label: "Título Hero", description: "Título principal del sitio", icon: Type },
    hero_subtitle: { label: "Subtítulo Hero", description: "Descripción debajo del título principal", icon: Type },
    footer_text: { label: "Texto Footer", description: "Copyright y texto del pie de página", icon: Type },
};

export default function SiteBuilderPage() {
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<ContentBlock>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => { loadBlocks(); }, []);

    async function loadBlocks() {
        const data = await getContentBlocks();
        setBlocks(data || []);
        setLoading(false);
    }

    function startEdit(block: ContentBlock) {
        setEditingId(block.id);
        setEditForm({ ...block });
    }

    async function saveBlock() {
        if (!editingId || !editForm.content) return;
        setSaving(true);
        await updateContentBlock(editingId, editForm.content);
        setBlocks((b) => b.map((x) => x.id === editingId ? { ...x, ...editForm } as ContentBlock : x));
        setEditingId(null);
        setSaving(false);
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
                    <p>No hay bloques de contenido configurados.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {blocks.map((block) => {
                        const config = sectionLabels[block.key] || { label: block.key, description: "Bloque de contenido", icon: Type };
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
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Contenido</label>
                                            <textarea value={editForm.content || ""} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)] resize-none" />
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
                                    <div className="px-4 py-3 text-sm text-zinc-400">
                                        <span className="text-[10px] uppercase text-zinc-600 block">Contenido</span>
                                        {block.content || "—"}
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
