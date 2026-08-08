"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { calculatePrice, formatTRY } from "@/lib/pricing";

// Bu sayfa statik yazılar yerine, kataloğunuzdaki ürünleri otomatik olarak
// görsel + güncel fiyat bilgisiyle listeler. Yeni ürün ekledikçe veya
// düzenledikçe burası da otomatik güncellenir, ayrıca bir şey yapmanıza gerek yok.
export default function BlogPage() {
  const { products, productsLoading, goldPricePerGram, activeSpecialDay } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 py-14">
      <h1 className="font-serif text-3xl text-white mb-2">Atölyeden</h1>
      <p className="text-neutral-400 mb-10">
        Atölyemizde ürettiğimiz parçalardan ve güncel koleksiyonumuzdan seçkiler.
      </p>

      {productsLoading ? (
        <p className="text-neutral-400 text-center py-16">Yükleniyor...</p>
      ) : (
        <div className="space-y-10">
          {products.map((p) => {
            const basePrice = calculatePrice(p, goldPricePerGram);
            const price = activeSpecialDay
              ? Math.round(basePrice * (1 - activeSpecialDay.discountRate))
              : basePrice;

            return (
              <Link
                key={p.id}
                href={`/urun/${p.slug}`}
                className="flex flex-col sm:flex-row gap-6 bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative w-full sm:w-64 aspect-square shrink-0 bg-neutral-950">
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 256px"
                  />
                </div>
                <div className="p-5 sm:py-6 flex-1">
                  <p className="text-xs text-amber-600 font-medium">{p.category}</p>
                  <h2 className="font-serif text-xl text-white mt-1">{p.name}</h2>
                  <p className="text-neutral-400 text-sm mt-2 leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                  <p className="font-semibold text-white mt-3">{formatTRY(price)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
