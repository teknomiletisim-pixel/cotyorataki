"use client";

import { useEffect, useState } from "react";
import { formatTRY } from "@/lib/pricing";

export default function GoldPricePage() {
  const [price, setPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/gold-price")
      .then((r) => r.json())
      .then((d) => {
        setCurrentPrice(d.pricePerGram);
        setPrice(String(d.pricePerGram));
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/gold-price", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pricePerGram: parseFloat(price) }),
    });
    setSaving(false);
    if (res.ok) {
      setCurrentPrice(parseFloat(price));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="font-serif text-2xl text-neutral-900 mb-2">Güncel Gram Altın Fiyatı</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Bu değeri değiştirdiğinizde, tüm ürünlerin fiyatı otomatik olarak
        (gram altın miktarı × bu fiyat + işçilik) formülüyle yeniden hesaplanır.
      </p>

      {currentPrice !== null && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-neutral-600">Şu anki fiyat</p>
          <p className="text-2xl font-semibold text-amber-900">{formatTRY(currentPrice)} / gram</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="number"
          step="0.01"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="flex-1 border border-neutral-200 rounded-lg px-4 py-2 outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-medium px-6 py-2 rounded-full"
        >
          {saving ? "Kaydediliyor..." : "Güncelle"}
        </button>
      </form>
      {saved && <p className="text-sm text-green-600 mt-2">Fiyat güncellendi ✓</p>}
    </div>
  );
}
