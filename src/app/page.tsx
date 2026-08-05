"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Truck, CreditCard, BadgeCheck, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";

// Ana sayfadaki kategori kartları — gerçek katalog kategorilerine ek olarak
// son kart doğrudan Özel Tasarım talep sayfasına yönlendirir.
const CATEGORY_TILES = [
  { label: "Yüzük", href: "/katalog?kategori=Yüzük", image: null as string | null },
  { label: "Kolye", href: "/katalog?kategori=Kolye", image: null },
  { label: "Bileklik", href: "/katalog?kategori=Bileklik", image: null },
  { label: "Küpe", href: "/katalog?kategori=Küpe", image: null },
  { label: "Özel Tasarım", href: "/ozel-tasarim", image: null, special: true },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "%100 Güvenli Alışveriş" },
  { icon: Truck, label: "Ücretsiz Kargo" },
  { icon: CreditCard, label: "Hızlı ve Güvenli Ödeme" },
  { icon: BadgeCheck, label: "Garanti ve İade Kolaylığı" },
];

export default function HomePage() {
  const { products, productsLoading, activeSpecialDay } = useApp();
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const newArrivals = products.slice(0, 4);

  // Kategori kartlarında gösterilecek temsili ürün görseli (o kategoriden ilk ürün)
  const categoryTilesWithImages = useMemo(
    () =>
      CATEGORY_TILES.map((tile) => {
        if (tile.special) return tile;
        const match = products.find((p) => p.category === tile.label);
        return { ...tile, image: match?.images[0] ?? null };
      }),
    [products]
  );

  // "Sizin İçin Seçtiklerimiz": diğer iki bölümde gösterilmeyen ürünlerden bir seçki
  const pickedForYou = useMemo(() => {
    const shownIds = new Set([...bestSellers, ...newArrivals].map((p) => p.id));
    const rest = products.filter((p) => !shownIds.has(p.id));
    return rest.length > 0 ? rest.slice(0, 4) : products.slice(0, 4);
  }, [products, bestSellers, newArrivals]);

  return (
    <div className="bg-neutral-950">
      {/* HERO CAROUSEL */}
      <HeroCarousel products={products} activeSpecialDay={activeSpecialDay} />

      {/* KATEGORİLER */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categoryTilesWithImages.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-amber-400/50 transition-colors"
            >
              {tile.image ? (
                <Image
                  src={tile.image}
                  alt={tile.label}
                  fill
                  className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-amber-400 group-hover:text-black transition-colors">
                <Plus size={14} />
              </span>

              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-serif text-base sm:text-lg">{tile.label}</p>
                <p className="text-amber-400/80 text-xs mt-0.5 flex items-center gap-1">
                  İncele <span aria-hidden>→</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {productsLoading ? (
        <p className="text-center text-neutral-400 py-16">Ürünler yükleniyor...</p>
      ) : (
        <>
          {/* ÇOK SATANLAR + YENİ GELENLER — yan yana */}
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-10">
              {bestSellers.length > 0 && (
                <div className="flex flex-col">
                  <h2 className="font-serif text-2xl text-white mb-6">Çok Satanlar</h2>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                    {bestSellers.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  <Link
                    href="/katalog?filter=cok-satanlar"
                    className="mt-5 text-center text-amber-400 text-sm font-medium hover:underline"
                  >
                    Tümünü Gör →
                  </Link>
                </div>
              )}

              <div className="flex flex-col">
                <h2 className="font-serif text-2xl text-white mb-6">Yeni Gelenler</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1">
                  {newArrivals.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <Link
                  href="/katalog"
                  className="mt-5 text-center text-amber-400 text-sm font-medium hover:underline"
                >
                  Tümünü Gör →
                </Link>
              </div>
            </div>
          </section>

          {/* GÜVEN ROZETLERİ */}
          <section className="border-y border-white/10 mt-8">
            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-neutral-300">
                  <Icon size={22} className="text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SİZİN İÇİN SEÇTİKLERİMİZ */}
          {pickedForYou.length > 0 && (
            <section className="py-14">
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

          {/* ATÖLYE HİKAYESİ */}
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-neutral-900 rounded-2xl overflow-hidden border border-white/10">
              <div className="p-8 sm:p-12">
                <p className="text-amber-400 tracking-[0.25em] text-xs font-medium mb-3">
                  COTYORA TAKI
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-white leading-snug mb-4">
                  Geleneksel Ustalık,
                  <br />
                  Modern Vizyon
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Her bir tasarımımızda, el işçiliğinin zarafetini modern çizgilerle
                  birleştiriyoruz. Cotyora Takı, sadece bir aksesuar değil, bir yaşam
                  biçimidir.
                </p>
                <Link
                  href="/biz-kimiz"
                  className="inline-flex items-center gap-2 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black px-6 py-3 rounded-sm text-sm font-medium tracking-wide transition-colors"
                >
                  HAKKIMIZDA →
                </Link>
              </div>
              <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[260px]">
                <Image
                  src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900&q=80"
                  alt="Atölyemizden bir bakış"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
