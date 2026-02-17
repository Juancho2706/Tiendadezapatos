import { MetadataRoute } from "next";
import { products } from "@/lib/mockData";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://sneakhub.cl";

    // Static routes
    const routes = [
        "",
        "/shop",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Dynamic routes (Products)
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    return [...routes, ...productRoutes];
}
