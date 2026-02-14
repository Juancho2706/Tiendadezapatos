
"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
// Using plain React state for drag and drop for simplicity. In a larger app, use react-dropzone.

interface ImageUploadProps {
    onImagesSelected: (files: File[]) => void;
}

export default function ImageUpload({ onImagesSelected }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
        if (files.length > 0) {
            handleFiles(files);
        }
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        }
    };

    const handleFiles = (files: File[]) => {
        // Generate Previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
        onImagesSelected(files);
    };

    const removeImage = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer bg-white
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileInput}
                />

                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                    <div className={`p-3 rounded-full bg-gray-100 ${isDragging ? 'bg-blue-100' : ''}`}>
                        <Upload className={`w-6 h-6 text-gray-500 ${isDragging ? 'text-blue-500' : ''}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                        Arrastra tus imágenes aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-gray-500">
                        Soporta: JPG, PNG, WEBP
                    </p>
                </div>
            </div>

            {/* Previews Grid */}
            {previews.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-6">
                    {previews.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                            <Image src={src} alt="Preview" fill className="object-cover" />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
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
