"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { promoPercent } from "@/lib/pricing";
import { useCart } from "@/store/cart";

export function PromoBox() {
  const promo = useCart((s) => s.promo);
  const setPromo = useCart((s) => s.setPromo);
  const [value, setValue] = useState("");
  const pct = promoPercent(promo);

  if (pct > 0) {
    return (
      <div className="flex items-center justify-between rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">
        <span className="flex items-center gap-2">
          <Tag className="h-4 w-4" /> {promo.toUpperCase()} · -{pct}%
        </span>
        <button type="button" className="underline-offset-2 hover:underline" onClick={() => setPromo("")}>
          Olib tashlash
        </button>
      </div>
    );
  }

  function apply() {
    const code = value.trim().toUpperCase();
    if (promoPercent(code) > 0) {
      setPromo(code);
      setValue("");
      toast.success("Promokod qo'llandi");
    } else {
      toast.error("Bunday promokod yo'q");
    }
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Promokod (WELCOME10)" aria-label="Promokod" />
      <Button type="submit" variant="outline">
        Qo&apos;llash
      </Button>
    </form>
  );
}
