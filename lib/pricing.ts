import type { DeliveryMethod } from "./types";

export const PROMOS: Record<string, number> = { WELCOME10: 10, SALE20: 20 };
export const DELIVERY_FEE = 25000;
export const FREE_DELIVERY_FROM = 3000000;

export function promoPercent(code: string | null | undefined): number {
  if (!code) return 0;
  return PROMOS[code.trim().toUpperCase()] ?? 0;
}

export type Totals = { subtotal: number; discount: number; shipping: number; total: number; promo: string | null };

/** Savat va buyurtma uchun yagona hisob-kitob (klient ham, server ham shuni ishlatadi) */
export function computeTotals(
  lines: { price: number; qty: number }[],
  delivery: DeliveryMethod,
  promoCode?: string | null,
): Totals {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const pct = promoPercent(promoCode);
  const discount = Math.round((subtotal * pct) / 100);
  const afterDiscount = subtotal - discount;
  const shipping = delivery === "delivery" && afterDiscount > 0 && afterDiscount < FREE_DELIVERY_FROM ? DELIVERY_FEE : 0;
  return {
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
    promo: pct > 0 ? (promoCode as string).trim().toUpperCase() : null,
  };
}
