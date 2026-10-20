import mongoose from "mongoose";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as unknown as { __shopMongo?: Cache };
const cache: Cache = (g.__shopMongo ??= { conn: null, promise: null });

export const hasMongoUri = () => Boolean(process.env.MONGODB_URI?.trim());

/** MongoDB'ga ulanadi (dev rejimida qayta ulanmaslik uchun keshlanadi). Faqat serverda. */
export async function connectMongo(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI sozlanmagan");
  cache.promise ??= mongoose.connect(uri, { serverSelectionTimeoutMS: 3000, bufferCommands: false });
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }
  return cache.conn;
}
