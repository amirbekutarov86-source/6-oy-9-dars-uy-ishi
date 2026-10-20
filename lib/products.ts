import type { Product } from "./types";

/**
 * Boshlang'ich mahsulotlar (rasmdagi jadval).
 * Narx / nom / zaxirani shu yerdan o'zgartirsangiz bo'ladi.
 * Eslatma: bazada `data/db.json` bo'lsa, o'zgarish ko'rinishi uchun uni o'chiring.
 */
const created = "2026-01-01T00:00:00.000Z";

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p-uzum",
    name: "Uzum",
    price: 5000,
    emoji: "🍇",
    hue: 280,
    stock: 120,
    description: "Shirin va mazali yangi uzilgan uzum. Narx 1 kg uchun.",
    builtIn: true,
    createdAt: created,
  },
  {
    id: "p-washing-machine",
    name: "Washing machine",
    price: 5000000,
    emoji: "🧺",
    hue: 205,
    stock: 8,
    description: "7 kg yuklama, 1200 aylanish, kam energiya sarflaydigan kir yuvish mashinasi.",
    builtIn: true,
    createdAt: created,
  },
  {
    id: "p-toaster",
    name: "Toaster",
    price: 200000,
    emoji: "🍞",
    hue: 32,
    stock: 25,
    description: "Ikki tilimli toster: 7 daraja qizdirish, tez va bir tekis pishirish.",
    builtIn: true,
    createdAt: created,
  },
  {
    id: "p-laptop",
    name: "laptop",
    price: 10000000,
    emoji: "💻",
    hue: 222,
    stock: 6,
    description: "15.6\" ekran, 16 GB RAM, 512 GB SSD. Ish va o'qish uchun yengil noutbuk.",
    builtIn: true,
    createdAt: created,
  },
  {
    id: "p-computer",
    name: "Computer",
    price: 1000000,
    emoji: "🖥️",
    hue: 160,
    stock: 14,
    description: "Uy va ofis uchun ixcham stol kompyuteri. Monitor alohida sotiladi.",
    builtIn: true,
    createdAt: created,
  },
];
