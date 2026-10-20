import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createOrder } from "@/lib/orders";
import { listOrdersByUser } from "@/lib/repo";
import type { DeliveryMethod, PaymentMethod } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Avval tizimga kiring" }, { status: 401 });
  return NextResponse.json({ orders: await listOrdersByUser(user.id) });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });

  const user = await getCurrentUser();
  const items = Array.isArray(body.items)
    ? (body.items as { productId?: unknown; qty?: unknown }[]).map((i) => ({ productId: String(i.productId ?? ""), qty: Number(i.qty) }))
    : [];

  try {
    const result = await createOrder(
      {
        name: String(body.name ?? ""),
        phone: String(body.phone ?? ""),
        address: String(body.address ?? ""),
        note: String(body.note ?? ""),
        delivery: String(body.delivery ?? "") as DeliveryMethod,
        payment: String(body.payment ?? "") as PaymentMethod,
        promo: String(body.promo ?? ""),
      },
      items,
      user?.id ?? null,
    );
    if (!result.ok) return NextResponse.json({ error: result.error, fields: result.fields }, { status: 400 });
    return NextResponse.json({ id: result.order.id, total: result.order.total }, { status: 201 });
  } catch (e) {
    console.error("[orders] xato:", e);
    return NextResponse.json({ error: "Server xatosi. Keyinroq urinib ko'ring." }, { status: 500 });
  }
}
