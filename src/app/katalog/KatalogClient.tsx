"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["Yüzük", "Kolye", "Bileklik", "Küpe", "Set"];

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
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("kategori") ?? "";
  const isBestSellerFilter = searchParams.get("filter") === "cok-satanlar";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>(initialCategory);
  const [bestSellerOnly, setBestSellerOnly] = useState(isBestSellerFilter);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || p.category === category;
      const matchesBestSeller = !bestSellerOnly || p.bestSeller;
      return matchesQuery && matchesCategory && matchesBestSeller;
    });
  }, [products, query, category, bestSellerOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-white mb-6">Takı Kataloğu</h1>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="flex-1 border border-white/15 rounded-full px-4 py-2 text-sm outline-none focus:border-amber-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-white/15 rounded-full px-4 py-2 text-sm outline-none focus:border-amber-400"
        >
          <option value="">Tüm Kategoriler</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-neutral-300 px-2">
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
          Aramanızla eşleşen ürün bulunamadı.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
