import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = { title: "Savat" };

export default function CartPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">Savat</h1>
      <CartView />
    </div>
  );
}
