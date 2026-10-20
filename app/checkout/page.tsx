import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "To'lov" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  return (
    <div className="container py-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">To&apos;lov</h1>
      <CheckoutForm user={user} />
    </div>
  );
}
