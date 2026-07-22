"use client";

import { useEffect, useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  iade: "İade",
  degisim: "Değişim",
  garanti: "Garanti / Kusurlu Ürün",
};

const STATUS_OPTIONS = ["Beklemede", "İnceleniyor", "Onaylandı", "Reddedildi", "Tamamlandı"];

interface ServiceRequest {
  id: number;
  orderId: number | null;
  type: string;
  reason: string;
  contactPhone: string | null;
  status: string;
  adminNote: string | null;
  createdAt: string;
  customerEmail: string | null;
  customerName: string | null;
}

export default function AdminServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteDrafts, setNoteDrafts] = useState<Record<number, string>>({});

  function load() {
    fetch("/api/admin/service-requests")
      .then((r) => r.json())
      .then(setRequests)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/admin/service-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function saveNote(id: number) {
    await fetch(`/api/admin/service-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNote: noteDrafts[id] ?? "" }),
    });
    load();
  }

  if (loading) return <p className="text-neutral-500">Yükleniyor...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-neutral-900 mb-2">Değişim / İade / Garanti Talepleri</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Durumu değiştirdiğinizde müşteriye otomatik e-posta bildirimi gönderilir.
      </p>

      {requests.length === 0 ? (
        <p className="text-neutral-500">Henüz talep bulunmuyor.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="bg-white border border-neutral-100 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium text-neutral-800">
                    Sipariş #{r.orderId} · {TYPE_LABELS[r.type] ?? r.type}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {r.customerName} · {r.customerEmail}
                    {r.contactPhone && ` · ${r.contactPhone}`}
                  </p>
                </div>
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="border border-neutral-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-400"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-sm text-neutral-600 border-t border-neutral-100 pt-3 mt-1">{r.reason}</p>

              <div className="mt-3 flex gap-2">
                <input
                  value={noteDrafts[r.id] ?? r.adminNote ?? ""}
                  onChange={(e) => setNoteDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                  placeholder="Müşteriye görünecek not ekleyin (opsiyonel)..."
                  className="flex-1 border border-neutral-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => saveNote(r.id)}
                  className="text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-1.5 rounded-lg"
                >
                  Notu Kaydet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
