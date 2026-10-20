import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { CartSummary } from "@/components/cart-summary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { DELIVERY_LABEL, formatDate, formatPrice, PAYMENT_LABEL } from "@/lib/format";
import { getOrder } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Buyurtma", robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, user] = await Promise.all([getOrder(id), getCurrentUser()]);
  // akkauntga bog'langan buyurtmani faqat egasi ko'radi
  if (!order || (order.userId && order.userId !== user?.id)) notFound();

  const paid = order.payment.status === "paid";
  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-6 rounded-2xl border bg-card p-6 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-success" />
        <h1 className="font-serif text-3xl font-bold">Buyurtma qabul qilindi!</h1>
        <p className="mt-1 text-muted-foreground">
          Buyurtma raqami: <span className="font-semibold text-foreground">{order.id}</span> · {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="space-y-4">
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="mb-3 font-semibold">Mahsulotlar</h2>
          <ul className="divide-y text-sm">
            {order.items.map((i) => (
              <li key={i.productId} className="flex justify-between py-2">
                <span>
                  {i.name} <span className="text-muted-foreground">× {i.qty}</span>
                </span>
                <span className="tabular-nums">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t pt-3">
            <CartSummary totals={{ subtotal: order.subtotal, discount: order.discount, shipping: order.shipping, total: order.total, promo: order.promo }} />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card p-5 text-sm">
            <h2 className="mb-2 font-semibold">Mijoz</h2>
            <p>{order.customer.name}</p>
            <p className="text-muted-foreground">{order.customer.phone}</p>
            <p className="mt-2">{DELIVERY_LABEL[order.delivery]}</p>
            {order.customer.address && <p className="text-muted-foreground">{order.customer.address}</p>}
            {order.customer.note && <p className="mt-2 italic text-muted-foreground">&quot;{order.customer.note}&quot;</p>}
          </div>
          <div className="rounded-2xl border bg-card p-5 text-sm">
            <h2 className="mb-2 font-semibold">To&apos;lov</h2>
            <p>{PAYMENT_LABEL[order.payment.method]}</p>
            <Badge variant="secondary" className="mt-2">
              {paid ? "To'langan (demo)" : "Qabul qilganda to'lanadi"}
            </Badge>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button asChild>
            <Link href="/products">Xaridni davom ettirish</Link>
          </Button>
          {user && (
            <Button asChild variant="outline">
              <Link href="/orders">Barcha buyurtmalar</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
