import { connectMongo, hasMongoUri } from "./mongo";
import { mutateDb, readDb } from "./db";
import { SEED_PRODUCTS } from "./products";
import { OrderModel, ProductModel, UserModel } from "@/models";
import type { Order, Product, StoredUser } from "./types";

/**
 * Yagona ma'lumotlar qatlami.
 * 1) MONGODB_URI bo'lsa va ulanish bo'lsa -> MongoDB (products, users, orders kolleksiyalari)
 * 2) aks holda -> lokal `data/db.json` (konsolda ogohlantirish chiqadi)
 * Sahifa va API kodi faqat shu fayldagi funksiyalarni ishlatadi.
 */
type Backend = "mongo" | "json";

const g = globalThis as unknown as { __shopBackend?: Promise<Backend> };

function backend(): Promise<Backend> {
  g.__shopBackend ??= (async (): Promise<Backend> => {
    if (!hasMongoUri()) {
      console.warn("[shop] MONGODB_URI yo'q — lokal JSON baza (data/db.json) ishlatilmoqda.");
      return "json";
    }
    try {
      await connectMongo();
      await seedMongo();
      console.log("[shop] MongoDB ulandi.");
      return "mongo";
    } catch (e) {
      console.warn(`[shop] MongoDB'ga ulanib bo'lmadi (${(e as Error).message}). Lokal JSON baza ishlatilmoqda.`);
      return "json";
    }
  })();
  return g.__shopBackend;
}

async function seedMongo() {
  if ((await ProductModel.estimatedDocumentCount()) === 0) {
    await ProductModel.insertMany(SEED_PRODUCTS.map((p) => ({ ...p })));
  }
}

export async function activeBackend(): Promise<Backend> {
  return backend();
}

const plain = <T extends object>(doc: T | null): T | null => {
  if (!doc) return null;
  const { _id, ...rest } = doc as T & { _id?: unknown };
  void _id;
  return rest as T;
};

// ---------- products ----------
export async function listProducts(): Promise<Product[]> {
  if ((await backend()) === "mongo") {
    const docs = await ProductModel.find().sort({ createdAt: 1 }).lean();
    return docs.map((d) => plain(d) as Product);
  }
  const db = await readDb();
  return db.products;
}

export async function getProduct(id: string): Promise<Product | null> {
  if ((await backend()) === "mongo") return plain(await ProductModel.findOne({ id }).lean()) as Product | null;
  return (await readDb()).products.find((p) => p.id === id) ?? null;
}

export async function addProduct(p: Product): Promise<void> {
  if ((await backend()) === "mongo") {
    await ProductModel.create(p);
    return;
  }
  await mutateDb((db) => {
    db.products.push(p);
  });
}

/** Faqat foydalanuvchi qo'shgan (builtIn bo'lmagan) mahsulotlar o'chiriladi */
export async function removeProduct(id: string): Promise<"ok" | "missing" | "builtin"> {
  const p = await getProduct(id);
  if (!p) return "missing";
  if (p.builtIn) return "builtin";
  if ((await backend()) === "mongo") {
    await ProductModel.deleteOne({ id });
    return "ok";
  }
  await mutateDb((db) => {
    db.products = db.products.filter((x) => x.id !== id);
  });
  return "ok";
}

/** Zaxirani atomik kamaytiradi. Biror mahsulot yetmasa, hammasi qaytariladi. */
export async function reserveStock(items: { productId: string; qty: number }[]): Promise<{ ok: true } | { ok: false; error: string }> {
  if ((await backend()) === "mongo") {
    const done: { productId: string; qty: number }[] = [];
    for (const it of items) {
      const res = await ProductModel.findOneAndUpdate({ id: it.productId, stock: { $gte: it.qty } }, { $inc: { stock: -it.qty } }, { new: true }).lean();
      if (!res) {
        await releaseStock(done);
        const p = await getProduct(it.productId);
        return { ok: false, error: p ? `"${p.name}" omborda yetarli emas (mavjud: ${p.stock})` : "Mahsulot topilmadi" };
      }
      done.push(it);
    }
    return { ok: true };
  }
  return mutateDb((db) => {
    for (const it of items) {
      const p = db.products.find((x) => x.id === it.productId);
      if (!p) return { ok: false as const, error: "Mahsulot topilmadi" };
      if (p.stock < it.qty) return { ok: false as const, error: `"${p.name}" omborda yetarli emas (mavjud: ${p.stock})` };
    }
    for (const it of items) db.products.find((x) => x.id === it.productId)!.stock -= it.qty;
    return { ok: true as const };
  });
}

export async function releaseStock(items: { productId: string; qty: number }[]): Promise<void> {
  if (items.length === 0) return;
  if ((await backend()) === "mongo") {
    await Promise.all(items.map((it) => ProductModel.updateOne({ id: it.productId }, { $inc: { stock: it.qty } })));
    return;
  }
  await mutateDb((db) => {
    for (const it of items) {
      const p = db.products.find((x) => x.id === it.productId);
      if (p) p.stock += it.qty;
    }
  });
}

// ---------- users ----------
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const e = email.trim().toLowerCase();
  if ((await backend()) === "mongo") return plain(await UserModel.findOne({ email: e }).lean()) as StoredUser | null;
  return (await readDb()).users.find((u) => u.email === e) ?? null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  if ((await backend()) === "mongo") return plain(await UserModel.findOne({ id }).lean()) as StoredUser | null;
  return (await readDb()).users.find((u) => u.id === id) ?? null;
}

/** false qaytaradi, agar email band bo'lsa */
export async function addUser(u: StoredUser): Promise<boolean> {
  if ((await backend()) === "mongo") {
    try {
      await UserModel.create(u);
      return true;
    } catch (e) {
      if ((e as { code?: number }).code === 11000) return false;
      throw e;
    }
  }
  return mutateDb((db) => {
    if (db.users.some((x) => x.email === u.email)) return false;
    db.users.push(u);
    return true;
  });
}

// ---------- orders ----------
export async function saveOrder(o: Order): Promise<void> {
  if ((await backend()) === "mongo") {
    await OrderModel.create(o);
    return;
  }
  await mutateDb((db) => {
    db.orders.unshift(o);
  });
}

export async function getOrder(id: string): Promise<Order | null> {
  if ((await backend()) === "mongo") return plain(await OrderModel.findOne({ id }).lean()) as Order | null;
  return (await readDb()).orders.find((o) => o.id === id) ?? null;
}

export async function listOrdersByUser(userId: string): Promise<Order[]> {
  if ((await backend()) === "mongo") {
    const docs = await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return docs.map((d) => plain(d) as Order);
  }
  return (await readDb()).orders.filter((o) => o.userId === userId);
}
