"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, EyeOff, Eye } from "lucide-react";

interface AdminProduct {
  id: number;
  slug: string;
  name: string;
  category: string;
  images: string[];
  goldGrams: string;
  laborCost: number;
  bestSeller: boolean;
  active: boolean;
}

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProductList)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(product: AdminProduct) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !product.active }),
    });
    setProductList((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p))
    );
  }

  if (loading) return <p className="text-neutral-500">Yükleniyor...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-neutral-900">Ürünler</h1>
        <Link
          href="/admin/urunler/yeni"
          className="flex items-center gap-1 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-4 py-2 rounded-full"
        >
          <Plus size={16} /> Yeni Ürün
        </Link>
      </div>

      <div className="space-y-3">
        {productList.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-4 bg-white border border-neutral-100 rounded-xl p-3 ${
              !p.active ? "opacity-50" : ""
            }`}
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-50 shrink-0">
              {p.images[0] && (
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="64px" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-800 truncate">{p.name}</p>
              <p className="text-xs text-neutral-500">
                {p.category} · {p.goldGrams} gr altın + {p.laborCost} TL işçilik
                {p.bestSeller && " · Çok Satan"}
                {!p.active && " · Pasif"}
              </p>
            </div>
            <Link
              href={`/admin/urunler/${p.id}/duzenle`}
              className="p-2 text-neutral-500 hover:text-amber-700"
              aria-label="Düzenle"
            >
              <Pencil size={18} />
            </Link>
            <button
              onClick={() => toggleActive(p)}
              className="p-2 text-neutral-500 hover:text-rose-600"
              aria-label={p.active ? "Pasife al" : "Aktif et"}
            >
              {p.active ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
