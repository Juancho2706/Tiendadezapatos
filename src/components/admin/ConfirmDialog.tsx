"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    isLoading?: boolean;
}

export default function ConfirmDialog({
    open, onClose, onConfirm, title, description, confirmText = "Eliminar", isLoading = false,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">{title}</h3>
                        <p className="text-zinc-400 text-sm mt-1">{description}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white bg-zinc-800 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Eliminando..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
