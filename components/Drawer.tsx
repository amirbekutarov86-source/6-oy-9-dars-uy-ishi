"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddProductForm } from "@/components/add-product-form";
import { CartLines } from "@/components/cart-lines";
import { PromoBox } from "@/components/promo-box";
import { formatPrice } from "@/lib/format";
import { computeTotals } from "@/lib/pricing";
import { useHydrated } from "@/lib/use-hydrated";
import type { SessionUser } from "@/lib/types";
import { useCart } from "@/store/cart";
import { useUi } from "@/store/ui";

/** "Open Drawer" tugmasi ochadigan yon panel: Savat va Mahsulot qo'shish */
export function Drawer({ user }: { user: SessionUser | null }) {
  const open = useUi((s) => s.drawerOpen);
  const setOpen = useUi((s) => s.setDrawerOpen);
  const tab = useUi((s) => s.drawerTab);
  const setTab = useUi((s) => s.setDrawerTab);
  const closeDrawer = useUi((s) => s.closeDrawer);
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const clear = useCart((s) => s.clear);

  const items = hydrated ? lines : [];
  const totals = computeTotals(items, "pickup", promo);
  const count = items.reduce((n, l) => n + l.qty, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Drawer</SheetTitle>
          <SheetDescription>Savatingiz va yangi mahsulot qo&apos;shish</SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v === "add" ? "add" : "cart")} className="flex min-h-0 flex-1 flex-col">
          <TabsList className="mx-6 mt-4 grid grid-cols-2">
            <TabsTrigger value="cart">Savat {count > 0 && `(${count})`}</TabsTrigger>
            <TabsTrigger value="add">Mahsulot qo&apos;shish</TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="mt-0 flex min-h-0 flex-1 flex-col">
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                <p className="font-medium">Savat hozircha bo&apos;sh</p>
                <p className="text-sm text-muted-foreground">Jadvaldan mahsulot tanlab, &quot;Savatga&quot; tugmasini bosing.</p>
                <Button variant="outline" onClick={closeDrawer} asChild>
                  <Link href="/products">Mahsulotlarga o&apos;tish</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto px-6">
                  <CartLines compact />
                </div>
                <div className="space-y-3 border-t px-6 py-4">
                  <PromoBox />
                  <div className="space-y-1 text-sm">
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-success">
                        <span>Chegirma ({totals.promo})</span>
                        <span className="tabular-nums">-{formatPrice(totals.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold">
                      <span>Jami</span>
                      <span className="tabular-nums">{formatPrice(totals.subtotal - totals.discount)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Yetkazib berish narxi keyingi bosqichda hisoblanadi.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={closeDrawer} asChild>
                      <Link href="/cart">Savatni ko&apos;rish</Link>
                    </Button>
                    <Button onClick={closeDrawer} asChild>
                      <Link href="/checkout">To&apos;lovga o&apos;tish</Link>
                    </Button>
                  </div>
                  <button type="button" className="w-full text-center text-xs text-muted-foreground hover:text-destructive" onClick={clear}>
                    Savatni tozalash
                  </button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="add" className="mt-0 min-h-0 flex-1 overflow-y-auto px-6 py-4">
            <AddProductForm user={user} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
