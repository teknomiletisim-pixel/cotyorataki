"use client";

import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["Beklemede", "İnceleniyor", "Teklif Verildi", "Tamamlandı", "Reddedildi"];

interface MediaItem {
  type: "image" | "video";
  dataUrl: string;
  filename: string;
}

interface CustomDesignRequest {
  id: number;
  name: string;
  phone: string;
  description: string;
  media: MediaItem[];
  status: string;
  adminNote: string | null;
  createdAt: string;
}

export default function AdminCustomDesignPage() {
  const [requests, setRequests] = useState<CustomDesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteDrafts, setNoteDrafts] = useState<Record<number, string>>({});
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  function load() {
    fetch("/api/admin/custom-design-requests")
      .then((r) => r.json())
      .then(setRequests)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/admin/custom-design-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function saveNote(id: number) {
    await fetch(`/api/admin/custom-design-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNote: noteDrafts[id] ?? "" }),
    });
    load();
  }

  if (loading) return <p className="text-neutral-500">Yükleniyor...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl text-neutral-900 mb-2">Özel Tasarım Talepleri</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Müşterilerin gönderdiği özel tasarım istekleri, fotoğraf/video ekleriyle burada listelenir.
      </p>

      {requests.length === 0 ? (
        <p className="text-neutral-500">Henüz talep bulunmuyor.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="bg-white border border-neutral-100 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium text-neutral-800">{r.name}</p>
                  <p className="text-xs text-neutral-500">
                    {r.phone} · {new Date(r.createdAt).toLocaleDateString("tr-TR")}
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

              <p className="text-sm text-neutral-600 border-t border-neutral-100 pt-3 mt-1">{r.description}</p>

              {r.media.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {r.media.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(m)}
                      className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200"
                    >
                      {m.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.dataUrl} alt={m.filename} className="w-full h-full object-cover" />
                      ) : (
                        <video src={m.dataUrl} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <input
                  value={noteDrafts[r.id] ?? r.adminNote ?? ""}
                  onChange={(e) => setNoteDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                  placeholder="Teklif / not ekleyin (opsiyonel)..."
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

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {lightbox.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lightbox.dataUrl} alt={lightbox.filename} className="max-w-full max-h-full rounded-lg" />
          ) : (
            <video src={lightbox.dataUrl} controls autoPlay className="max-w-full max-h-full rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
}
