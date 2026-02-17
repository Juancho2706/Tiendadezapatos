import { Metadata, ResolvingMetadata } from "next";
import ProductView from "@/components/product/ProductView";
import { products } from "@/lib/mockData";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id;
    const product = products.find((p) => p.id === id) || products[0];

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
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
    const product = products.find((p) => p.id === id) || products[0];

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
            <ProductView product={product} />
        </>
    );
}
