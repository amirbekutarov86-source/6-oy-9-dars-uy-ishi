import type { DeliveryMethod, PaymentMethod } from "./types";

export const PAYMENT_METHODS: PaymentMethod[] = ["cash", "card", "click", "payme"];
export const DELIVERY_METHODS: DeliveryMethod[] = ["pickup", "delivery"];

export type CheckoutInput = {
  name: string;
  phone: string;
  address: string;
  note: string;
  delivery: DeliveryMethod;
  payment: PaymentMethod;
  promo: string;
};

export type FieldErrors = Partial<Record<string, string>>;

export function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, "");
}

/** O'zbekiston raqami: +998901234567 yoki 901234567 */
export function isValidPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 9 || (digits.length === 12 && digits.startsWith("998"));
}

export function validateCheckout(input: CheckoutInput): FieldErrors {
  const e: FieldErrors = {};
  if (input.name.trim().length < 2) e.name = "Ismingizni kiriting";
  if (!isValidPhone(input.phone)) e.phone = "Telefon raqami noto'g'ri (masalan: +998 90 123 45 67)";
  if (input.delivery === "delivery" && input.address.trim().length < 5) e.address = "Yetkazish manzilini kiriting";
  if (!DELIVERY_METHODS.includes(input.delivery)) e.delivery = "Yetkazish turini tanlang";
  if (!PAYMENT_METHODS.includes(input.payment)) e.payment = "To'lov turini tanlang";
  return e;
}

export function luhnValid(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s+/g, "");
  if (!/^\d{16}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function validateCard(card: { number: string; holder: string; expiry: string; cvc: string }): FieldErrors {
  const e: FieldErrors = {};
  if (!luhnValid(card.number)) e.cardNumber = "Karta raqami noto'g'ri (16 raqam)";
  if (card.holder.trim().length < 3) e.cardHolder = "Karta egasining ismi";
  const m = /^(\d{2})\/(\d{2})$/.exec(card.expiry);
  if (!m) e.cardExpiry = "MM/YY";
  else {
    const month = Number(m[1]);
    const year = 2000 + Number(m[2]);
    const now = new Date();
    const expired = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
    if (month < 1 || month > 12 || expired) e.cardExpiry = "Muddati noto'g'ri";
  }
  if (!/^\d{3}$/.test(card.cvc)) e.cardCvc = "3 raqam";
  return e;
}

export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}
