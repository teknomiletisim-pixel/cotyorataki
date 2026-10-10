"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Upload } from "lucide-react";

const CATEGORIES = ["Yüzük", "Kolye", "Bileklik", "Küpe", "Set"];
const MAX_IMAGES = 6;
const MAX_SOURCE_FILE_SIZE = 20 * 1024 * 1024; // 20MB (sıkıştırmadan önceki ham dosya için üst sınır)
const MAX_DIMENSION = 1600; // px, en uzun kenar
const JPEG_QUALITY = 0.82;

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
  images: [],
  goldGrams: 1,
  laborCost: 0,
  bestSeller: false,
  isNew: false,
  allowCustomMessage: false,
  customizationFields: [],
};

// Telefon fotoğrafları genelde 8-15MB olabiliyor; sunucunun kabul ettiği veri
// boyutunu aşmamak için görseli tarayıcıda otomatik olarak küçültüp
// sıkıştırıyoruz (en uzun kenar 1600px, JPEG %82 kalite — gözle fark
// edilmeyecek kadar hafif bir kayıpla dosya boyutu genelde %90+ küçülür).
function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas desteklenmiyor"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Görsel okunamadı"));
    };
    img.src = objectUrl;
  });
}

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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateImage(index: number, url: string) {
    const next = [...values.images];
    next[index] = url;
    updateField("images", next);
  }

  function addImageUrlField() {
    if (values.images.length >= MAX_IMAGES) return;
    updateField("images", [...values.images, ""]);
  }

  function removeImageField(index: number) {
    updateField("images", values.images.filter((_, i) => i !== index));
  }

  async function handleFileUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError("");
    setUploading(true);

    const remainingSlots = MAX_IMAGES - values.images.length;
    const files = Array.from(fileList).slice(0, remainingSlots);
    const newImages: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" bir görsel dosyası değil, atlandı.`);
        continue;
      }
      if (file.size > MAX_SOURCE_FILE_SIZE) {
        setError(`"${file.name}" çok büyük (20MB üzeri), eklenemedi.`);
        continue;
      }
      try {
        const dataUrl = await compressImageToDataUrl(file);
        newImages.push(dataUrl);
      } catch {
        setError(`"${file.name}" yüklenirken bir hata oluştu.`);
      }
    }

    if (newImages.length > 0) {
      updateField("images", [...values.images, ...newImages]);
    }
    setUploading(false);
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

    const cleanedImages = values.images.filter((i) => i.trim() !== "");
    if (cleanedImages.length === 0) {
      setError("En az bir fotoğraf eklemelisiniz (URL veya bilgisayarınızdan yükleyerek).");
      return;
    }

    setSaving(true);

    const payload = { ...values, images: cleanedImages };

    const res = await fetch(submitUrl, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      if (res.status === 413) {
        setError("Toplam fotoğraf boyutu çok büyük. Lütfen fotoğraf sayısını azaltın ve tekrar deneyin.");
        return;
      }
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
        <label className="text-sm text-neutral-400 block mb-2">
          Fotoğraflar ({values.images.length}/{MAX_IMAGES})
        </label>

        {values.images.length > 0 && (
          <div className="space-y-2 mb-3">
            {values.images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 border border-white/10 shrink-0">
                  {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <input
                  value={img.startsWith("data:") ? "Bilgisayardan yüklendi" : img}
                  onChange={(e) => updateImage(i, e.target.value)}
                  disabled={img.startsWith("data:")}
                  placeholder="https://..."
                  className="flex-1 border border-white/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 disabled:text-neutral-500"
                />
                <button
                  type="button"
                  onClick={() => removeImageField(i)}
                  className="text-neutral-400 hover:text-rose-500 px-2 shrink-0"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {values.images.length < MAX_IMAGES && (
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
              <Upload size={14} />
              {uploading ? "Yükleniyor..." : "Bilgisayardan Yükle"}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                className="hidden"
                onChange={(e) => {
                  handleFileUpload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={addImageUrlField}
              className="flex items-center gap-1 text-sm text-amber-400 hover:underline px-2"
            >
              <Plus size={14} /> Veya URL ile ekle
            </button>
          </div>
        )}
        <p className="text-xs text-neutral-400 mt-2">
          Bilgisayarınızdan en fazla {MAX_IMAGES} fotoğraf yükleyebilirsiniz. Telefon
          fotoğrafları dahil büyük dosyalar otomatik olarak optimize edilir, ayrıca
          küçültmenize gerek yok. İsterseniz internetteki bir görselin linkini de girebilirsiniz.
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

      {error && <p className="text-sm text-rose-500">{error}</p>}

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
