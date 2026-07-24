"use client";

import { Suspense, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/hesabim";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    // Tek giriş menüsü: admin e-postasıyla girilirse yönetim paneline,
    // müşteri girişinde ise hesabım / callbackUrl'e yönlendirilir.
    const session = await getSession();
    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push(callbackUrl);
    }
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-neutral-900 mb-2">Giriş Yap</h1>
      <p className="text-neutral-500 text-sm mb-8">
        Hesabınıza giriş yaparak siparişlerinizi takip edebilirsiniz.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-neutral-600 block mb-1">E-posta</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-600 block mb-1">Şifre</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-amber-400 font-medium py-3 rounded-full"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <p className="text-sm text-neutral-500 mt-6 text-center">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="text-amber-700 font-medium hover:underline">
          Hemen kayıt olun
        </Link>
      </p>
    </div>
  );
}
