import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductTile } from "@/components/product-tile";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { getProduct } from "@/lib/repo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);
  return p ? { title: p.name, description: p.description || `${p.name} — ${formatPrice(p.price)}` } : { title: "Topilmadi" };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  return (
    <div className="container py-8">
      <Link href="/products" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Mahsulotlarga qaytish
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="mx-auto aspect-square w-full max-w-md rounded-3xl border bg-card p-4 shadow-sm">
          <ProductTile emoji={p.emoji} hue={p.hue} size="lg" className="text-9xl" />
        </div>
        <div className="space-y-5">
          <h1 className="font-serif text-4xl font-bold">{p.name}</h1>
          <p className="text-3xl font-bold text-primary">{formatPrice(p.price)}</p>
          <div>
            {p.stock <= 0 ? <Badge variant="secondary">Tugagan</Badge> : <Badge variant="secondary">Omborda: {p.stock} dona</Badge>}
          </div>
          <p className="text-muted-foreground">{p.description || "Tavsif kiritilmagan."}</p>
          <AddToCartButton product={p} size="lg" label="Savatga qo'shish" />
        </div>
      </div>
    </div>
  );
}
