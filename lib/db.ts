import { promises as fs } from "fs";
import path from "path";
import { SEED_PRODUCTS } from "./products";
import type { Db } from "./types";

/**
 * Nol sozlamali lokal "baza": ma'lumotlar `data/db.json` faylida saqlanadi.
 * Faqat serverda ishlaydi. Productionda (Vercel kabi read-only hosting) haqiqiy bazaga almashtiring.
 */
const FILE = path.join(process.cwd(), "data", "db.json");

let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Db> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8")) as Partial<Db>;
    return {
      users: parsed.users ?? [],
      products: parsed.products ?? [],
      orders: parsed.orders ?? [],
    };
  } catch {
    return { users: [], products: SEED_PRODUCTS.map((p) => ({ ...p })), orders: [] };
  }
}

async function save(db: Db): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  const tmp = `${FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

export async function readDb(): Promise<Db> {
  await queue.catch(() => undefined);
  return load();
}

/** Yozishlar ketma-ket bajariladi, shuning uchun bir vaqtda kelgan so'rovlar bir-birini buzmaydi */
export function mutateDb<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.catch(() => undefined).then(async () => {
    const db = await load();
    const result = await fn(db);
    await save(db);
    return result;
  });
  queue = run;
  return run;
}
