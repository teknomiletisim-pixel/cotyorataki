"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const TYPE_OPTIONS = [
  { value: "iade", label: "İade" },
  { value: "degisim", label: "Değişim" },
  { value: "garanti", label: "Garanti / Kusurlu Ürün" },
];

const STATUS_STYLES: Record<string, string> = {
  "Beklemede": "bg-neutral-100 text-neutral-600",
  "İnceleniyor": "bg-amber-100 text-amber-700",
  "Onaylandı": "bg-blue-100 text-blue-700",
  "Reddedildi": "bg-rose-100 text-rose-700",
  "Tamamlandı": "bg-green-100 text-green-700",
};

interface ServiceRequest {
  id: number;
  orderId: number;
  type: string;
  reason: string;
  status: string;
  adminNote: string | null;
  createdAt: string;
}

export default function GarantiIadePage() {
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    orderId: "",
    type: "iade",
    reason: "",
    contactPhone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/giris?callbackUrl=/garanti-iade");
    }
  }, [sessionStatus, router]);

  function loadRequests() {
    fetch("/api/service-requests")
      .then((r) => r.json())
      .then(setRequests)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;
    loadRequests();
  }, [sessionStatus]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    const res = await fetch("/api/service-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: Number(form.orderId),
        type: form.type,
        reason: form.reason,
        contactPhone: form.contactPhone || undefined,
      }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Talebiniz oluşturulamadı.");
      return;
    }

    setSuccess(true);
    setForm({ orderId: "", type: "iade", reason: "", contactPhone: "" });
    loadRequests();
  }

  if (sessionStatus !== "authenticated") {
    return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-neutral-400">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="font-serif text-3xl text-neutral-900 mb-2">Garanti ve İade</h1>
      <p className="text-neutral-500 mb-8">
        Değişim, iade veya garanti kapsamındaki bir sorun için sipariş numaranızla
        talep oluşturabilirsiniz. Talebinizin durumu hakkında e-posta ile
        bilgilendirileceksiniz.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-100 rounded-xl p-6 space-y-4 mb-10">
        <div>
          <label className="text-sm text-neutral-600 block mb-1">Sipariş Numarası</label>
          <input
            required
            type="number"
            value={form.orderId}
            onChange={(e) => setForm((f) => ({ ...f, orderId: e.target.value }))}
            placeholder="Örn: 42"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Sipariş numaranızı &quot;Hesabım &gt; Siparişlerim&quot; bölümünden görebilirsiniz.
          </p>
        </div>

        <div>
          <label className="text-sm text-neutral-600 block mb-1">İşlem Türü</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-neutral-600 block mb-1">Açıklama</label>
          <textarea
            required
            rows={4}
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            placeholder="Talebinizi kısaca açıklayın..."
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="text-sm text-neutral-600 block mb-1">İletişim Telefonu (opsiyonel)</label>
          <input
            value={form.contactPhone}
            onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}
        {success && <p className="text-sm text-green-600">Talebiniz alındı, en kısa sürede dönüş yapılacaktır.</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-amber-400 font-medium py-3 rounded-full"
        >
          {submitting ? "Gönderiliyor..." : "Talep Oluştur"}
        </button>
      </form>

      <h2 className="font-serif text-xl text-neutral-900 mb-4">Taleplerim</h2>
      {loading ? (
        <p className="text-neutral-400">Yükleniyor...</p>
      ) : requests.length === 0 ? (
        <p className="text-neutral-500">Henüz bir talebiniz bulunmuyor.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="bg-white border border-neutral-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-neutral-800">
                  Sipariş #{r.orderId} ·{" "}
                  {TYPE_OPTIONS.find((t) => t.value === r.type)?.label ?? r.type}
                </p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status] ?? "bg-neutral-100 text-neutral-600"}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-sm text-neutral-600">{r.reason}</p>
              {r.adminNote && (
                <p className="text-sm text-amber-700 italic mt-1">Not: {r.adminNote}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
