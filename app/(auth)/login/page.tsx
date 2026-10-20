import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kirish" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [{ next }, user] = await Promise.all([searchParams, getCurrentUser()]);
  const safe = next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;
  if (user) redirect(safe ?? "/products");
  return (
    <>
      <h1 className="font-serif text-2xl font-bold">Kirish</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">Hisobingizga kiring</p>
      <AuthForm mode="login" next={safe} />
    </>
  );
}
