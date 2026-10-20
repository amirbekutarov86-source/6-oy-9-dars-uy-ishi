"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUi } from "@/store/ui";
import type { SessionUser } from "@/lib/types";

const EMOJIS = ["📦", "📱", "🎧", "⌚", "📷", "🎮", "🪑", "🍎", "👟", "🧴"];

export function AddProductForm({ user }: { user: SessionUser | null }) {
  const router = useRouter();
  const closeDrawer = useUi((s) => s.closeDrawer);
  const [pending, setPending] = useState(false);
  const [emoji, setEmoji] = useState(EMOJIS[0]);

  if (!user) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <PackagePlus className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="font-medium">Mahsulot qo&apos;shish uchun tizimga kiring</p>
        <p className="mt-1 text-sm text-muted-foreground">Ro&apos;yxatdan o&apos;tish bepul va bir daqiqa oladi.</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild onClick={closeDrawer}>
            <Link href="/login">Kirish</Link>
          </Button>
          <Button asChild variant="outline" onClick={closeDrawer}>
            <Link href="/register">Ro&apos;yxatdan o&apos;tish</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setPending(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          price: Number(data.get("price")),
          stock: Number(data.get("stock")),
          description: String(data.get("description") ?? ""),
          emoji,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(json.error ?? "Mahsulot qo'shilmadi");
        return;
      }
      toast.success("Mahsulot qo'shildi");
      form.reset();
      router.refresh();
    } catch {
      toast.error("Tarmoq xatosi. Qayta urinib ko'ring.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="p-name">Nomi</Label>
        <Input id="p-name" name="name" required minLength={2} maxLength={60} placeholder="Masalan: Televizor" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="p-price">Narxi (so&apos;m)</Label>
          <Input id="p-price" name="price" type="number" required min={1} max={1000000000} step={1} placeholder="150000" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-stock">Omborda (dona)</Label>
          <Input id="p-stock" name="stock" type="number" required min={0} max={100000} step={1} defaultValue={10} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Belgi (emoji)</Label>
        <div className="flex flex-wrap gap-1.5">
          {EMOJIS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setEmoji(em)}
              aria-pressed={emoji === em}
              className={`flex h-9 w-9 items-center justify-center rounded-md border text-lg transition ${
                emoji === em ? "border-primary bg-primary/10 ring-2 ring-primary/40" : "hover:bg-muted"
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="p-desc">Tavsif</Label>
        <Textarea id="p-desc" name="description" rows={3} maxLength={300} placeholder="Qisqacha ma'lumot..." />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : <PackagePlus />} Qo&apos;shish
      </Button>
    </form>
  );
}
