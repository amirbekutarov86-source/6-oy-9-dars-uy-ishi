"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ShoppingCart, Store, User } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/use-hydrated";
import type { SessionUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import { selectCount, useCart } from "@/store/cart";
import { useUi } from "@/store/ui";

const NAV = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/products", label: "Mahsulotlar" },
  { href: "/orders", label: "Buyurtmalar" },
];

export function Header({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCart(selectCount);
  const openDrawer = useUi((s) => s.openDrawer);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
          <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm">
            <Store className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">Shop</span>
        </Link>

        <nav className="ml-2 flex items-center gap-1" aria-label="Asosiy menyu">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  active ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative" onClick={() => openDrawer("cart")} aria-label="Savatni ochish">
            <ShoppingCart />
            {hydrated && count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 text-sm md:flex">
                <User className="h-4 w-4 text-muted-foreground" />
                {user.name}
              </span>
              <form action={logoutAction}>
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut /> <span className="hidden sm:inline">Chiqish</span>
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Kirish</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/register">Ro&apos;yxatdan o&apos;tish</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
