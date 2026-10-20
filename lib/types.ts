export type Product = {
  id: string;
  name: string;
  price: number; // so'mda
  emoji: string;
  hue: number; // 0-360, kartochka rangi
  stock: number;
  description: string;
  builtIn: boolean; // boshlang'ich mahsulotlar o'chirilmaydi
  createdAt: string;
};

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type SessionUser = { id: string; name: string; email: string };

export type DeliveryMethod = "pickup" | "delivery";
export type PaymentMethod = "cash" | "card" | "click" | "payme";
export type PaymentStatus = "pending" | "paid";

export type OrderItem = { productId: string; name: string; price: number; qty: number };

export type Order = {
  id: string;
  userId: string | null;
  items: OrderItem[];
  customer: { name: string; phone: string; address: string; note: string };
  delivery: DeliveryMethod;
  payment: { method: PaymentMethod; status: PaymentStatus };
  promo: string | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "new";
  createdAt: string;
};

export type Db = { users: StoredUser[]; products: Product[]; orders: Order[] };

/** Savatdagi qator: narx faqat ko'rsatish uchun, serverda qayta hisoblanadi */
export type CartLine = {
  productId: string;
  name: string;
  price: number;
  emoji: string;
  hue: number;
  qty: number;
};
