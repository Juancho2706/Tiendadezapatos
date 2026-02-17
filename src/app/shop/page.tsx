import { getProducts } from "@/services/products";
import ShopBrowser from "@/components/shop/ShopBrowser";

export default async function ShopPage() {
    const products = await getProducts();
    return <ShopBrowser initialProducts={products} />;
}
