"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

interface SpecialDayRow {
  id: number;
  name: string;
  month: number;
  day: number;
  discountRate: string;
  bannerMessage: string;
  bannerImage: string | null;
  active: boolean;
}

interface FormValues {
  name: string;
  month: number;
  day: number;
  discountRate: number;
  bannerMessage: string;
  bannerImage: string;
  active: boolean;
}

const EMPTY_FORM: FormValues = {
  name: "",
  month: 1,
  day: 1,
  discountRate: 10,
  bannerMessage: "",
  bannerImage: "",
  active: true,
};

export default function SpecialDaysPage() {
  const [days, setDays] = useState<SpecialDayRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/admin/special-days")
      .then((r) => r.json())
      .then(setDays)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // "Anneler Günü" gibi bir isimden otomatik banner mesajı öner (admin isterse değiştirebilir)
  function suggestBannerMessage(name: string) {
    if (!name.trim()) return "";
    const base = name.trim().replace(/\s+/g, " ");
    // "X Günü" -> "X Gününe Özel", aksi halde "X'E ÖZEL" gibi genel bir ek kullan
    const withDative = /günü$/i.test(base)
      ? base.replace(/günü$/i, "gününe")
      : `${base}'a`;
    return `${withDative.toLocaleUpperCase("tr-TR")} ÖZEL TÜM ÜRÜNLERDE %${form.discountRate} İNDİRİM`;
  }

  function openNewForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  }

  function openEditForm(row: SpecialDayRow) {
    setEditingId(row.id);
    setForm({
      name: row.name,
      month: row.month,
      day: row.day,
      discountRate: Math.round(Number(row.discountRate) * 100),
      bannerMessage: row.bannerMessage,
      bannerImage: row.bannerImage ?? "",
      active: row.active,
    });
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.bannerMessage.trim()) {
      setError("İsim ve banner mesajı zorunludur.");
      return;
    }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      month: form.month,
      day: form.day,
      discountRate: form.discountRate / 100,
      bannerMessage: form.bannerMessage.trim(),
      bannerImage: form.bannerImage.trim() || undefined,
      active: form.active,
    };

    const res = editingId
      ? await fetch(`/api/admin/special-days/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/special-days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Kaydedilirken bir hata oluştu.");
      return;
    }

    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm("Bu özel günü silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/special-days/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(row: SpecialDayRow) {
    await fetch(`/api/admin/special-days/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !row.active }),
    });
    load();
  }

  if (loading) return <p className="text-neutral-500">Yükleniyor...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-neutral-900">Özel Günler</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Belirlediğiniz gün geldiğinde tüm ürünlerde otomatik indirim uygulanır ve
            sitede karşılama ekranı gösterilir.
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="flex items-center gap-1 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-4 py-2 rounded-full shrink-0"
        >
          <Plus size={16} /> Yeni Özel Gün
        </button>
      </div>

      {days.length === 0 ? (
        <p className="text-neutral-500">Henüz özel gün eklenmedi.</p>
      ) : (
        <div className="space-y-3">
          {days.map((row) => (
            <div
              key={row.id}
              className={`flex items-center gap-4 bg-white border border-neutral-100 rounded-xl p-4 ${
                !row.active ? "opacity-50" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-800">
                  {row.name}{" "}
                  <span className="text-xs text-neutral-400 font-normal">
                    ({row.day} {MONTHS[row.month - 1]})
                  </span>
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  %{Math.round(Number(row.discountRate) * 100)} indirim · &ldquo;{row.bannerMessage}&rdquo;
                  {!row.active && " · Pasif"}
                </p>
              </div>
              <button
                onClick={() => toggleActive(row)}
                className="text-xs px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-600 hover:border-amber-300 shrink-0"
              >
                {row.active ? "Pasife Al" : "Aktif Et"}
              </button>
              <button
                onClick={() => openEditForm(row)}
                className="p-2 text-neutral-500 hover:text-amber-700 shrink-0"
                aria-label="Düzenle"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(row.id)}
                className="p-2 text-neutral-500 hover:text-rose-600 shrink-0"
                aria-label="Sil"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
            <h2 className="font-serif text-xl text-neutral-900 mb-4">
              {editingId ? "Özel Günü Düzenle" : "Yeni Özel Gün"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-neutral-600 block mb-1">
                  Özel Gün Adı (Örn: Anneler Günü)
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      // Kullanıcı henüz kendi mesajını yazmadıysa otomatik öner
                      bannerMessage: f.bannerMessage === suggestBannerMessage(f.name)
                        ? suggestBannerMessage(name)
                        : f.bannerMessage,
                    }));
                  }}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-600 block mb-1">Ay</label>
                  <select
                    value={form.month}
                    onChange={(e) => updateField("month", Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-neutral-600 block mb-1">Gün</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={form.day}
                    onChange={(e) => updateField("day", Number(e.target.value))}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-neutral-600 block mb-1">İndirim Oranı (%)</label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  required
                  value={form.discountRate}
                  onChange={(e) => updateField("discountRate", Number(e.target.value) || 0)}
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-neutral-600">Karşılama Ekranı Yazısı</label>
                  <button
                    type="button"
                    onClick={() => updateField("bannerMessage", suggestBannerMessage(form.name))}
                    className="text-xs text-amber-700 hover:underline"
                  >
                    Otomatik öner
                  </button>
                </div>
                <textarea
                  required
                  rows={2}
                  value={form.bannerMessage}
                  onChange={(e) => updateField("bannerMessage", e.target.value)}
                  placeholder="ANNELER GÜNÜNE ÖZEL TÜM ÜRÜNLERDE %10 İNDİRİM"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-600 block mb-1">
                  Karşılama Ekranı Görseli (URL, opsiyonel)
                </label>
                <input
                  value={form.bannerImage}
                  onChange={(e) => updateField("bannerImage", e.target.value)}
                  placeholder="https://... (boş bırakılırsa varsayılan kolye görseli kullanılır)"
                  className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => updateField("active", e.target.checked)}
                />
                Aktif (işaretli değilse bu gün geldiğinde hiçbir şey olmaz)
              </label>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-medium py-3 rounded-full"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
