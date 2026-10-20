import Link from "next/link";
import { ProductTile } from "@/components/product-tile";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Bosh sahifadagi rasmli mahsulotlar bo'limi */
export function ImagesSection({ products }: { products: Product[] }) {
  const shown = products.slice(0, 5);
  return (
    <section aria-labelledby="picks-title" className="container py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 id="picks-title" className="font-serif text-3xl font-bold">
            Tanlangan mahsulotlar
          </h2>
          <p className="mt-1 text-muted-foreground">Eng ko&apos;p qidirilgan tovarlar bir joyda.</p>
        </div>
        <Link href="/products" className="text-sm font-semibold text-primary hover:underline">
          Hammasini ko&apos;rish →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {shown.map((p, i) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="aspect-square p-3">
              <div className="h-full w-full animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                <ProductTile emoji={p.emoji} hue={p.hue} size="lg" />
              </div>
            </div>
            <div className="border-t p-3">
              <p className="truncate font-semibold group-hover:text-primary">{p.name}</p>
              <p className="text-sm text-muted-foreground">{formatPrice(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
