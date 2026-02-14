
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate login for now
        if (email === "admin@example.com" && password === "admin") {
            document.cookie = "admin-session=true; path=/";
            router.push("/admin");
        } else {
            // Real Supabase Login
            // const { error } = await supabase.auth.signInWithPassword({ email, password });
            // if (error) alert(error.message);
            // else router.push("/admin");

            // Ensure we handle the "no credentials" case gracefully
            alert("Invalid credentials (Demo: admin@example.com / admin)");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/" className="inline-block mb-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="mx-auto h-6 w-6 mb-2" />
                        <span className="text-xs">Back to Store</span>
                    </Link>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Admin Access
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to manage your inventory
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-800">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white py-2"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white py-2"
                                    placeholder="admin"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full flex justify-center" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign in"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
