"use client";

import { useEffect, useState } from "react";
import { formatTRY } from "@/lib/pricing";

type Metal = "gold" | "silver";

const METAL_INFO: Record<Metal, { title: string; short: string; field: "pricePerGram" | "silverPricePerGram" }> = {
  gold: { title: "Gram Altın Fiyatı", short: "altın", field: "pricePerGram" },
  silver: { title: "Gram Gümüş Fiyatı", short: "gümüş", field: "silverPricePerGram" },
};

function PriceCard({
  metal,
  current,
  onSaved,
  warning,
}: {
  metal: Metal;
  current: number | null;
  onSaved: (value: number) => void;
  warning?: string;
}) {
  const info = METAL_INFO[metal];
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (current !== null) setPrice(String(current));
  }, [current]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    const value = parseFloat(price);
    const res = await fetch("/api/admin/gold-price", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [info.field]: value }),
    });
    setSaving(false);
    if (res.ok) {
      onSaved(value);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Kaydedilemedi.");
    }
  }

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-xl p-5">
      <h2 className="font-serif text-lg text-white mb-1">{info.title}</h2>
      <p className="text-xs text-neutral-400 mb-4">
        Değiştirdiğinizde tüm {info.short} ürünlerin fiyatı (gram miktarı × bu fiyat + işçilik) otomatik güncellenir.
      </p>

      {current !== null && (
        <p className="text-2xl font-semibold text-amber-300 mb-4">{formatTRY(current)} / gram</p>
      )}
      {warning && (
        <p className="text-xs text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-lg px-3 py-2 mb-4">
          {warning}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="number"
          step="0.01"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="flex-1 border border-white/15 rounded-lg px-4 py-2 outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-black hover:bg-neutral-800 disabled:opacity-60 text-amber-400 font-medium px-6 py-2 rounded-full"
        >
          {saving ? "Kaydediliyor..." : "Güncelle"}
        </button>
      </form>
      {saved && <p className="text-sm text-green-400 mt-2">Fiyat güncellendi ✓</p>}
      {error && <p className="text-sm text-rose-400 mt-2">{error}</p>}
    </div>
  );
}

export default function GoldPricePage() {
  const [gold, setGold] = useState<number | null>(null);
  const [silver, setSilver] = useState<number | null>(null);
  const [silverSet, setSilverSet] = useState(true);

  useEffect(() => {
    fetch("/api/gold-price")
      .then((r) => r.json())
      .then((d) => {
        setGold(d.pricePerGram);
        setSilver(d.silverPricePerGram);
        setSilverSet(!!d.silverPriceSet);
      });
  }, []);

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl text-white mb-2">Altın / Gümüş Fiyatı</h1>
      <p className="text-neutral-400 text-sm mb-6">
        Altın ve gümüş ürünlerin fiyatı birbirinden bağımsız hesaplanır. Her ürünün malzemesini ürün
        düzenleme sayfasından seçebilirsiniz.
      </p>

      <div className="space-y-5">
        <PriceCard metal="gold" current={gold} onSaved={setGold} />
        <PriceCard
          metal="silver"
          current={silver}
          onSaved={(v) => {
            setSilver(v);
            setSilverSet(true);
          }}
          warning={
            silverSet
              ? undefined
              : "Gümüş fiyatını henüz girmediniz; şu an geçici bir başlangıç değeri kullanılıyor. Gümüş ürünleri satışa açmadan önce gerçek fiyatı girin."
          }
        />
      </div>
    </div>
  );
}
