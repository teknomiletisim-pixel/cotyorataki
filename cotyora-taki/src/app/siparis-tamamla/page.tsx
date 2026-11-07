"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useApp } from "@/context/AppContext";
import { calculatePrice, formatTRY } from "@/lib/pricing";

export default function CheckoutPage() {
  const { status } = useSession();
  const { cart, goldPricePerGram, getProductById, clearCart, productsLoading } = useApp();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    deliveryDate: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris?callbackUrl=/siparis-tamamla");
    }
  }, [status, router]);

  const total = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    if (!product) return sum;
    return sum + calculatePrice(product, goldPricePerGram) * item.quantity;
  }, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // 1) Siparişi veritabanına kaydet
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            customization: item.customization,
            customMessage: item.customMessage,
          })),
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        setError(orderData.error ?? "Sipariş oluşturulamadı.");
        setSubmitting(false);
        return;
      }

      // 2) Lemonsqueezy ödeme oturumu oluştur ve yönlendir
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId }),
      });
      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || !checkoutData.checkoutUrl) {
        // Lemonsqueezy henüz yapılandırılmamışsa sipariş yine de alınmıştır.
        setError(
          checkoutData.error ??
            "Sipariş alındı ancak ödeme sayfası açılamadı. Lütfen Lemonsqueezy ayarlarınızı kontrol edin."
        );
        clearCart();
        setSubmitting(false);
        return;
      }

      clearCart();
      window.location.href = checkoutData.checkoutUrl;
    } catch {
      setError("Bir şeyler ters gitti, lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }

  if (status !== "authenticated" || productsLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-neutral-400">Yükleniyor...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-neutral-400">Sepetiniz boş, sipariş tamamlanamaz.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-white mb-8">Siparişi Tamamla</h1>

      <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4 mb-8 flex items-center justify-between">
        <span className="text-neutral-300 font-medium">Ödenecek Tutar</span>
        <span className="text-2xl font-semibold text-white">{formatTRY(total)}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Ad Soyad</label>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Telefon</label>
          <input
            required
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Teslimat Adresi</label>
          <textarea
            required
            rows={3}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Tercih Edilen Teslimat Tarihi</label>
          <input
            type="date"
            required
            value={form.deliveryDate}
            onChange={(e) => setForm((f) => ({ ...f, deliveryDate: e.target.value }))}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-amber-400 font-medium py-3 rounded-full mt-4"
        >
          {submitting ? "Yönlendiriliyor..." : "Kredi Kartı ile Ödemeye Geç"}
        </button>
        <p className="text-xs text-neutral-400 text-center">
          Ödeme, Lemonsqueezy güvenli ödeme altyapısı üzerinden alınır.
        </p>
      </form>
    </div>
  );
}
