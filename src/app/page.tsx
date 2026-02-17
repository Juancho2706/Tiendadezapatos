import { getProducts } from "@/services/products";
import LandingPage from "@/components/home/LandingPage";

export default async function Home() {
  // Fetch products on the server
  const bestSellers = await getProducts({ isFeatured: true, limit: 8 });

  // Pass data to formatting client component
  return <LandingPage bestSellers={bestSellers} />;
}
