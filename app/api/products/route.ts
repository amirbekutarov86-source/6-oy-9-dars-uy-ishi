import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { addProduct, listProducts } from "@/lib/repo";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ products: await listProducts() });
}

const hueOf = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Avval tizimga kiring" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const price = Math.round(Number(body.price));
  const stock = Math.floor(Number(body.stock));
  const emoji = String(body.emoji ?? "📦").slice(0, 8) || "📦";
  const description = String(body.description ?? "").trim().slice(0, 300);

  if (name.length < 2 || name.length > 60) return NextResponse.json({ error: "Nom 2-60 belgi bo'lsin" }, { status: 400 });
  if (!Number.isFinite(price) || price < 1 || price > 1_000_000_000) return NextResponse.json({ error: "Narx noto'g'ri" }, { status: 400 });
  if (!Number.isFinite(stock) || stock < 0 || stock > 100_000) return NextResponse.json({ error: "Ombor soni noto'g'ri" }, { status: 400 });

  const product: Product = {
    id: `p-${randomUUID().slice(0, 8)}`,
    name,
    price,
    emoji,
    hue: hueOf(name),
    stock,
    description,
    builtIn: false,
    createdAt: new Date().toISOString(),
  };
  await addProduct(product);
  return NextResponse.json({ product }, { status: 201 });
}
