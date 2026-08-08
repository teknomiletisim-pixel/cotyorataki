"use client";

import { useEffect, useState } from "react";
import { formatTRY } from "@/lib/pricing";

const STATUS_OPTIONS = ["Beklemede", "Onaylandı", "Hazırlanıyor", "Yolda", "Teslim Edildi", "İptal Edildi"];

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  customization: Record<string, string>;
  customMessage?: string | null;
}

interface Order {
  id: number;
  fullName: string;
  phone: string;
  address: string;
  deliveryDate: string | null;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  customerEmail: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(orderId: number, status: string) {
    setUpdatingId(orderId);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    }
    setUpdatingId(null);
  }

  if (loading) return <p className="text-neutral-400">Yükleniyor...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-white mb-6">Siparişler</h1>

      {orders.length === 0 ? (
        <p className="text-neutral-400">Henüz sipariş bulunmuyor.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-neutral-900 border border-white/10 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-neutral-100">
                    #{order.id} · {order.fullName}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {order.customerEmail} · {order.phone}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">{order.address}</p>
                  {order.deliveryDate && (
                    <p className="text-xs text-neutral-400">
                      Teslimat tarihi: {order.deliveryDate}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatTRY(order.totalAmount)}</p>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      order.paymentStatus === "odendi"
                        ? "bg-green-500/15 text-green-400"
                        : order.paymentStatus === "iptal"
                        ? "bg-rose-500/15 text-rose-400"
                        : "bg-amber-400/15 text-amber-400"
                    }`}
                  >
                    {order.paymentStatus === "odendi"
                      ? "Ödendi"
                      : order.paymentStatus === "iptal"
                      ? "İptal/İade"
                      : "Ödeme Bekleniyor"}
                  </span>
                </div>
              </div>

              <div className="mt-3 border-t border-white/10 pt-3 space-y-1">
                {order.items.map((item) => (
                  <div key={item.id} className="text-sm text-neutral-400 flex justify-between">
                    <span>
                      {item.quantity}x {item.productName}
                      {item.customMessage && (
                        <span className="text-amber-400 italic"> — &ldquo;{item.customMessage}&rdquo;</span>
                      )}
                    </span>
                    <span>{formatTRY(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <label className="text-sm text-neutral-400">Durum:</label>
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border border-white/15 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-400"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
