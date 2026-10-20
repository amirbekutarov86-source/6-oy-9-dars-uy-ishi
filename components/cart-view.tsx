"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CartLines } from "@/components/cart-lines";
import { CartSummary } from "@/components/cart-summary";
import { PromoBox } from "@/components/promo-box";
import { Button } from "@/components/ui/button";
import { computeTotals } from "@/lib/pricing";
import { useHydrated } from "@/lib/use-hydrated";
import { useCart } from "@/store/cart";

export function CartView() {
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const clear = useCart((s) => s.clear);

  if (!hydrated) return <div className="h-48 animate-pulse rounded-2xl bg-muted" />;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-10 text-center">
        <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">Savat bo&apos;sh</h2>
        <p className="mt-1 text-sm text-muted-foreground">Hali hech narsa tanlamadingiz.</p>
        <Button asChild className="mt-5">
          <Link href="/products">Mahsulotlarga o&apos;tish</Link>
        </Button>
      </div>
    );
  }

  const totals = computeTotals(lines, "pickup", promo);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border bg-card px-5">
        <CartLines />
        <div className="border-t py-3 text-right">
          <button type="button" onClick={clear} className="text-sm text-muted-foreground hover:text-destructive">
            Savatni tozalash
          </button>
        </div>
      </div>
      <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Hisob</h2>
        <PromoBox />
        <CartSummary totals={totals} />
        <p className="text-xs text-muted-foreground">Yetkazib berish narxi to&apos;lov sahifasida tanlovga qarab hisoblanadi.</p>
        <Button asChild size="lg" className="w-full">
          <Link href="/checkout">To&apos;lovga o&apos;tish</Link>
        </Button>
      </aside>
    </div>
  );
}
