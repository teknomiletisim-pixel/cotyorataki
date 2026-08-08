"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart, ShoppingBag, User, Search, Menu, X, ShieldCheck } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Header() {
  const { favorites, cart } = useApp();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "admin";
  const accountHref = status === "authenticated" ? "/hesabim" : "/giris";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/katalog?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <span className="font-serif text-2xl tracking-[0.2em] text-white">
            COTYORA <span className="text-amber-500">TAKI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-300 font-medium">
          <Link href="/katalog" className="hover:text-amber-400">Katalog</Link>
          <Link href="/katalog?filter=cok-satanlar" className="hover:text-amber-400">Çok Satanlar</Link>
          {isAdmin ? (
            <Link href="/admin" className="hover:text-amber-400 flex items-center gap-1">
              <ShieldCheck size={16} /> Yönetim Paneli
            </Link>
          ) : (
            <Link href={accountHref} className="hover:text-amber-400">
              {status === "authenticated" ? "Hesabım" : "Giriş Yap"}
            </Link>
          )}
        </nav>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-sm border border-white/15 rounded-full px-3 py-1.5"
        >
          <Search size={16} className="text-neutral-500 mr-2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full text-sm outline-none bg-transparent text-white placeholder-neutral-500"
          />
        </form>

        <div className="flex items-center gap-4">
          <Link href="/favorilerim" className="relative text-neutral-300 hover:text-amber-400">
            <Heart size={22} />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>
          <Link href="/sepetim" className="relative text-neutral-300 hover:text-amber-400">
            <ShoppingBag size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
          <Link href={isAdmin ? "/admin" : accountHref} className="hidden md:block text-neutral-300 hover:text-amber-400">
            <User size={22} />
          </Link>
          <button
            className="md:hidden text-neutral-300"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menü"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="flex items-center border border-white/15 rounded-full px-3 py-1.5">
            <Search size={16} className="text-neutral-500 mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full text-sm outline-none bg-transparent text-white placeholder-neutral-500"
            />
          </form>
          <nav className="flex flex-col gap-2 text-sm text-neutral-300 font-medium">
            <Link href="/katalog" onClick={() => setMenuOpen(false)}>Katalog</Link>
            <Link href="/katalog?filter=cok-satanlar" onClick={() => setMenuOpen(false)}>Çok Satanlar</Link>
            {isAdmin ? (
              <Link href="/admin" onClick={() => setMenuOpen(false)}>Yönetim Paneli</Link>
            ) : (
              <Link href={accountHref} onClick={() => setMenuOpen(false)}>
                {status === "authenticated" ? "Hesabım" : "Giriş Yap"}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
