
"use client";

import { cn } from "@/lib/utils"; // Assuming you have a utils file or similar, if not I'll just use standard template literals.

interface SizeSelectorProps {
    sizes: number[];
    selectedSize: number | null;
    onSelect: (size: number) => void;
}

// Mock inventory check - in a real app this would come from the DB
// For valid demo purposes, let's say sizes 40 and 44 are out of stock
const OUT_OF_STOCK = [40, 44];

export default function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold uppercase tracking-widest">Seleccionar Talla</span>
                <button className="text-xs text-gray-500 underline hover:text-black uppercase">Guía de Tallas</button>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => {
                    const isOutOfStock = OUT_OF_STOCK.includes(size);
                    const isSelected = selectedSize === size;

                    return (
                        <button
                            key={size}
                            onClick={() => !isOutOfStock && onSelect(size)}
                            disabled={isOutOfStock}
                            className={`
                relative h-12 flex items-center justify-center text-sm font-bold border transition-all
                ${isOutOfStock
                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                    : isSelected
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-black border-gray-200 hover:border-black"
                                }
              `}
                        >
                            {size}
                            {/* Diagonal Line for Out of Stock */}
                            {isOutOfStock && (
                                <span className="absolute inset-0 w-full h-full">
                                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="1" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
