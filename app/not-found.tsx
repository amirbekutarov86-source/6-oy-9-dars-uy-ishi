import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-serif text-7xl font-bold text-primary">404</p>
      <h1 className="mt-2 text-2xl font-semibold">Sahifa topilmadi</h1>
      <p className="mt-1 text-muted-foreground">Qidirilgan sahifa mavjud emas yoki ko&apos;chirilgan.</p>
      <Button asChild className="mt-6">
        <Link href="/products">Mahsulotlarga qaytish</Link>
      </Button>
    </div>
  );
}
