"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import { MATERIAL_LABELS } from "@/lib/pricing";
import type { Material } from "@/lib/types";

const CATEGORIES = ["Yüzük", "Kolye", "Bileklik", "Küpe", "Set"];

// "gumus" / "gümüş" / "Gümüş" gibi yazımları aynı kabul etmek için
function normalize(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}

export default function KatalogClient() {
  return (
    <Suspense fallback={null}>
      <KatalogContent />
    </Suspense>
  );
}

function KatalogContent() {
  const searchParams = useSearchParams();
  const { products, productsLoading } = useApp();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<string>(searchParams.get("kategori") ?? "");
  const [material, setMaterial] = useState<"" | Material>(
    searchParams.get("malzeme") === "altin" ? "altin" : searchParams.get("malzeme") === "gumus" ? "gumus" : ""
  );
  const [bestSellerOnly, setBestSellerOnly] = useState(searchParams.get("filter") === "cok-satanlar");

  // Adres çubuğu değişince (üst menüdeki arama, ana sayfadaki kısayollar vb.) filtreleri senkronla
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setCategory(searchParams.get("kategori") ?? "");
    const m = searchParams.get("malzeme");
    setMaterial(m === "altin" ? "altin" : m === "gumus" ? "gumus" : "");
    setBestSellerOnly(searchParams.get("filter") === "cok-satanlar");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return products.filter((p) => {
      const haystack = normalize(`${p.name} ${p.description} ${p.category} ${MATERIAL_LABELS[p.material]}`);
      // Arama kutusuna "gümüş yüzük" gibi birden fazla kelime yazılırsa hepsi eşleşmeli
      const matchesQuery = !q || q.split(/\s+/).every((word) => haystack.includes(word));
      const matchesCategory = !category || p.category === category;
      const matchesMaterial = !material || p.material === material;
      const matchesBestSeller = !bestSellerOnly || p.bestSeller;
      return matchesQuery && matchesCategory && matchesMaterial && matchesBestSeller;
    });
  }, [products, query, category, material, bestSellerOnly]);

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
      active
        ? "bg-amber-400 border-amber-400 text-black"
        : "border-white/15 text-neutral-300 hover:border-amber-400/60"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-white mb-6">Takı Kataloğu</h1>

      <div className="flex flex-col gap-4 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün ara... (örn. gümüş yüzük)"
          className="w-full border border-white/15 rounded-full px-4 py-2 text-sm outline-none focus:border-amber-400"
        />

        {/* Malzeme seçimi */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-400 w-full sm:w-auto sm:mr-2">Malzeme</span>
          <button onClick={() => setMaterial("")} className={chip(material === "")}>
            Tümü
          </button>
          <button onClick={() => setMaterial("altin")} className={chip(material === "altin")}>
            Altın
          </button>
          <button onClick={() => setMaterial("gumus")} className={chip(material === "gumus")}>
            Gümüş
          </button>
        </div>

        {/* Kategori seçimi */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-400 w-full sm:w-auto sm:mr-2">Kategori</span>
          <button onClick={() => setCategory("")} className={chip(category === "")}>
            Tümü
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={chip(category === c)}>
              {c}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={bestSellerOnly}
            onChange={(e) => setBestSellerOnly(e.target.checked)}
          />
          Sadece Çok Satanlar
        </label>
      </div>

      {productsLoading ? (
        <p className="text-neutral-400 text-center py-16">Yükleniyor...</p>
      ) : filtered.length === 0 ? (
        <p className="text-neutral-400 text-center py-16">
          Seçtiğiniz filtrelerle eşleşen ürün bulunamadı.
        </p>
      ) : (
        <>
          <p className="text-xs text-neutral-500 mb-4">
            {material ? MATERIAL_LABELS[material] : "Tüm malzemeler"}
            {category ? ` · ${category}` : ""} — {filtered.length} ürün
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
