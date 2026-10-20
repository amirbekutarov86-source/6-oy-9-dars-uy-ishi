import Link from "next/link";
import { CreditCard, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { ImagesSection } from "@/components/images-section";
import { Button } from "@/components/ui/button";
import { listProducts } from "@/lib/repo";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: ShoppingCart, title: "Qulay savat", text: "Mahsulotlarni bir bosishda qo'shing, sonini o'zgartiring, promokod ishlating." },
  { icon: CreditCard, title: "Turli to'lov usullari", text: "Naqd pul, bank kartasi, Click va Payme (demo rejimda)." },
  { icon: Truck, title: "Tez yetkazib berish", text: "3 000 000 so'mdan yuqori buyurtmalar uchun yetkazish bepul." },
  { icon: ShieldCheck, title: "Xavfsiz buyurtma", text: "Narxlar serverda qayta tekshiriladi, karta ma'lumotlari saqlanmaydi." },
];

export default async function HomePage() {
  const products = await listProducts();
  return (
    <>
      <section className="brand-gradient dot-grid">
        <div className="container py-16 text-center md:py-24">
          <h1 className="font-serif text-4xl font-bold text-white drop-shadow-sm md:text-6xl">Kerakli hamma narsa — bir joyda</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">Mahsulotlarni tanlang, savatga soling va bir necha daqiqada to&apos;lang.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full bg-white text-foreground shadow-md hover:bg-white/90">
              <Link href="/products">Mahsulotlarni ko&apos;rish</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/70 bg-transparent text-white hover:bg-white/15 hover:text-white">
              <Link href="/cart">Savatga o&apos;tish</Link>
            </Button>
          </div>
        </div>
      </section>

      <ImagesSection products={products} />

      <section className="container pb-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-5 shadow-sm">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
