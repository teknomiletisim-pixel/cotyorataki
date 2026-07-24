"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";

const CATEGORIES = ["Yüzük", "Kolye", "Bileklik", "Küpe", "Set"] as const;

// Kategori kartlarının arka plan sırası: beyaz - sarı - siyah döngüsü
const CATEGORY_STYLES = [
  { bg: "bg-white border border-neutral-100", text: "text-neutral-800", sub: "text-neutral-500" },
  { bg: "bg-amber-400", text: "text-black", sub: "text-black/70" },
  { bg: "bg-black", text: "text-white", sub: "text-white/60" },
];

export default function HomePage() {
  const { products, productsLoading, activeSpecialDay } = useApp();
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const newArrivals = products.slice(0, 4);

  // "Sizin İçin Seçtiklerimiz": diğer iki bölümde gösterilmeyen ürünlerden bir seçki
  const pickedForYou = useMemo(() => {
    const shownIds = new Set([...bestSellers, ...newArrivals].map((p) => p.id));
    const rest = products.filter((p) => !shownIds.has(p.id));
    return rest.slice(0, 4).length > 0 ? rest.slice(0, 4) : products.slice(0, 4);
  }, [products, bestSellers, newArrivals]);

  return (
    <div>
      {/* HERO CAROUSEL */}
      <HeroCarousel products={products.length ? products : []} activeSpecialDay={activeSpecialDay} />

      {/* KATEGORİLER */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-serif text-2xl text-neutral-900 mb-6 text-center">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat, i) => {
            const style = CATEGORY_STYLES[i % CATEGORY_STYLES.length];
            return (
              <Link
                key={cat}
                href={`/katalog?kategori=${encodeURIComponent(cat)}`}
                className={`${style.bg} rounded-xl p-6 text-center hover:opacity-90 hover:shadow-md transition-all`}
              >
                <span className={`font-medium ${style.text} block`}>{cat}</span>
                <span className={`text-xs mt-1 block ${style.sub}`}>Tümü · Gümüş · Altın</span>
              </Link>
            );
          })}
        </div>
      </section>

      {productsLoading ? (
        <p className="text-center text-neutral-400 py-16">Ürünler yükleniyor...</p>
      ) : (
        <>
          {/* ÇOK SATANLAR + YENİ GELENLER — yan yana */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-10">
              {/* ÇOK SATANLAR */}
              {bestSellers.length > 0 && (
                <div className="flex flex-col">
                  <h2 className="font-serif text-2xl text-neutral-900 mb-6">Çok Satanlar</h2>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                    {bestSellers.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  <Link
                    href="/katalog?filter=cok-satanlar"
                    className="mt-5 text-center text-amber-700 text-sm font-medium hover:underline"
                  >
                    Tümünü Gör →
                  </Link>
                </div>
              )}

              {/* YENİ GELENLER */}
              <div className="flex flex-col">
                <h2 className="font-serif text-2xl text-neutral-900 mb-6">Yeni Gelenler</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                  {newArrivals.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <Link
                  href="/katalog"
                  className="mt-5 text-center text-amber-700 text-sm font-medium hover:underline"
                >
                  Tümünü Gör →
                </Link>
              </div>
            </div>
          </section>

          {/* SİZİN İÇİN SEÇTİKLERİMİZ */}
          {pickedForYou.length > 0 && (
            <section className="bg-black py-12">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-white">Sizin İçin Seçtiklerimiz</h2>
                  <Link href="/katalog" className="text-amber-400 text-sm font-medium hover:underline">
                    Tümünü Gör →
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {pickedForYou.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
