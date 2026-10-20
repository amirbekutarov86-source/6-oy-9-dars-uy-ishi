import mongoose, { Schema, type Model } from "mongoose";
import type { Order, Product, StoredUser } from "@/lib/types";

// Har bir kolleksiya alohida: products, users, orders.
// `id` — o'zimiz beradigan string identifikator (Mongo `_id` ishlatilmaydi).
const opts = { versionKey: false } as const;

const productSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    emoji: { type: String, required: true },
    hue: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, default: "" },
    builtIn: { type: Boolean, default: false },
    createdAt: { type: String, required: true },
  },
  { ...opts, collection: "products" },
);

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { ...opts, collection: "users" },
);

const orderSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, default: null, index: true },
    items: [{ _id: false, productId: String, name: String, price: Number, qty: Number }],
    customer: { name: String, phone: String, address: String, note: String },
    delivery: { type: String, required: true },
    payment: { method: String, status: String },
    promo: { type: String, default: null },
    subtotal: Number,
    discount: Number,
    shipping: Number,
    total: Number,
    status: { type: String, default: "new" },
    createdAt: { type: String, required: true },
  },
  { ...opts, collection: "orders" },
);

function model<T>(name: string, schema: Schema<T>): Model<T> {
  return (mongoose.models[name] as Model<T> | undefined) ?? mongoose.model<T>(name, schema);
}

export const ProductModel = model<Product>("Product", productSchema as unknown as Schema<Product>);
export const UserModel = model<StoredUser>("User", userSchema as unknown as Schema<StoredUser>);
export const OrderModel = model<Order>("Order", orderSchema as unknown as Schema<Order>);
