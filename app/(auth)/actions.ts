"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { clearSession, hashPassword, setSession, verifyPassword } from "@/lib/auth";
import { addUser, findUserByEmail } from "@/lib/repo";
import { isEmail } from "@/lib/validators";

export type AuthState = { error?: string } | undefined;

function safeNext(raw: FormDataEntryValue | null): string {
  const v = typeof raw === "string" ? raw : "";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/products";
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (name.length < 2) return { error: "Ismingizni kiriting" };
  if (!isEmail(email)) return { error: "Email noto'g'ri" };
  if (password.length < 6) return { error: "Parol kamida 6 belgi bo'lsin" };

  const id = randomUUID();
  const created = await addUser({ id, name, email, passwordHash: hashPassword(password), createdAt: new Date().toISOString() });
  if (!created) return { error: "Bu email allaqachon ro'yxatdan o'tgan" };
  await setSession(id);
  redirect(safeNext(formData.get("next")));
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) return { error: "Email yoki parol noto'g'ri" };
  await setSession(user.id);
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}
