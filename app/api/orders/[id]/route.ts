import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getOrder } from "@/lib/repo";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, user] = await Promise.all([getOrder(id), getCurrentUser()]);
  if (!order || (order.userId && order.userId !== user?.id)) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  return NextResponse.json({ order });
}
