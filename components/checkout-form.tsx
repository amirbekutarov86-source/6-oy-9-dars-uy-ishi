"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Banknote, CreditCard, Loader2, Lock, ShieldCheck, ShoppingBag, Smartphone, Store, Truck } from "lucide-react";
import { CartSummary } from "@/components/cart-summary";
import { ProductTile } from "@/components/product-tile";
import { PromoBox } from "@/components/promo-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";
import { computeTotals } from "@/lib/pricing";
import type { DeliveryMethod, PaymentMethod, SessionUser } from "@/lib/types";
import { useHydrated } from "@/lib/use-hydrated";
import { validateCard, validateCheckout, type FieldErrors } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";

const PAYMENTS: { id: PaymentMethod; label: string; hint: string; icon: typeof Banknote }[] = [
  { id: "cash", label: "Naqd pul", hint: "Qabul qilganda to'laysiz", icon: Banknote },
  { id: "card", label: "Bank kartasi", hint: "Uzcard / Humo / Visa", icon: CreditCard },
  { id: "click", label: "Click", hint: "Demo to'lov", icon: Smartphone },
  { id: "payme", label: "Payme", hint: "Demo to'lov", icon: Smartphone },
];

const formatCardNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function Err({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-destructive">{msg}</p> : null;
}

export function CheckoutForm({ user }: { user: SessionUser | null }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const clear = useCart((s) => s.clear);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("+998 ");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [delivery, setDelivery] = useState<DeliveryMethod>("delivery");
  const [payment, setPayment] = useState<PaymentMethod>("cash");
  const [card, setCard] = useState({ number: "", holder: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-card p-10 text-center">
        <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">Savat bo&apos;sh</h2>
        <p className="mt-1 text-sm text-muted-foreground">To&apos;lov uchun avval mahsulot tanlang.</p>
        <Button asChild className="mt-5">
          <Link href="/products">Mahsulotlarga o&apos;tish</Link>
        </Button>
      </div>
    );
  }

  const totals = computeTotals(lines, delivery, promo);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base = { name, phone, address, note, delivery, payment, promo };
    const errs: FieldErrors = { ...validateCheckout(base), ...(payment === "card" ? validateCard(card) : {}) };
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Iltimos, belgilangan maydonlarni to'g'rilang");
      return;
    }
    setPending(true);
    try {
      // Karta ma'lumotlari serverga YUBORILMAYDI — faqat brauzerda tekshiriladi (demo).
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...base, items: lines.map((l) => ({ productId: l.productId, qty: l.qty })) }),
      });
      const json = (await res.json().catch(() => ({}))) as { id?: string; error?: string; fields?: FieldErrors };
      if (!res.ok || !json.id) {
        if (json.fields) setErrors(json.fields);
        toast.error(json.error ?? "Buyurtma yuborilmadi");
        return;
      }
      clear();
      toast.success("Buyurtma qabul qilindi!");
      router.push(`/orders/${json.id}`);
    } catch {
      toast.error("Tarmoq xatosi. Qayta urinib ko'ring.");
    } finally {
      setPending(false);
    }
  }

  const choice = (active: boolean) =>
    cn("flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition hover:bg-muted/60", active && "border-primary bg-primary/5 ring-1 ring-primary");

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {!user && (
          <p className="rounded-xl border bg-accent/60 px-4 py-3 text-sm">
            Buyurtmalar tarixini ko&apos;rish uchun{" "}
            <Link href="/login?next=/checkout" className="font-semibold text-primary hover:underline">
              kiring
            </Link>{" "}
            yoki{" "}
            <Link href="/register?next=/checkout" className="font-semibold text-primary hover:underline">
              ro&apos;yxatdan o&apos;ting
            </Link>
            . Akkauntsiz ham buyurtma berish mumkin.
          </p>
        )}

        <section className="space-y-4 rounded-2xl border bg-card p-5">
          <h2 className="text-lg font-semibold">1. Aloqa ma&apos;lumotlari</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name">Ism</Label>
              <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
              <Err msg={errors.name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-phone">Telefon</Label>
              <Input id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
              <Err msg={errors.phone} />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-5">
          <h2 className="text-lg font-semibold">2. Yetkazib berish</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={choice(delivery === "delivery")}>
              <input type="radio" name="delivery" className="mt-1 accent-[hsl(var(--primary))]" checked={delivery === "delivery"} onChange={() => setDelivery("delivery")} />
              <Truck className="mt-0.5 h-5 w-5 text-primary" />
              <span>
                <span className="block font-medium">Yetkazib berish</span>
                <span className="text-xs text-muted-foreground">3 000 000 so&apos;mdan yuqori buyurtma bepul</span>
              </span>
            </label>
            <label className={choice(delivery === "pickup")}>
              <input type="radio" name="delivery" className="mt-1 accent-[hsl(var(--primary))]" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} />
              <Store className="mt-0.5 h-5 w-5 text-primary" />
              <span>
                <span className="block font-medium">Olib ketish</span>
                <span className="text-xs text-muted-foreground">Do&apos;kondan bepul</span>
              </span>
            </label>
          </div>
          {delivery === "delivery" && (
            <div className="space-y-1.5">
              <Label htmlFor="c-address">Manzil</Label>
              <Input id="c-address" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" placeholder="Shahar, ko'cha, uy, xonadon" aria-invalid={!!errors.address} />
              <Err msg={errors.address} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="c-note">Izoh (ixtiyoriy)</Label>
            <Textarea id="c-note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={300} />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-card p-5">
          <h2 className="text-lg font-semibold">3. To&apos;lov usuli</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PAYMENTS.map((p) => (
              <label key={p.id} className={choice(payment === p.id)}>
                <input type="radio" name="payment" className="mt-1 accent-[hsl(var(--primary))]" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                <p.icon className="mt-0.5 h-5 w-5 text-primary" />
                <span>
                  <span className="block font-medium">{p.label}</span>
                  <span className="text-xs text-muted-foreground">{p.hint}</span>
                </span>
              </label>
            ))}
          </div>

          {payment === "card" && (
            <div className="space-y-4 rounded-xl border bg-muted/40 p-4">
              <div className="space-y-1.5">
                <Label htmlFor="cc-number">Karta raqami</Label>
                <Input id="cc-number" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" aria-invalid={!!errors.cardNumber} />
                <Err msg={errors.cardNumber} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cc-holder">Karta egasi</Label>
                <Input id="cc-holder" value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value.toUpperCase() })} autoComplete="cc-name" placeholder="ISM FAMILIYA" aria-invalid={!!errors.cardHolder} />
                <Err msg={errors.cardHolder} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cc-exp">Amal qilish muddati</Label>
                  <Input id="cc-exp" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" aria-invalid={!!errors.cardExpiry} />
                  <Err msg={errors.cardExpiry} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cc-cvc">CVC</Label>
                  <Input id="cc-cvc" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })} inputMode="numeric" autoComplete="cc-csc" placeholder="123" type="password" aria-invalid={!!errors.cardCvc} />
                  <Err msg={errors.cardCvc} />
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Demo rejim: karta faqat brauzerda tekshiriladi, serverga yuborilmaydi va saqlanmaydi. Sinov uchun: 4242 4242 4242 4242
              </p>
            </div>
          )}
          {(payment === "click" || payment === "payme") && (
            <p className="flex items-start gap-2 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Demo rejim: haqiqiy {payment === "click" ? "Click" : "Payme"} ga yo&apos;naltirilmaydi, buyurtma &quot;to&apos;langan&quot; deb belgilanadi.
            </p>
          )}
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Buyurtmangiz</h2>
        <ul className="space-y-2">
          {lines.map((l) => (
            <li key={l.productId} className="flex items-center gap-3 text-sm">
              <ProductTile emoji={l.emoji} hue={l.hue} size="sm" />
              <span className="min-w-0 flex-1 truncate">
                {l.name} <span className="text-muted-foreground">× {l.qty}</span>
              </span>
              <span className="tabular-nums">{formatPrice(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <PromoBox />
        <CartSummary totals={totals} />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          {payment === "cash" ? "Buyurtmani tasdiqlash" : `${formatPrice(totals.total)} to'lash`}
        </Button>
        <p className="text-center text-xs text-muted-foreground">Narxlar buyurtma paytida serverda qayta tekshiriladi.</p>
      </aside>
    </form>
  );
}
