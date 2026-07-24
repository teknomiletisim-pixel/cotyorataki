"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, Check } from "lucide-react";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import { useApp } from "@/context/AppContext";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>(); // route segmenti "id" ama içerik slug
  const router = useRouter();
  const { products, productsLoading, goldPricePerGram, isFavorite, toggleFavorite, addToCart, activeSpecialDay } = useApp();
  const product = products.find((p) => p.slug === params.id);

  const [activeImage, setActiveImage] = useState(0);
  const [customization, setCustomization] = useState<Record<string, string>>({});
  const [customMessage, setCustomMessage] = useState("");
  const [added, setAdded] = useState(false);

  if (productsLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-neutral-400">Yükleniyor...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-neutral-600">Ürün bulunamadı.</p>
      </div>
    );
  }

  const basePrice = calculatePrice(product, goldPricePerGram);
  const finalPrice = activeSpecialDay
    ? Math.round(basePrice * (1 - activeSpecialDay.discountRate))
    : basePrice;
  const fav = isFavorite(product.id);

  function handleAddToCart() {
    if (!product) return;
    addToCart(product.id, customization, customMessage || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      {/* GÖRSELLER */}
      <div>
        <div className="relative aspect-square bg-neutral-50 rounded-xl overflow-hidden">
          <Image
            src={product.images[activeImage]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 mt-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  activeImage === i ? "border-amber-500" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DETAY */}
      <div>
        <p className="text-xs text-amber-600 font-medium">{product.category}</p>
        <div className="flex items-start justify-between gap-4 mt-1">
          <h1 className="font-serif text-3xl text-neutral-900">{product.name}</h1>
          <button
            onClick={() => toggleFavorite(product.id)}
            className="shrink-0 mt-1 p-2 rounded-full border border-neutral-200 hover:border-rose-300"
            aria-label="Favorilere ekle"
          >
            <Heart size={20} className={fav ? "fill-rose-500 text-rose-500" : "text-neutral-400"} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          {activeSpecialDay && (
            <span className="text-neutral-400 line-through">{formatTRY(basePrice)}</span>
          )}
          <span className="text-2xl font-semibold text-neutral-900">{formatTRY(finalPrice)}</span>
          {activeSpecialDay && (
            <span className="bg-rose-100 text-rose-700 text-xs font-medium px-2 py-1 rounded-full">
              %{Math.round(activeSpecialDay.discountRate * 100)} {activeSpecialDay.name} indirimi
            </span>
          )}
        </div>

        <p className="text-neutral-600 mt-4 leading-relaxed">{product.description}</p>

        {/* KİŞİSELLEŞTİRME ALANLARI */}
        {product.customizationFields.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-neutral-800">Ürün Detayları</h3>
            {product.customizationFields.map((field) => (
              <div key={field.key}>
                <label className="text-sm text-neutral-600 block mb-1">{field.label}</label>
                <input
                  value={customization[field.key] ?? ""}
                  onChange={(e) =>
                    setCustomization((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                />
              </div>
            ))}
          </div>
        )}

        {/* ÖZEL MESAJ */}
        {product.allowCustomMessage && (
          <div className="mt-4">
            <label className="text-sm font-medium text-neutral-800 block mb-1">
              Takı Üzerine Özel Mesaj (opsiyonel)
            </label>
            <input
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Örn: Sonsuza Kadar"
              maxLength={30}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <p className="text-xs text-neutral-400 mt-1">En fazla 30 karakter.</p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-black hover:bg-neutral-800 text-amber-400 font-medium py-3 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            {added ? (
              <>
                <Check size={18} /> Sepete Eklendi
              </>
            ) : (
              "Sepete Ekle"
            )}
          </button>
          <button
            onClick={() => router.push("/sepetim")}
            className="flex-1 border-2 border-black text-black hover:bg-black hover:text-amber-400 font-medium py-3 rounded-full transition-colors"
          >
            Sepete Git
          </button>
        </div>
      </div>
    </div>
  );
}
