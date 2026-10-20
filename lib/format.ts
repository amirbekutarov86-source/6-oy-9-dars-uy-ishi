/** 10000000 -> "10 000 000 so'm" (har doim bir xil, server va brauzerda farq qilmaydi) */
export function formatNumber(n: number): string {
  const sign = n < 0 ? "-" : "";
  const s = Math.round(Math.abs(n)).toString();
  return sign + s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatPrice(n: number): string {
  return `${formatNumber(n)} so'm`;
}

const MONTHS = ["yan", "fev", "mar", "apr", "may", "iyun", "iyul", "avg", "sen", "okt", "noy", "dek"];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const PAYMENT_LABEL = {
  cash: "Naqd pul (yetkazilganda)",
  card: "Bank kartasi",
  click: "Click",
  payme: "Payme",
} as const;

export const DELIVERY_LABEL = {
  pickup: "Olib ketish (bepul)",
  delivery: "Yetkazib berish",
} as const;
