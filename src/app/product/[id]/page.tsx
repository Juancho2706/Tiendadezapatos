import { Metadata, ResolvingMetadata } from "next";
import ProductView from "@/components/product/ProductView";
import { getProductById, getProducts } from "@/services/products";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id;
    const product = await getProductById(id);

    if (!product) {
        return {
            title: "Producto no encontrado",
        };
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description || "",
            images: [
                {
                    url: product.images[0] || "/Hero New.png",
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const id = (await params).id;
    const product = await getProductById(id);
    const relatedProducts = product
        ? await getProducts({ category: product.category || undefined, limit: 5 })
        : [];

    // Filter out the current product from related products
    const filteredRelatedProducts = relatedProducts.filter(p => p.id !== product?.id).slice(0, 4);

    if (!product) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.images[0],
        description: product.description,
        brand: {
            "@type": "Brand",
            name: product.brand,
        },
        offers: {
            "@type": "Offer",
            url: `https://sneakhub.cl/product/${product.id}`,
            priceCurrency: "CLP",
            price: product.salePrice || product.price,
            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductView product={product} relatedProducts={filteredRelatedProducts} />
        </>
    );
}
