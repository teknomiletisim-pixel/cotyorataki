"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["Yüzük", "Kolye", "Bileklik", "Küpe", "Set"] as const;

export default function HomePage() {
  const { products, productsLoading } = useApp();
  const bestSellers = products.filter((p) => p.bestSeller);

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-b from-amber-50 to-neutral-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-amber-600 tracking-[0.3em] text-xs md:text-sm font-medium mb-4">
            EL İŞÇİLİĞİ · ÖZEL TASARIM
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-neutral-900 mb-6">
            COTYORA TAKI
          </h1>
          <p className="text-neutral-600 max-w-xl mx-auto mb-8">
            Sizin için özel olarak tasarlanan ve üretilen, zamana meydan okuyan takılar.
          </p>
          <Link
            href="/katalog"
            className="inline-block bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            Kataloğu Keşfet
          </Link>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-serif text-2xl text-neutral-900 mb-6 text-center">Kategoriler</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/katalog?kategori=${encodeURIComponent(cat)}`}
              className="bg-white border border-neutral-100 rounded-xl p-6 text-center hover:shadow-md hover:border-amber-200 transition-all"
            >
              <span className="font-medium text-neutral-800">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {productsLoading ? (
        <p className="text-center text-neutral-400 py-16">Ürünler yükleniyor...</p>
      ) : (
        <>
          {/* ÇOK SATANLAR */}
          {bestSellers.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-neutral-900">Çok Satanlar</h2>
                <Link href="/katalog?filter=cok-satanlar" className="text-amber-700 text-sm font-medium hover:underline">
                  Tümünü Gör →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {bestSellers.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* TÜM ÜRÜNLER ÖNİZLEME */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-neutral-900">Yeni Gelenler</h2>
              <Link href="/katalog" className="text-amber-700 text-sm font-medium hover:underline">
                Tüm Katalog →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
