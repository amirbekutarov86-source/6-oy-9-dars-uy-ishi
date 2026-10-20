# AGENTS.md

Ushbu fayl loyiha ustida ishlaydigan AI yordamchilar (va yangi dasturchilar) uchun qisqa qo'llanma.

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v3 + shadcn/ui uslubidagi komponentlar (`components/ui`)
- Zustand (`store/`) — savat holati (localStorage'da saqlanadi)
- MongoDB (mongoose, `models/`) — asosiy baza; ulanmasa lokal JSON zaxira (`data/db.json`, `lib/db.ts`)

## Tuzilma
- `app/` — sahifalar va API route'lar (`app/api/*`), `app/(auth)` — login/register
- `components/` — `header.tsx`, `Drawer.tsx`, `images-section.tsx`, `products-table.tsx` va boshqalar
- `lib/` — yordamchi kod. `lib/db.ts` va `lib/auth.ts` faqat serverda ishlaydi (client komponentdan import qilmang)

## Qoidalar
- Buyurtma narxi har doim serverda `lib/pricing.ts` orqali qayta hisoblanadi — klientdan kelgan narxga ishonmang.
- To'lov — DEMO. Karta ma'lumotlari brauzerda tekshiriladi, serverga yuborilmaydi va saqlanmaydi.
- Persist qilingan store qiymatlarini faqat `useHydrated()` dan keyin ko'rsating (hydration xatosidan saqlanish uchun).
- Next.js 15: `params`, `searchParams`, `cookies()` — async.

## Ma'lumotlar bazasi
- `lib/repo.ts` — yagona qatlam. `MONGODB_URI` ulansa MongoDB (`models/index.ts`: products, users, orders), aks holda `data/db.json`.
- Sahifa/API kodi `lib/db.ts` yoki `models/` dan to'g'ridan-to'g'ri emas, faqat `lib/repo.ts` orqali ishlasin.
