"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { formatTRY } from "@/lib/pricing";
import OrderStatusBadge from "@/components/OrderStatusBadge";

export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountContent />
    </Suspense>
  );
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  customMessage?: string | null;
}
interface Order {
  id: number;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

function AccountContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "siparisler" ? "siparisler" : "bilgiler";
  const [tab, setTab] = useState<"bilgiler" | "siparisler">(initialTab);

  const [account, setAccount] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    newPassword: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris?callbackUrl=/hesabim");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/account")
      .then((r) => r.json())
      .then((data) =>
        setAccount((a) => ({
          ...a,
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
        }))
      );
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders);
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-neutral-400">Yükleniyor...</div>;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: account.firstName,
        lastName: account.lastName,
        phone: account.phone,
        address: account.address,
        newPassword: account.newPassword || undefined,
      }),
    });
    setSaving(false);
    setSaved(true);
    setAccount((a) => ({ ...a, newPassword: "" }));
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-neutral-900 mb-8">
        Merhaba{account.firstName ? `, ${account.firstName}` : ""}
      </h1>

      <div className="flex gap-6 border-b border-neutral-200 mb-8">
        <button
          onClick={() => setTab("bilgiler")}
          className={`pb-3 text-sm font-medium border-b-2 ${
            tab === "bilgiler" ? "border-amber-600 text-amber-700" : "border-transparent text-neutral-500"
          }`}
        >
          Hesap Bilgilerim
        </button>
        <button
          onClick={() => setTab("siparisler")}
          className={`pb-3 text-sm font-medium border-b-2 ${
            tab === "siparisler" ? "border-amber-600 text-amber-700" : "border-transparent text-neutral-500"
          }`}
        >
          Siparişlerim
        </button>
      </div>

      {tab === "bilgiler" ? (
        <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4 max-w-xl">
          <div>
            <label className="text-sm text-neutral-600 block mb-1">Ad</label>
            <input
              value={account.firstName}
              onChange={(e) => setAccount((a) => ({ ...a, firstName: e.target.value }))}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-600 block mb-1">Soyad</label>
            <input
              value={account.lastName}
              onChange={(e) => setAccount((a) => ({ ...a, lastName: e.target.value }))}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-neutral-600 block mb-1">E-posta</label>
            <input
              type="email"
              value={account.email}
              disabled
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-neutral-50 text-neutral-400"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-600 block mb-1">Telefon</label>
            <input
              value={account.phone}
              onChange={(e) => setAccount((a) => ({ ...a, phone: e.target.value }))}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-sm text-neutral-600 block mb-1">Yeni Şifre (opsiyonel)</label>
            <input
              type="password"
              value={account.newPassword}
              onChange={(e) => setAccount((a) => ({ ...a, newPassword: e.target.value }))}
              placeholder="••••••••"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-neutral-600 block mb-1">Adres</label>
            <textarea
              value={account.address}
              onChange={(e) => setAccount((a) => ({ ...a, address: e.target.value }))}
              rows={3}
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-medium py-3 rounded-full mt-2"
          >
            {saving ? "Kaydediliyor..." : "Bilgileri Kaydet"}
          </button>
          {saved && <p className="sm:col-span-2 text-sm text-green-600">Bilgiler güncellendi ✓</p>}
        </form>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-neutral-500">Henüz siparişiniz bulunmuyor.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border border-neutral-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-neutral-800">Sipariş #{order.id}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-neutral-600">
                    {item.quantity}x {item.productName}
                    {item.customMessage && (
                      <span className="italic text-amber-700"> — &ldquo;{item.customMessage}&rdquo;</span>
                    )}
                  </p>
                ))}
                <p className="font-semibold text-neutral-900 mt-2">{formatTRY(order.totalAmount)}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
