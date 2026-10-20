import { randomBytes } from "crypto";
import { getProduct, releaseStock, reserveStock, saveOrder } from "./repo";
import { computeTotals } from "./pricing";
import { validateCheckout, type CheckoutInput } from "./validators";
import type { Order } from "./types";

export type CreateOrderResult = { ok: true; order: Order } | { ok: false; error: string; fields?: Record<string, string | undefined> };

/**
 * Buyurtmani yaratadi. Narxlar bazadagi mahsulotlardan olinadi (klientdan kelgan narxga ishonilmaydi),
 * zaxira atomik tekshiriladi va kamaytiriladi.
 */
export async function createOrder(
  input: CheckoutInput,
  rawItems: { productId: string; qty: number }[],
  userId: string | null,
): Promise<CreateOrderResult> {
  const fields = validateCheckout(input);
  if (Object.keys(fields).length > 0) return { ok: false, error: "Ma'lumotlarni tekshiring", fields };

  const merged = new Map<string, number>();
  for (const it of rawItems) {
    const qty = Math.floor(Number(it.qty));
    if (!it.productId || !Number.isFinite(qty) || qty < 1) continue;
    merged.set(it.productId, Math.min(99, (merged.get(it.productId) ?? 0) + qty));
  }
  if (merged.size === 0) return { ok: false, error: "Savat bo'sh" };

  const items: Order["items"] = [];
  for (const [productId, qty] of merged) {
    const p = await getProduct(productId);
    if (!p) return { ok: false, error: "Savatdagi mahsulotlardan biri topilmadi. Savatni yangilang." };
    items.push({ productId, name: p.name, price: p.price, qty });
  }

  const reserved = await reserveStock(items.map((i) => ({ productId: i.productId, qty: i.qty })));
  if (!reserved.ok) return { ok: false, error: reserved.error };

  const totals = computeTotals(items, input.delivery, input.promo);
  const order: Order = {
    id: `ORD-${randomBytes(4).toString("hex").toUpperCase()}`,
    userId,
    items,
    customer: {
      name: input.name.trim(),
      phone: input.phone.trim(),
      address: input.delivery === "delivery" ? input.address.trim() : "",
      note: input.note.trim().slice(0, 300),
    },
    delivery: input.delivery,
    // DEMO: karta / Click / Payme "to'landi" deb belgilanadi, haqiqiy pul harakati yo'q
    payment: { method: input.payment, status: input.payment === "cash" ? "pending" : "paid" },
    promo: totals.promo,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shipping: totals.shipping,
    total: totals.total,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  try {
    await saveOrder(order);
  } catch (e) {
    await releaseStock(items.map((i) => ({ productId: i.productId, qty: i.qty })));
    throw e;
  }
  return { ok: true, order };
}
