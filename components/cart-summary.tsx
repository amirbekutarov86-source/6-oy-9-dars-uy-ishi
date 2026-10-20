"use client";

import { formatPrice } from "@/lib/format";
import type { Totals } from "@/lib/pricing";

export function CartSummary({ totals }: { totals: Totals }) {
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Mahsulotlar</dt>
        <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-success">
          <dt>Chegirma ({totals.promo})</dt>
          <dd className="tabular-nums">-{formatPrice(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Yetkazib berish</dt>
        <dd className="tabular-nums">{totals.shipping > 0 ? formatPrice(totals.shipping) : "Bepul"}</dd>
      </div>
      <div className="flex justify-between border-t pt-2 text-base font-bold">
        <dt>Jami</dt>
        <dd className="tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
