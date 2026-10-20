import type { Metadata } from "next";
import { ProductsTable } from "@/components/products-table";
import { getCurrentUser } from "@/lib/auth";
import { listProducts } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Products page", description: "Barcha mahsulotlar ro'yxati: qidirish, saralash va savatga qo'shish." };

export default async function ProductsPage() {
  const [products, user] = await Promise.all([listProducts(), getCurrentUser()]);
  return <ProductsTable products={products} user={user} />;
}
