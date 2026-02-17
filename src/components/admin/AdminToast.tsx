"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface Toast {
    id: number;
    message: string;
    type: "success" | "error";
}

interface ToastContextType {
    showToast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => { } });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[200] space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl text-sm font-medium animate-in slide-in-from-right ${toast.type === "success"
                                ? "bg-green-500/10 border-green-500/20 text-green-400"
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                        style={{ minWidth: 280 }}
                    >
                        {toast.type === "success" ? (
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        ) : (
                            <XCircle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="flex-1">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-50 hover:opacity-100">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
