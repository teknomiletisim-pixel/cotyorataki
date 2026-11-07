"use client";

import { useState } from "react";
import { Printer } from "lucide-react";

// Türkiye yüzük ölçüleri ve karşılık gelen iç çevre (mm).
// Çap (mm) = çevre / π — yazdırılabilir daireler bu çapa göre çiziliyor.
const SIZE_TABLE: { size: number; circumference: number }[] = [
  { size: 4, circumference: 44.2 },
  { size: 5, circumference: 45.5 },
  { size: 6, circumference: 46.8 },
  { size: 7, circumference: 48.0 },
  { size: 8, circumference: 49.3 },
  { size: 9, circumference: 50.6 },
  { size: 10, circumference: 51.9 },
  { size: 11, circumference: 53.1 },
  { size: 12, circumference: 54.4 },
  { size: 13, circumference: 55.7 },
  { size: 14, circumference: 57.0 },
  { size: 15, circumference: 58.3 },
  { size: 16, circumference: 59.5 },
  { size: 17, circumference: 60.8 },
  { size: 18, circumference: 62.1 },
  { size: 19, circumference: 63.4 },
  { size: 20, circumference: 64.6 },
];

function diameterMm(circumference: number): number {
  return circumference / Math.PI;
}

export default function RingSizeCalculatorPage() {
  const [tab, setTab] = useState<"yazdir" | "hesapla">("yazdir");

  // Eski yöntem: elinizde zaten uyan bir yüzük varsa iç çapını girerek de bulabilirsiniz.
  const [diameterInput, setDiameterInput] = useState("");
  const closestSize = diameterInput
    ? SIZE_TABLE.reduce((closest, row) => {
        const rowDiameter = diameterMm(row.circumference);
        const target = parseFloat(diameterInput);
        return Math.abs(rowDiameter - target) < Math.abs(diameterMm(closest.circumference) - target)
          ? row
          : closest;
      }, SIZE_TABLE[0]).size
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="print:hidden">
        <h1 className="font-serif text-3xl text-white mb-2">Yüzük Ölçüsü Hesaplama</h1>
        <p className="text-neutral-400 mb-8">
          Ölçü aletiyle uğraşmadan, elinizde zaten uyan bir yüzüğü kullanarak
          doğru ölçünüzü bulabilirsiniz.
        </p>

        <div className="flex gap-6 border-b border-white/15 mb-8">
          <button
            onClick={() => setTab("yazdir")}
            className={`pb-3 text-sm font-medium border-b-2 ${
              tab === "yazdir" ? "border-amber-600 text-amber-400" : "border-transparent text-neutral-400"
            }`}
          >
            En Kolay Yöntem: Yazdır ve Karşılaştır
          </button>
          <button
            onClick={() => setTab("hesapla")}
            className={`pb-3 text-sm font-medium border-b-2 ${
              tab === "hesapla" ? "border-amber-600 text-amber-400" : "border-transparent text-neutral-400"
            }`}
          >
            Elle Ölçüm Girerek Hesapla
          </button>
        </div>
      </div>

      {tab === "yazdir" && (
        <div>
          <div className="print:hidden bg-amber-400/10 border border-amber-400/20 rounded-xl p-5 mb-8">
            <h2 className="font-medium text-amber-300 mb-2">Nasıl Kullanılır?</h2>
            <ol className="list-decimal list-inside text-sm text-neutral-300 space-y-1">
              <li>Aşağıdaki <strong>"Yazdır"</strong> butonuna basın.</li>
              <li>
                Yazdırma penceresinde ölçeğin <strong>"%100" / "Gerçek Boyut"</strong> olduğundan emin olun
                (yazıcı ayarlarında "Sayfaya Sığdır" seçeneğini <strong>kapatın</strong>).
              </li>
              <li>Çıkan kağıtta, elinizde zaten uyan bir yüzüğü dairelerin üzerine koyun.</li>
              <li>
                Yüzüğün iç kenarı <strong>tam olarak</strong> üst üste geldiği daire, sizin ölçünüzdür —
                hiçbir şey ölçmenize gerek yok!
              </li>
            </ol>
            <button
              onClick={() => window.print()}
              className="mt-4 flex items-center gap-2 bg-black hover:bg-neutral-800 text-amber-400 text-sm font-medium px-5 py-2.5 rounded-full"
            >
              <Printer size={16} /> Yazdır
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 justify-items-center">
            {SIZE_TABLE.map((row) => {
              const mm = diameterMm(row.circumference);
              return (
                <div key={row.size} className="flex flex-col items-center gap-1">
                  <div
                    className="rounded-full border-2 border-neutral-800"
                    style={{ width: `${mm}mm`, height: `${mm}mm` }}
                  />
                  <span className="text-xs text-neutral-400 font-medium">Ölçü {row.size}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "hesapla" && (
        <div className="print:hidden max-w-xl">
          <p className="text-neutral-400 mb-6">
            Elinizde bir kumpas veya milimetrik cetveliniz varsa, uyan bir yüzüğün
            iç çapını (mm) girerek de ölçünüzü bulabilirsiniz.
          </p>
          <label className="text-sm text-neutral-400 block mb-1">İç Çap (mm)</label>
          <input
            value={diameterInput}
            onChange={(e) => setDiameterInput(e.target.value)}
            type="number"
            step="0.1"
            placeholder="Örn: 17.3"
            className="w-full border border-white/15 rounded-lg px-4 py-3 outline-none focus:border-amber-400"
          />
          {closestSize !== null && (
            <div className="mt-6 bg-amber-400/10 border border-amber-400/20 rounded-xl p-6 text-center">
              <p className="text-sm text-neutral-400">Tahmini Yüzük Ölçünüz</p>
              <p className="text-4xl font-serif text-amber-300 mt-1">{closestSize}</p>
            </div>
          )}
        </div>
      )}

      <p className="print:hidden text-xs text-neutral-400 mt-8">
        Not: Bu hesaplama yaklaşık bir değer verir. Emin olamadığınız durumlarda
        atölyemizden ölçü halkası talep edebilirsiniz.
      </p>

      {/* Sadece yazdırma sırasında görünen başlık */}
      <div className="hidden print:block mb-6">
        <h1 className="text-xl font-bold">COTYORA TAKI — Yüzük Ölçüsü Kartı</h1>
        <p className="text-sm">
          Bu sayfayı %100 ölçekte yazdırın. Uyan bir yüzüğünüzü dairelerin üzerine koyup
          iç kenarı tam örtüşen ölçüyü bulun.
        </p>
      </div>
    </div>
  );
}
