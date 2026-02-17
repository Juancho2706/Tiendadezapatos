"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("error") === "unauthorized") {
            setError("No tienes permisos de administrador.");
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError(
                    authError.message === "Invalid login credentials"
                        ? "Credenciales inválidas. Verifica tu email y contraseña."
                        : authError.message
                );
                setLoading(false);
                return;
            }

            if (data.user) {
                // Wait for session to fully propagate
                await new Promise((resolve) => setTimeout(resolve, 500));

                const { data: profile, error: profileError } = await (supabase
                    .from("profiles") as any)
                    .select("role")
                    .eq("id", data.user.id)
                    .single();

                console.log("Profile query result:", { profile, profileError });

                if (profileError) {
                    console.error("Profile query error:", profileError);
                    // If RLS blocks the query, try getting user metadata as fallback
                    setError(`Error al verificar permisos: ${profileError.message}`);
                    setLoading(false);
                    return;
                }

                if (!profile || profile.role !== "admin") {
                    await supabase.auth.signOut();
                    setError("No tienes permisos de administrador.");
                    setLoading(false);
                    return;
                }

                router.push("/admin");
                router.refresh();
            }
        } catch {
            setError("Error de conexión. Intenta de nuevo.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

            <div className="relative w-full max-w-md space-y-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a la Tienda
                </Link>

                <div>
                    <h1 className="text-3xl font-display font-black tracking-tight text-white">
                        SNEAKER<span className="text-[var(--color-neon)]">CMS</span>
                    </h1>
                    <p className="mt-2 text-sm text-zinc-500">
                        Panel de administración — Ingresa tus credenciales
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Demo Credentials */}
                <div className="p-4 bg-[var(--color-neon)]/10 border border-[var(--color-neon)]/20 rounded-lg text-sm mb-6">
                    <p className="font-bold text-[var(--color-neon)] uppercase tracking-wider text-xs mb-2">Credenciales de Demo:</p>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-zinc-300">
                        <span className="text-zinc-500">Email:</span>
                        <span className="font-mono">admin@admin.com</span>
                        <span className="text-zinc-500">Pass:</span>
                        <span className="font-mono">thisisadmin</span>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] focus:ring-1 focus:ring-[var(--color-neon)]/30 transition-all"
                                placeholder="admin@sneakhub.cl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-neon)] focus:ring-1 focus:ring-[var(--color-neon)]/30 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[var(--color-neon)] text-black font-bold text-sm uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Verificando...
                            </>
                        ) : (
                            "Ingresar al Panel"
                        )}
                    </button>
                </form>

                <p className="text-center text-[10px] text-zinc-700 uppercase tracking-widest">
                    Acceso restringido — Solo administradores
                </p>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
