"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { calculatePrice, formatTRY } from "@/lib/pricing";
import OrderStatusBadge from "@/components/OrderStatusBadge";

export default function CartPage() {
  const { cart, removeFromCart, goldPricePerGram, getProductById, productsLoading } = useApp();

  const total = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + calculatePrice(product, goldPricePerGram) * item.quantity;
  }, 0);

  if (productsLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-neutral-400">Yükleniyor...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-neutral-900 mb-3">Sepetiniz Boş</h1>
        <p className="text-neutral-500 mb-6">Kataloğumuza göz atarak beğendiğiniz ürünleri sepetinize ekleyebilirsiniz.</p>
        <Link href="/katalog" className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-full font-medium">
          Kataloğa Git
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-neutral-900 mb-8">Sepetim</h1>

      <div className="space-y-4">
        {cart.map((item, index) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          const price = calculatePrice(product, goldPricePerGram) * item.quantity;

          return (
            <div key={index} className="flex gap-4 bg-white border border-neutral-100 rounded-xl p-4">
              <Link href={`/urun/${product.slug}`} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-neutral-50">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="96px" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/urun/${product.slug}`} className="font-medium text-neutral-800 hover:text-amber-700">
                    {product.name}
                  </Link>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-neutral-400 hover:text-rose-500 shrink-0"
                    aria-label="Sepetten çıkar"
                  >
                    <X size={18} />
                  </button>
                </div>

                {Object.entries(item.customization).length > 0 && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {Object.entries(item.customization)
                      .filter(([, v]) => v)
                      .map(([, v]) => v)
                      .join(" · ")}
                  </p>
                )}
                {item.customMessage && (
                  <p className="text-xs text-amber-700 mt-1 italic">
                    Özel mesaj: &ldquo;{item.customMessage}&rdquo;
                  </p>
                )}

                <div className="mt-2">
                  <OrderStatusBadge status={item.status} />
                </div>

                <p className="font-semibold text-neutral-900 mt-2">{formatTRY(price)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
        <span className="text-lg font-medium text-neutral-800">Toplam</span>
        <span className="text-2xl font-semibold text-neutral-900">{formatTRY(total)}</span>
      </div>

      <Link
        href="/siparis-tamamla"
        className="mt-6 block text-center bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 rounded-full transition-colors"
      >
        Siparişi Tamamla
      </Link>
    </div>
  );
}
