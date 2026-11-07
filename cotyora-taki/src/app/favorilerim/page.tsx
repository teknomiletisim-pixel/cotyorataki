"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";

export default function FavoritesPage() {
  const { favorites, getProductById, productsLoading } = useApp();
  const favProducts = favorites.map(getProductById).filter(Boolean);

  if (productsLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-neutral-400">Yükleniyor...</div>;
  }

  if (favProducts.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-white mb-3">Favori Listeniz Boş</h1>
        <p className="text-neutral-400 mb-6">Beğendiğiniz ürünlerin üzerindeki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.</p>
        <Link href="/katalog" className="bg-black hover:bg-neutral-800 text-amber-400 px-6 py-3 rounded-full font-medium">
          Kataloğa Git
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-white mb-8">Favori Ürünlerim</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {favProducts.map((p) => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
