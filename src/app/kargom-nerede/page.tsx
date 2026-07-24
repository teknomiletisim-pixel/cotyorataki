"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatTRY } from "@/lib/pricing";
import OrderStatusBadge from "@/components/OrderStatusBadge";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}
interface Order {
  id: number;
  status: string;
  totalAmount: number;
  deliveryDate: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function KargomNeredePage() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris?callbackUrl=/kargom-nerede");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [status]);

  if (status !== "authenticated" || loading) {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-neutral-400">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-serif text-3xl text-neutral-900 mb-2">Kargom Nerede</h1>
      <p className="text-neutral-500 mb-8">
        Siparişlerinizin güncel durumunu aşağıda görebilirsiniz.
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-500 mb-6">Henüz bir siparişiniz bulunmuyor.</p>
          <Link href="/katalog" className="bg-black hover:bg-neutral-800 text-amber-400 px-6 py-3 rounded-full font-medium">
            Kataloğa Git
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-neutral-100 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-neutral-800">Sipariş #{order.id}</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-neutral-400 mb-2">
                Sipariş tarihi: {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                {order.deliveryDate && ` · Tercih edilen teslimat: ${order.deliveryDate}`}
              </p>
              <div className="border-t border-neutral-100 pt-2 mt-2 space-y-1">
                {order.items.map((item) => (
                  <p key={item.id} className="text-sm text-neutral-600">
                    {item.quantity}x {item.productName}
                  </p>
                ))}
              </div>
              <p className="font-semibold text-neutral-900 mt-2">{formatTRY(order.totalAmount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
