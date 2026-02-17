"use client";

interface SizeSelectorProps {
    sizes: number[];
    selectedSize: number | null;
    onSelect: (size: number) => void;
}

const OUT_OF_STOCK = [40, 44];

export default function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Seleccionar Talla {selectedSize && <span className="text-white ml-1">— EU {selectedSize}</span>}
                </span>
                <button className="text-[10px] text-zinc-500 underline hover:text-[var(--color-neon)] uppercase tracking-widest transition-colors">
                    Guía de Tallas
                </button>
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
                                relative h-12 flex items-center justify-center text-sm font-bold rounded-lg border transition-all
                                ${isOutOfStock
                                    ? "bg-white/[0.02] text-zinc-700 border-white/5 cursor-not-allowed"
                                    : isSelected
                                        ? "bg-[var(--color-neon)] text-black border-[var(--color-neon)]"
                                        : "bg-[#141414] text-white border-white/10 hover:border-[var(--color-neon)]/50"
                                }
                            `}
                        >
                            {size}
                            {isOutOfStock && (
                                <span className="absolute inset-0 w-full h-full">
                                    <svg className="w-full h-full text-zinc-700" viewBox="0 0 100 100" preserveAspectRatio="none">
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
