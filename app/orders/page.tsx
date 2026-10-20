import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { listOrdersByUser } from "@/lib/repo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Buyurtmalarim" };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/orders");
  const orders = await listOrdersByUser(user.id);

  return (
    <div className="container py-8">
      <h1 className="mb-6 font-serif text-3xl font-bold">Buyurtmalarim</h1>
      {orders.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border bg-card p-10 text-center">
          <PackageOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Buyurtmalar yo&apos;q</h2>
          <p className="mt-1 text-sm text-muted-foreground">Birinchi buyurtmangizni bering.</p>
          <Button asChild className="mt-5">
            <Link href="/products">Mahsulotlarga o&apos;tish</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 shadow-sm transition hover:border-primary">
                <div>
                  <p className="font-semibold">{o.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(o.createdAt)} · {o.items.reduce((n, i) => n + i.qty, 0)} dona
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{o.payment.status === "paid" ? "To'langan" : "To'lov kutilmoqda"}</Badge>
                  <span className="font-bold tabular-nums">{formatPrice(o.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
