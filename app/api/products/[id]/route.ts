import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { removeProduct } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Avval tizimga kiring" }, { status: 401 });
  const { id } = await params;
  const result = await removeProduct(id);
  if (result === "missing") return NextResponse.json({ error: "Mahsulot topilmadi" }, { status: 404 });
  if (result === "builtin") return NextResponse.json({ error: "Asosiy mahsulotni o'chirib bo'lmaydi" }, { status: 403 });
  return NextResponse.json({ ok: true });
}
