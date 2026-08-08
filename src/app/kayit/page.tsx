"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Kayıt sırasında bir hata oluştu.");
      setLoading(false);
      return;
    }

    // Kayıt sonrası otomatik giriş
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    router.push("/hesabim");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-white mb-2">Hesap Oluştur</h1>
      <p className="text-neutral-400 text-sm mb-8">
        Siparişlerinizi kolayca takip etmek için hesap oluşturun.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-neutral-400 block mb-1">Ad</label>
            <input
              required
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-400 block mb-1">Soyad</label>
            <input
              required
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-neutral-400 block mb-1">E-posta</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Telefon</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Adres</label>
          <textarea
            rows={2}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Şifre</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
          <p className="text-xs text-neutral-400 mt-1">En az 6 karakter.</p>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-amber-400 font-medium py-3 rounded-full"
        >
          {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-xs text-neutral-400">veya</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      <GoogleSignInButton callbackUrl="/hesabim" />

      <p className="text-sm text-neutral-400 mt-6 text-center">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="text-amber-400 font-medium hover:underline">
          Giriş yapın
        </Link>
      </p>
    </div>
  );
}
