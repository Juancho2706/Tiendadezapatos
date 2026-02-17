import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    features: string[]; // Mocked for now or added to DB later
};

export async function getProducts(options?: {
    category?: string;
    isFeatured?: boolean;
    limit?: number;
    search?: string;
    sort?: "newest" | "price-asc" | "price-desc";
    brand?: string;
}): Promise<Product[]> {
    const supabase = await createSupabaseServerClient();

    let query = supabase
        .from("products")
        .select(`
            *,
            brand:brands(name),
            images:product_images(url, is_main, display_order),
            variants:product_variants(size, color, stock_quantity)
        `);

    if (options?.category && options.category !== "All") {
        query = query.eq("category", options.category);
    }

    if (options?.isFeatured) {
        query = query.eq("is_featured", true);
    }

    if (options?.brand) {
        // Need to filter by joined brand name, but Supabase doesn't support complex filtering on joined tables easily in one go for text match without embedding.
        // But here we can assume exact match on brand slug or name if we knew it. 
        // For simplicity, let's filter by brand_id if we have it, or we rely on client side filter?
        // Actually, we can filter by inner join if we use !inner
        // query = query.eq("brands.name", options.brand); // This syntax depends on PostgREST version.
        // Let's try to filter by brand Name via inner join
        query = query.eq("brand.name", options.brand);
    }

    if (options?.search) {
        query = query.ilike("name", `%${options.search}%`);
    }

    if (options?.limit) {
        query = query.limit(options.limit);
    }

    // Sort
    if (options?.sort === "price-asc") {
        query = query.order("price", { ascending: true });
    } else if (options?.sort === "price-desc") {
        query = query.order("price", { ascending: false });
    } else {
        query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    if (!data) return [];

    return data.map((p: any) => transformProduct(p));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("products")
        .select(`
            *,
            brand:brands(name),
            images:product_images(url, is_main, display_order),
            variants:product_variants(size, color, stock_quantity)
        `)
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching product by slug:", error);
        return null;
    }

    return transformProduct(data);
}
export async function getProductById(id: string): Promise<Product | null> {
    // Fallback for ID based fetching if needed
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("products")
        .select(`
             *,
            brand:brands(name),
            images:product_images(url, is_main, display_order),
            variants:product_variants(size, color, stock_quantity)
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching product by id:", error);
        return null;
    }

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
        images: sortedImages.length > 0 ? sortedImages : ["/placeholder.jpg"], // Fallback
        isFeatured: p.is_featured,
        isDrop: p.is_drop,
        stock: totalStock,
        sizes: sizes,
        colors: colors,
        features: [ // Static features for now as they are not in DB schema yet in a structured way
            "Parte superior de cuero",
            "Suela de goma duradera",
            "Amortiguación cómoda",
            "Diseño clásico",
        ]
    };
}
