
"use client";

import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatCLP } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    sku: string;
    stock: number;
    price: number;
    image: string;
}

interface InventoryTableProps {
    products: Product[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}



export default function InventoryTable({ products, onEdit, onDelete }: InventoryTableProps) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-[#f9fafb] text-xs font-semibold uppercase text-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-4">Producto</th>
                        <th scope="col" className="px-6 py-4">SKU</th>
                        <th scope="col" className="px-6 py-4">Stock</th>
                        <th scope="col" className="px-6 py-4">Precio</th>
                        <th scope="col" className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                </div>
                                <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{product.sku}</td>
                            <td className="px-6 py-4">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-default
                    ${product.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                                >
                                    {product.stock} u.
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900">{formatCLP(product.price)}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => onEdit(product.id)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(product.id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
