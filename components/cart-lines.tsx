"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTile } from "@/components/product-tile";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";

export function CartLines({ compact = false }: { compact?: boolean }) {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  return (
    <ul className="divide-y">
      {lines.map((l) => (
        <li key={l.productId} className="flex items-center gap-3 py-3">
          <ProductTile emoji={l.emoji} hue={l.hue} size={compact ? "sm" : "md"} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{l.name}</p>
            <p className="text-sm text-muted-foreground">{formatPrice(l.price)}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <Button type="button" variant="outline" size="icon" className="h-7 w-7" aria-label="Kamaytirish" onClick={() => setQty(l.productId, l.qty - 1)}>
                <Minus />
              </Button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums">{l.qty}</span>
              <Button type="button" variant="outline" size="icon" className="h-7 w-7" aria-label="Ko'paytirish" onClick={() => setQty(l.productId, l.qty + 1)}>
                <Plus />
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm font-semibold tabular-nums">{formatPrice(l.price * l.qty)}</span>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label={`${l.name} ni o'chirish`} onClick={() => remove(l.productId)}>
              <Trash2 />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
