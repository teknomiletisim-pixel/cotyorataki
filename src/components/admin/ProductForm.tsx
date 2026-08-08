"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

const CATEGORIES = ["Yüzük", "Kolye", "Bileklik", "Küpe", "Set"];

export interface ProductFormValues {
  name: string;
  category: string;
  description: string;
  images: string[];
  goldGrams: number;
  laborCost: number;
  bestSeller: boolean;
  isNew: boolean;
  allowCustomMessage: boolean;
  customizationFields: { key: string; label: string; placeholder?: string }[];
}

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  category: "Yüzük",
  description: "",
  images: [""],
  goldGrams: 1,
  laborCost: 0,
  bestSeller: false,
  isNew: false,
  allowCustomMessage: false,
  customizationFields: [],
};

export default function ProductForm({
  initialValues,
  submitUrl,
  method,
  onDeleted,
}: {
  initialValues?: Partial<ProductFormValues>;
  submitUrl: string;
  method: "POST" | "PATCH";
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    ...EMPTY_VALUES,
    ...initialValues,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateImage(index: number, url: string) {
    const next = [...values.images];
    next[index] = url;
    updateField("images", next);
  }

  function addImageField() {
    updateField("images", [...values.images, ""]);
  }

  function removeImageField(index: number) {
    updateField("images", values.images.filter((_, i) => i !== index));
  }

  function addCustomizationField() {
    updateField("customizationFields", [
      ...values.customizationFields,
      { key: "", label: "", placeholder: "" },
    ]);
  }

  function updateCustomizationField(
    index: number,
    field: "key" | "label" | "placeholder",
    value: string
  ) {
    const next = [...values.customizationFields];
    next[index] = { ...next[index], [field]: value };
    updateField("customizationFields", next);
  }

  function removeCustomizationField(index: number) {
    updateField(
      "customizationFields",
      values.customizationFields.filter((_, i) => i !== index)
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...values,
      images: values.images.filter((i) => i.trim() !== ""),
    };

    const res = await fetch(submitUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Kaydedilirken bir hata oluştu.");
      return;
    }

    router.push("/admin/urunler");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="text-sm text-neutral-400 block mb-1">Ürün Adı</label>
        <input
          required
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="text-sm text-neutral-400 block mb-1">Kategori</label>
        <select
          value={values.category}
          onChange={(e) => updateField("category", e.target.value)}
          className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-neutral-400 block mb-1">Açıklama</label>
        <textarea
          rows={3}
          value={values.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="text-sm text-neutral-400 block mb-1">Fotoğraf URL&apos;leri</label>
        {values.images.map((img, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={img}
              onChange={(e) => updateImage(i, e.target.value)}
              placeholder="https://..."
              className="flex-1 border border-white/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={() => removeImageField(i)}
              className="text-neutral-400 hover:text-rose-500 px-2"
            >
              <X size={18} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImageField}
          className="text-sm text-amber-400 hover:underline flex items-center gap-1"
        >
          <Plus size={14} /> Fotoğraf ekle
        </button>
        <p className="text-xs text-neutral-400 mt-1">
          Şimdilik fotoğraflar URL olarak eklenir. Bilgisayarınızdan doğrudan yükleme
          bir sonraki aşamada eklenebilir.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-neutral-400 block mb-1">Gram Altın Miktarı</label>
          <input
            type="number"
            step="0.01"
            required
            value={values.goldGrams}
            onChange={(e) => updateField("goldGrams", parseFloat(e.target.value) || 0)}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="text-sm text-neutral-400 block mb-1">İşçilik Bedeli (TL)</label>
          <input
            type="number"
            required
            value={values.laborCost}
            onChange={(e) => updateField("laborCost", parseInt(e.target.value) || 0)}
            className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
          />
        </div>
      </div>
      <p className="text-xs text-neutral-400 -mt-3">
        Satış fiyatı = (gram altın miktarı × güncel gram altın fiyatı) + işçilik bedeli.
        Altın fiyatı değiştiğinde bu ürünün fiyatı otomatik güncellenir.
      </p>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-neutral-400">Kişiselleştirme Alanları</label>
          <button
            type="button"
            onClick={addCustomizationField}
            className="text-sm text-amber-400 hover:underline flex items-center gap-1"
          >
            <Plus size={14} /> Alan ekle
          </button>
        </div>
        {values.customizationFields.map((field, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2">
            <input
              value={field.label}
              onChange={(e) => updateCustomizationField(i, "label", e.target.value)}
              placeholder="Etiket (Örn: Yüzük Ölçüsü)"
              className="border border-white/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <input
              value={field.key}
              onChange={(e) =>
                updateCustomizationField(
                  i,
                  "key",
                  e.target.value.toLowerCase().replace(/\s+/g, "_")
                )
              }
              placeholder="Anahtar (Örn: ringSize)"
              className="border border-white/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={() => removeCustomizationField(i)}
              className="text-neutral-400 hover:text-rose-500 px-2"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={values.bestSeller}
            onChange={(e) => updateField("bestSeller", e.target.checked)}
          />
          Çok Satan olarak işaretle
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={values.allowCustomMessage}
            onChange={(e) => updateField("allowCustomMessage", e.target.checked)}
          />
          Özel mesaj eklenebilsin
        </label>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-black hover:bg-neutral-800 disabled:opacity-60 text-amber-400 font-medium px-6 py-3 rounded-full"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {onDeleted && (
          <button
            type="button"
            onClick={onDeleted}
            className="border border-rose-300 text-rose-600 hover:bg-rose-500/10 font-medium px-6 py-3 rounded-full"
          >
            Ürünü Kaldır
          </button>
        )}
      </div>
    </form>
  );
}
