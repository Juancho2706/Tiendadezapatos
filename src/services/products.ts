import { getProducts as mockGetProducts, getProductBySlug as mockGetProductBySlug, getProductById as mockGetProductById } from "@/lib/mock/store";

export type Product = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    salePrice: number | null;
    category: string | null;
    brand: string;
    images: string[];
    isFeatured: boolean;
    isDrop: boolean;
    stock: number;
    sizes: string[];
    colors: string[];
    features: string[];
};

export async function getProducts(options?: {
    category?: string;
    isFeatured?: boolean;
    limit?: number;
    search?: string;
    sort?: "newest" | "price-asc" | "price-desc";
    brand?: string;
}): Promise<Product[]> {
    const data = await mockGetProducts(options);
    return data.map((p: any) => transformProduct(p));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const data = await mockGetProductBySlug(slug);
    if (!data) return null;
    return transformProduct(data);
}

export async function getProductById(id: string): Promise<Product | null> {
    const data = await mockGetProductById(id);
    if (!data) return null;
    return transformProduct(data);
}

function transformProduct(p: any): Product {
    // Sort images: main first, then by display_order
    const sortedImages = (p.images || []).sort((a: any, b: any) => {
        if (a.is_main) return -1;
        if (b.is_main) return 1;
        return (a.display_order || 0) - (b.display_order || 0);
    }).map((img: any) => img.url);

    // Aggregate variants
    const sizes = Array.from(new Set(p.variants?.map((v: any) => v.size))).sort() as string[];
    const colors = Array.from(new Set(p.variants?.map((v: any) => v.color).filter(Boolean))) as string[];
    const totalStock = p.variants?.reduce((acc: number, v: any) => acc + (v.stock_quantity || 0), 0) || 0;

    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        salePrice: p.sale_price ? Number(p.sale_price) : null,
        category: p.category,
        brand: p.brand?.name || "Unknown",
        images: sortedImages.length > 0 ? sortedImages : ["/placeholder.jpg"],
        isFeatured: p.is_featured,
        isDrop: p.is_drop,
        stock: totalStock,
        sizes: sizes,
        colors: colors,
        features: [
            "Parte superior de cuero",
            "Suela de goma duradera",
            "Amortiguación cómoda",
            "Diseño clásico",
        ]
    };
}
