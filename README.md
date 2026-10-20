# Shop — Products page (Next.js 15)

Rasmdagi "Products page" asosida qurilgan onlayn do'kon: gradient sarlavha, qidiruv, **Open Drawer**, mahsulotlar jadvali, **savat**, **to'lov**, buyurtmalar, login/register.

## Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda: http://localhost:3000

## MongoDB

`.env` ichida `MONGODB_URI` bor (standart: `mongodb://127.0.0.1:27017/shop`).

- MongoDB o'rnatilgan va yoqilgan bo'lsa — ma'lumotlar 3 ta kolleksiyada saqlanadi: `products`, `users`, `orders`. Birinchi ishga tushishda 5 ta mahsulot avtomatik yoziladi.
- Atlas ishlatsangiz: `MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/shop`
- Ulanib bo'lmasa, konsolda ogohlantirish chiqadi va sayt lokal `data/db.json` faylida ishlaydi (hech narsa o'rnatish shart emas).

## Sahifalar

| Yo'l | Nima |
|---|---|
| `/` | Bosh sahifa (rasmli mahsulotlar bo'limi) |
| `/products` | **Products page** — qidiruv, saralash (Name/Price ustuni), savatga qo'shish |
| `/products/[id]` | Mahsulot sahifasi |
| `/cart` | Savat (soni, promokod: `WELCOME10`, `SALE20`) |
| `/checkout` | To'lov: aloqa, yetkazish, to'lov usuli (naqd / karta / Click / Payme) |
| `/orders`, `/orders/[id]` | Buyurtmalar tarixi va buyurtma cheki |
| `/login`, `/register` | Kirish / ro'yxatdan o'tish |

**Open Drawer** — yon panel: *Savat* va *Mahsulot qo'shish* (tizimga kirgan foydalanuvchi uchun) tablari.

## API

`GET/POST /api/products`, `DELETE /api/products/[id]`, `GET/POST /api/orders`, `GET /api/orders/[id]`

## Muhim

- **To'lov — demo.** Haqiqiy pul yechilmaydi. Karta ma'lumotlari faqat brauzerda tekshiriladi, serverga yuborilmaydi va saqlanmaydi. Sinov kartasi: `4242 4242 4242 4242`.
- Buyurtma narxi serverda bazadagi mahsulotlardan qayta hisoblanadi, ombor soni kamaytiriladi.
- Boshlang'ich mahsulotlarni `lib/products.ts` da o'zgartirish mumkin (baza yaratilgach, o'zgarish ko'rinishi uchun bazadagi `products` kolleksiyasini / `data/db.json` ni tozalang).
- Productionda `.env` dagi `AUTH_SECRET` ni almashtiring.
