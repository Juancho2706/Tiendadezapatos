"use client";

import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    onFilesSelected?: (files: File[]) => void;
    maxImages?: number;
}

export default function ImageUpload({
    images,
    onImagesChange,
    onFilesSelected,
    maxImages = 8,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
            if (files.length > 0) handleFiles(files);
        },
        [images]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) handleFiles(Array.from(e.target.files));
    };

    const handleFiles = (files: File[]) => {
        const remaining = maxImages - images.length;
        const toAdd = files.slice(0, remaining);
        const newPreviews = toAdd.map((f) => URL.createObjectURL(f));
        onImagesChange([...images, ...newPreviews]);
        onFilesSelected?.(toAdd);
    };

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full space-y-4">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging
                        ? "border-[var(--color-neon)] bg-[var(--color-neon)]/5"
                        : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/50"
                    }`}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileInput}
                />
                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <div className={`p-3 rounded-full ${isDragging ? "bg-[var(--color-neon)]/10" : "bg-zinc-800"}`}>
                        <Upload className={`w-6 h-6 ${isDragging ? "text-[var(--color-neon)]" : "text-zinc-500"}`} />
                    </div>
                    <p className="text-sm font-medium text-zinc-300">
                        Arrastra imágenes aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-zinc-600">
                        JPG, PNG, WEBP — Max {maxImages} imágenes ({images.length}/{maxImages})
                    </p>
                </div>
            </div>

            {/* Previews Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group"
                        >
                            <Image src={src} alt="Preview" fill className="object-cover" />
                            {index === 0 && (
                                <span className="absolute bottom-1 left-1 text-[8px] font-bold uppercase bg-[var(--color-neon)] text-black px-1.5 py-0.5 rounded">
                                    Principal
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
