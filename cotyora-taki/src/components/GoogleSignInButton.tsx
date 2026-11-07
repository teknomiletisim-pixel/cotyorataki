"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.5 15.6 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3c-7.7 0-14.4 4.4-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 36 26.9 37 24 37c-5.2 0-9.6-3.4-11.2-8.1l-6.6 5.1C9.5 40.4 16.2 45 24 45z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.6C39.9 37.1 44 31.5 44 24c0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export default function GoogleSignInButton({ callbackUrl }: { callbackUrl: string }) {
  // NextAuth'un yerleşik /api/auth/providers uç noktasından, Google girişinin
  // gerçekten yapılandırılıp yapılandırılmadığını kontrol ediyoruz. Böylece
  // .env.local'da GOOGLE_CLIENT_ID/SECRET girilmediyse buton hiç görünmez.
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((data) => setAvailable(!!data?.google))
      .catch(() => setAvailable(false));
  }, []);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() =>
        signIn("google", {
          callbackUrl: `/giris-yonlendir?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        })
      }
      className="w-full flex items-center justify-center gap-3 border border-white/15 hover:bg-neutral-950 text-neutral-300 font-medium py-3 rounded-full transition-colors"
    >
      <GoogleLogo />
      Google ile Devam Et
    </button>
  );
}
