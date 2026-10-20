"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";

type Props = Omit<ButtonProps, "onClick"> & {
  product: Pick<Product, "id" | "name" | "price" | "emoji" | "hue" | "stock">;
  qty?: number;
  label?: string;
};

export function AddToCartButton({ product, qty = 1, label = "Savatga", ...rest }: Props) {
  const add = useCart((s) => s.add);
  const inCart = useCart((s) => s.lines.find((l) => l.productId === product.id)?.qty ?? 0);
  const [done, setDone] = useState(false);
  const soldOut = product.stock <= 0;

  function onClick() {
    if (inCart + qty > product.stock) {
      toast.error(`Omborda faqat ${product.stock} dona bor`);
      return;
    }
    add(product, qty);
    toast.success(`${product.name} savatga qo'shildi`);
    setDone(true);
    window.setTimeout(() => setDone(false), 1200);
  }

  return (
    <Button type="button" onClick={onClick} disabled={soldOut || rest.disabled} {...rest}>
      {done ? <Check /> : <ShoppingCart />}
      {soldOut ? "Tugagan" : label}
    </Button>
  );
}
