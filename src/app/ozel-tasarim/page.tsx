"use client";

import { useState } from "react";
import { Upload, X, Check, Image as ImageIcon, Video as VideoIcon } from "lucide-react";

interface MediaItem {
  type: "image" | "video";
  dataUrl: string;
  filename: string;
}

const MAX_FILES = 4;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function OzelTasarimPage() {
  const [form, setForm] = useState({ name: "", phone: "", description: "" });
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setError("");

    const remaining = MAX_FILES - media.length;
    const selected = Array.from(files).slice(0, remaining);

    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`"${file.name}" 4MB'den büyük, eklenemedi. Lütfen daha küçük bir dosya seçin.`);
        continue;
      }
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) continue;

      const dataUrl = await fileToDataUrl(file);
      setMedia((prev) => [
        ...prev,
        { type: isVideo ? "video" : "image", dataUrl, filename: file.name },
      ]);
    }
  }

  function removeMedia(index: number) {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/custom-design", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, media }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Talebiniz gönderilemedi, lütfen tekrar deneyin.");
      return;
    }

    setSuccess(true);
    setForm({ name: "", phone: "", description: "" });
    setMedia([]);
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center mx-auto mb-6">
          <Check className="text-black" size={28} />
        </div>
        <h1 className="font-serif text-3xl text-white mb-3">Talebiniz Alındı</h1>
        <p className="text-neutral-500 mb-8">
          Özel tasarım talebinizi inceleyip en kısa sürede sizinle iletişime geçeceğiz.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-black hover:bg-neutral-800 text-amber-400 px-6 py-3 rounded-full font-medium"
        >
          Yeni Talep Oluştur
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <p className="text-amber-400 tracking-[0.3em] text-xs font-medium mb-3 text-center">
          HAYALİNİZDEKİ TAKI
        </p>
        <h1 className="font-serif text-4xl text-white mb-4 text-center">Özel Tasarım</h1>
        <p className="text-neutral-500 text-center mb-12 max-w-lg mx-auto">
          Aklınızdaki tasarımı, ilham aldığınız bir fotoğrafı veya videoyu bizimle paylaşın;
          atölyemizde sizin için hayata geçirelim.
        </p>

        <form onSubmit={handleSubmit} className="bg-neutral-900 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-300 block mb-1">Ad Soyad</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-300 block mb-1">Telefon</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="05XX XXX XX XX"
                className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-300 block mb-1">Tasarımınızı Anlatın</label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Örn: Nişan için özel bir yüzük istiyorum, ince ve minimal olsun, tek taş..."
              className="w-full border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300 block mb-2">
              Fotoğraf / Video Ekleyin (opsiyonel, en fazla {MAX_FILES} dosya)
            </label>

            {media.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {media.map((m, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-white/15">
                    {m.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.dataUrl} alt={m.filename} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500">
                        <VideoIcon size={20} />
                        <span className="text-[10px] mt-1 px-1 truncate w-full text-center">{m.filename}</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {media.length < MAX_FILES && (
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-white/15 rounded-lg py-6 cursor-pointer hover:border-amber-400 text-neutral-500 text-sm">
                <Upload size={18} />
                Dosya Seç (fotoğraf veya video)
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>
            )}
            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              <ImageIcon size={12} /> Her dosya en fazla 4MB olmalıdır.
            </p>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-amber-400 font-medium py-3 rounded-full"
          >
            {submitting ? "Gönderiliyor..." : "Talebi Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}
