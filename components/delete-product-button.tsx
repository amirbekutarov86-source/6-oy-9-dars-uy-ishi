"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const remove = useCart((s) => s.remove);
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (!window.confirm(`"${name}" mahsulotini o'chirasizmi?`)) return;
    setPending(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(json.error ?? "O'chirib bo'lmadi");
        return;
      }
      remove(id);
      toast.success("Mahsulot o'chirildi");
      router.refresh();
    } catch {
      toast.error("Tarmoq xatosi");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive" onClick={onClick} disabled={pending} aria-label={`${name} ni o'chirish`}>
      {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
}
