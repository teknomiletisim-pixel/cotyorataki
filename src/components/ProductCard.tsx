"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { calculatePrice, formatTRY } from "@/lib/pricing";

export default function ProductCard({ product }: { product: Product }) {
  const { goldPricePerGram, isFavorite, toggleFavorite, activeSpecialDay } = useApp();
  const basePrice = calculatePrice(product, goldPricePerGram);
  const finalPrice = activeSpecialDay
    ? Math.round(basePrice * (1 - activeSpecialDay.discountRate))
    : basePrice;
  const fav = isFavorite(product.id);

  return (
    <div className="group relative bg-white rounded-xl border border-neutral-100 hover:shadow-lg transition-shadow overflow-hidden">
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(product.id);
        }}
        className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-2 shadow hover:scale-110 transition-transform"
        aria-label="Favorilere ekle"
      >
        <Heart
          size={18}
          className={fav ? "fill-rose-500 text-rose-500" : "text-neutral-400"}
        />
      </button>

      {product.bestSeller && (
        <span className="absolute top-3 left-3 z-10 bg-amber-600 text-white text-[11px] px-2 py-1 rounded-full">
          Çok Satan
        </span>
      )}

      <Link href={`/urun/${product.slug}`}>
        <div className="relative aspect-square bg-neutral-50">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-amber-600 font-medium">{product.category}</p>
          <h3 className="font-medium text-neutral-800 mt-1">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            {activeSpecialDay && (
              <span className="text-xs text-neutral-400 line-through">
                {formatTRY(basePrice)}
              </span>
            )}
            <span className="font-semibold text-neutral-900">
              {formatTRY(finalPrice)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
