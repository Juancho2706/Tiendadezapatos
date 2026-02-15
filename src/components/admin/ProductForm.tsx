"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X, GripVertical, Plus } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button"; // Check if this matches shadcn button or custom
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Zod Schema
const productSchema = z.object({
    name: z.string().min(2, "El nombre es obligatorio"),
    slug: z.string().min(2, "El slug es obligatorio"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "El precio debe ser positivo"),
    sale_price: z.coerce.number().min(0).optional(),
    category: z.string().min(1, "La categoría es obligatoria"),
    is_featured: z.boolean().default(false),
    is_drop: z.boolean().default(false),
    variants: z.array(z.object({
        size: z.string().min(1, "Talla requerida"),
        color: z.string().optional(),
        stock_quantity: z.coerce.number().min(0),
        sku: z.string().optional(),
    })).min(1, "Debes agregar al menos una variante (inventario)"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
    const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            price: 0,
            sale_price: 0,
            is_featured: false,
            is_drop: false,
            variants: [{ size: "", color: "", stock_quantity: 0, sku: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants"
    });

    const [images, setImages] = useState<string[]>([]);

    const onSubmit = (data: ProductFormValues) => {
        console.log("Form Data:", data);
        console.log("Images:", images);
        alert("Producto guardado (ver consola)");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto py-10">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Editar Producto</h1>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">Cancelar</Button>
                    <Button type="submit" className="bg-[var(--color-neon)] text-black hover:bg-white">Guardar Producto</Button>
                </div>
            </div>

            <Tabs defaultValue="info" className="w-full">
                <TabsList className="bg-zinc-900 border border-zinc-800 w-full justify-start p-1 h-auto rounded-lg">
                    <TabsTrigger value="info" className="flex-1 max-w-[150px]">Información</TabsTrigger>
                    <TabsTrigger value="media" className="flex-1 max-w-[150px]">Imágenes</TabsTrigger>
                    <TabsTrigger value="variants" className="flex-1 max-w-[150px]">Inventario</TabsTrigger>
                    <TabsTrigger value="status" className="flex-1 max-w-[150px]">Estado</TabsTrigger>
                </TabsList>

                {/* 1. INFO TAB */}
                <TabsContent value="info" className="space-y-6 mt-6 bg-zinc-950/50 p-6 rounded-xl border border-zinc-800">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Producto</Label>
                            <Input id="name" {...register("name")} placeholder="Ej: Air Jordan 1 High OG" />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input id="slug" {...register("slug")} placeholder="ej: air-jordan-1-high-og" />
                            {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" {...register("description")} placeholder="Descripción detallada del producto..." />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio Base (CLP)</Label>
                            <Input type="number" id="price" {...register("price")} placeholder="0" />
                            {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sale_price">Precio Oferta (Opcional)</Label>
                            <Input type="number" id="sale_price" {...register("sale_price")} placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoría</Label>
                            <select className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" {...register("category")}>
                                <option value="">Seleccionar...</option>
                                <option value="Hombre">Hombre</option>
                                <option value="Mujer">Mujer</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                        </div>
                    </div>
                </TabsContent>

                {/* 2. MEDIA TAB */}
                <TabsContent value="media" className="mt-6 bg-zinc-950/50 p-6 rounded-xl border border-zinc-800">
                    <div className="border-2 border-dashed border-zinc-800 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-zinc-900/50 transition-colors cursor-pointer">
                        <Upload className="w-10 h-10 text-zinc-500 mb-4" />
                        <h3 className="text-zinc-300 font-medium">Arrastra imágenes aquí</h3>
                        <p className="text-zinc-500 text-sm mt-1">Soporta JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                    {/* Placeholder for uploaded list */}
                    <div className="mt-6 grid grid-cols-5 gap-4">
                        {/* Empty state for now */}
                        <p className="text-zinc-600 text-sm col-span-5 text-center py-4">No hay imágenes seleccionadas.</p>
                    </div>
                </TabsContent>

                {/* 3. VARIANTS TAB (INVENTORY) */}
                <TabsContent value="variants" className="mt-6 bg-zinc-950/50 p-6 rounded-xl border border-zinc-800">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-medium">Matriz de Inventario</h3>
                            <Button type="button" onClick={() => append({ size: "", color: "", stock_quantity: 0, sku: "" })} className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs h-8">
                                <Plus className="w-4 h-4 mr-2" /> Añadir Talla
                            </Button>
                        </div>

                        <div className="border border-zinc-800 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-900 text-zinc-400 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Talla</th>
                                        <th className="px-4 py-3">Color</th>
                                        <th className="px-4 py-3">Stock</th>
                                        <th className="px-4 py-3">SKU</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {fields.map((field, index) => (
                                        <tr key={field.id} className="group hover:bg-zinc-900/30">
                                            <td className="p-2">
                                                <Input {...register(`variants.${index}.size`)} placeholder="Ej: 42" className="h-8" />
                                                {errors.variants?.[index]?.size && <span className="text-red-500 text-[10px]">{errors.variants[index]?.size?.message}</span>}
                                            </td>
                                            <td className="p-2"><Input {...register(`variants.${index}.color`)} placeholder="Ej: Rojo/Negro" className="h-8" /></td>
                                            <td className="p-2">
                                                <Input type="number" {...register(`variants.${index}.stock_quantity`)} placeholder="0" className="h-8" />
                                            </td>
                                            <td className="p-2"><Input {...register(`variants.${index}.sku`)} placeholder="SKU-123" className="h-8" /></td>
                                            <td className="p-2 text-center">
                                                <button type="button" onClick={() => remove(index)} className="text-zinc-500 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {errors.variants && <p className="text-red-500 text-xs mt-2">{errors.variants.message}</p>}
                    </div>
                </TabsContent>

                {/* 4. STATUS TAB */}
                <TabsContent value="status" className="mt-6 bg-zinc-950/50 p-6 rounded-xl border border-zinc-800 space-y-6">
                    <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
                        <div className="space-y-0.5">
                            <Label className="text-base text-white">Producto Destacado</Label>
                            <p className="text-sm text-zinc-500">Aparecerá en la sección "Trending Now" del home.</p>
                        </div>
                        <Switch onCheckedChange={(checked) => null} {...register("is_featured")} />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
                        <div className="space-y-0.5">
                            <Label className="text-base text-white">Es un Drop (Lanzamiento)</Label>
                            <p className="text-sm text-zinc-500">Se destacará con la etiqueta "DROP" y fecha de lanzamiento.</p>
                        </div>
                        <Switch onCheckedChange={(checked) => null} {...register("is_drop")} />
                    </div>
                </TabsContent>

            </Tabs>
        </form>
    );
}
