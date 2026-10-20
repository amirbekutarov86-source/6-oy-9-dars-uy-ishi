"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, registerAction, type AuthState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === "login" ? loginAction : registerAction, undefined);
  const isLogin = mode === "login";

  return (
    <form action={action} className="space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      {!isLogin && (
        <div className="space-y-1.5">
          <Label htmlFor="name">Ism</Label>
          <Input id="name" name="name" autoComplete="name" required minLength={2} placeholder="Ismingiz" />
        </div>
      )}
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="siz@example.com" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Parol</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          minLength={isLogin ? 1 : 6}
          placeholder={isLogin ? "Parolingiz" : "Kamida 6 belgi"}
        />
      </div>
      {state?.error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />} {isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {isLogin ? "Akkauntingiz yo'qmi?" : "Akkauntingiz bormi?"}{" "}
        <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-primary hover:underline">
          {isLogin ? "Ro'yxatdan o'tish" : "Kirish"}
        </Link>
      </p>
    </form>
  );
}
