import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Drawer } from "@/components/Drawer";
import { Header } from "@/components/header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Shop — Products page", template: "%s | Shop" },
  description: "Mahsulotlar jadvali, savat va to'lov — zamonaviy onlayn do'kon.",
  openGraph: { title: "Shop", description: "Onlayn do'kon: mahsulotlar, savat, to'lov.", type: "website" },
};

export const viewport: Viewport = { themeColor: "#f97316" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <html lang="uz">
      <body className="flex min-h-screen flex-col">
        <Header user={user} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Drawer user={user} />
        <Toaster />
      </body>
    </html>
  );
}
