"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, PanelRightOpen, Search, SearchX } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { DeleteProductButton } from "@/components/delete-product-button";
import { ProductTile } from "@/components/product-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/format";
import type { Product, SessionUser } from "@/lib/types";
import { useUi } from "@/store/ui";

type SortKey = "name" | "price";

/** "Products page": gradient sarlavha + qidiruv + Open Drawer + mahsulotlar jadvali */
export function ProductsTable({ products, user }: { products: Product[]; user: SessionUser | null }) {
  const openDrawer = useUi((s) => s.openDrawer);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
    if (!sort) return filtered;
    const sorted = [...filtered].sort((a, b) =>
      sort.key === "price" ? a.price - b.price : a.name.localeCompare(b.name, "uz", { sensitivity: "base" }),
    );
    return sort.dir === "desc" ? sorted.reverse() : sorted;
  }, [products, query, sort]);

  function toggleSort(key: SortKey) {
    setSort((cur) => {
      if (!cur || cur.key !== key) return { key, dir: "asc" };
      if (cur.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sort?.key !== k) return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />;
    return sort.dir === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
  }

  return (
    <div>
      {/* gradient sarlavha */}
      <div className="brand-gradient dot-grid relative">
        <div className="container grid items-center gap-4 py-8 md:grid-cols-[1fr_minmax(260px,420px)_1fr] md:py-10">
          <h1 className="font-serif text-4xl font-bold text-white drop-shadow-sm md:text-5xl">Products page</h1>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product..."
              aria-label="Search product"
              className="h-11 w-full rounded-full border-0 bg-white/95 pl-11 pr-4 text-sm text-foreground shadow-md outline-none ring-offset-2 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white"
            />
          </div>

          <div className="flex md:justify-end">
            <Button onClick={() => openDrawer("cart")} className="h-11 rounded-full bg-white px-6 text-foreground shadow-md hover:bg-white/90">
              <PanelRightOpen /> Open Drawer
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <Table>
            <TableCaption className="pb-4">A list of your available products.</TableCaption>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16">No</TableHead>
                <TableHead aria-sort={sort?.key === "name" ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
                  <button type="button" className="inline-flex items-center gap-1.5 hover:text-foreground" onClick={() => toggleSort("name")}>
                    Name <SortIcon k="name" />
                  </button>
                </TableHead>
                <TableHead aria-sort={sort?.key === "price" ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
                  <button type="button" className="inline-flex items-center gap-1.5 hover:text-foreground" onClick={() => toggleSort("price")}>
                    Price <SortIcon k="price" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Cart</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p, i) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <Link href={`/products/${p.id}`} className="flex items-center gap-3 font-medium hover:text-primary">
                      <ProductTile emoji={p.emoji} hue={p.hue} size="sm" />
                      <span>
                        {p.name}
                        {p.stock <= 0 && (
                          <Badge variant="secondary" className="ml-2 align-middle">
                            Tugagan
                          </Badge>
                        )}
                        {p.stock > 0 && p.stock <= 5 && (
                          <Badge variant="secondary" className="ml-2 align-middle text-primary">
                            {p.stock} ta qoldi
                          </Badge>
                        )}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">{formatPrice(p.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <AddToCartButton product={p} size="sm" />
                      {user && !p.builtIn && <DeleteProductButton id={p.id} name={p.name} />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                    <SearchX className="mx-auto mb-2 h-8 w-8 opacity-60" />
                    &quot;{query}&quot; bo&apos;yicha hech narsa topilmadi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3}>Total products</TableCell>
                <TableCell className="text-right tabular-nums">{rows.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}
