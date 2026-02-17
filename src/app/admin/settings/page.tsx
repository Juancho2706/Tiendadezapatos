"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Store, Truck, Shield } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SettingsTab = "store" | "shipping" | "account";

export default function SettingsPage() {
    const supabase = createSupabaseBrowserClient();
    const [activeTab, setActiveTab] = useState<SettingsTab>("store");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Store settings
    const [storeConfig, setStoreConfig] = useState({
        store_name: "SneakHub",
        email: "",
        phone: "",
        address: "",
        instagram: "",
        tiktok: "",
        facebook: "",
    });

    // Shipping settings
    const [shippingConfig, setShippingConfig] = useState({
        free_threshold: "50000",
        standard_cost: "4990",
        zones: "Santiago, Valparaíso, Concepción",
    });

    // Account
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => { loadSettings(); }, []);

    async function loadSettings() {
        // Load store config from content_blocks
        const { data } = await (supabase.from("content_blocks") as any).select("*").eq("section_name", "store_config").single();
        if (data) {
            try {
                const config = typeof data.title === "string" ? JSON.parse(data.title) : {};
                setStoreConfig({ ...storeConfig, ...config });
            } catch { /* ignore parse errors */ }
            try {
                const shipping = typeof data.subtitle === "string" ? JSON.parse(data.subtitle) : {};
                setShippingConfig({ ...shippingConfig, ...shipping });
            } catch { /* ignore */ }
        }

        // Load user email
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserEmail(user.email || "");
    }

    async function saveStoreSettings() {
        setSaving(true);
        await (supabase.from("content_blocks") as any).upsert({
            section_name: "store_config",
            title: JSON.stringify(storeConfig),
            subtitle: JSON.stringify(shippingConfig),
            is_active: true,
        }, { onConflict: "section_name" });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    async function changePassword() {
        if (newPassword !== confirmPassword) { alert("Las contraseñas no coinciden"); return; }
        if (newPassword.length < 6) { alert("La contraseña debe tener al menos 6 caracteres"); return; }
        setSaving(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) { alert("Error: " + error.message); } else { alert("Contraseña actualizada correctamente"); }
        setNewPassword("");
        setConfirmPassword("");
        setSaving(false);
    }

    const tabs = [
        { id: "store" as SettingsTab, label: "Tienda", icon: Store },
        { id: "shipping" as SettingsTab, label: "Envío", icon: Truck },
        { id: "account" as SettingsTab, label: "Cuenta", icon: Shield },
    ];

    return (
        <div className="space-y-6 max-w-3xl">
            <h1 className="text-3xl font-bold text-white">Configuración</h1>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800 max-w-md">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"
                                }`}>
                            <Icon className="w-4 h-4" /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                {activeTab === "store" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nombre de la Tienda</label>
                                <input value={storeConfig.store_name} onChange={(e) => setStoreConfig({ ...storeConfig, store_name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email de Contacto</label>
                                <input type="email" value={storeConfig.email} onChange={(e) => setStoreConfig({ ...storeConfig, email: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" placeholder="contacto@sneakhub.cl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Teléfono</label>
                                <input value={storeConfig.phone} onChange={(e) => setStoreConfig({ ...storeConfig, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" placeholder="+56 9 XXXX XXXX" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Dirección Física</label>
                                <input value={storeConfig.address} onChange={(e) => setStoreConfig({ ...storeConfig, address: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                            </div>
                        </div>

                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 pt-2">Redes Sociales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 uppercase">Instagram</label>
                                <input value={storeConfig.instagram} onChange={(e) => setStoreConfig({ ...storeConfig, instagram: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" placeholder="@sneakhub.cl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 uppercase">TikTok</label>
                                <input value={storeConfig.tiktok} onChange={(e) => setStoreConfig({ ...storeConfig, tiktok: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" placeholder="@sneakhub" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-zinc-500 uppercase">Facebook</label>
                                <input value={storeConfig.facebook} onChange={(e) => setStoreConfig({ ...storeConfig, facebook: e.target.value })}
                                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                            </div>
                        </div>

                        <button onClick={saveStoreSettings} disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-neon)] text-black text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saved ? "¡Guardado!" : "Guardar"}
                        </button>
                    </div>
                )}

                {activeTab === "shipping" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Umbral de Envío Gratis (CLP)</label>
                                <input type="number" value={shippingConfig.free_threshold} onChange={(e) => setShippingConfig({ ...shippingConfig, free_threshold: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                                <p className="text-xs text-zinc-600">Pedidos sobre este monto tienen envío gratis</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Costo Envío Estándar (CLP)</label>
                                <input type="number" value={shippingConfig.standard_cost} onChange={(e) => setShippingConfig({ ...shippingConfig, standard_cost: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Zonas de Envío</label>
                            <textarea value={shippingConfig.zones} onChange={(e) => setShippingConfig({ ...shippingConfig, zones: e.target.value })} rows={3}
                                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)] resize-none" placeholder="Separar por comas" />
                        </div>
                        <button onClick={saveStoreSettings} disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-neon)] text-black text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saved ? "¡Guardado!" : "Guardar"}
                        </button>
                    </div>
                )}

                {activeTab === "account" && (
                    <div className="space-y-6">
                        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Email Actual</p>
                            <p className="text-white font-medium">{userEmail || "—"}</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-white font-bold">Cambiar Contraseña</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Nueva Contraseña</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" placeholder="••••••••" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Confirmar Contraseña</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-neon)]" placeholder="••••••••" />
                            </div>
                            <button onClick={changePassword} disabled={saving || !newPassword}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-neon)] text-black text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                                Actualizar Contraseña
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
