"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Gem, ShieldCheck, Truck } from "lucide-react";
import { Product, SpecialDay } from "@/lib/types";

interface Slide {
  key: string;
  image: string;
  isSpecialDay: boolean;
}

const AUTO_ADVANCE_MS = 10000;
const DEFAULT_SPECIAL_DAY_IMAGE =
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&q=80";

const SIDE_FEATURES = [
  { icon: Gem, label: "ÖZEL\nTASARIM", href: "/ozel-tasarim" },
  { icon: ShieldCheck, label: "GÜVENLİ\nALIŞVERİŞ", href: null },
  { icon: Truck, label: "ÜCRETSİZ\nKARGO", href: null },
];

export default function HeroCarousel({
  products,
  activeSpecialDay,
}: {
  products: Product[];
  activeSpecialDay: SpecialDay | null;
}) {
  const productSlides: Slide[] = products.slice(0, 5).map((p) => ({
    key: `product-${p.id}`,
    image: p.images[0],
    isSpecialDay: false,
  }));

  const slides: Slide[] = activeSpecialDay
    ? [
        {
          key: "special-day",
          image: activeSpecialDay.bannerImage || DEFAULT_SPECIAL_DAY_IMAGE,
          isSpecialDay: true,
        },
        ...productSlides,
      ]
    : productSlides;

  const [index, setIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  function goTo(i: number) {
    setIndex(((i % slides.length) + slides.length) % slides.length);
  }

  function handleDragStart(x: number) {
    dragStartX.current = x;
  }

  function handleDragEnd(x: number) {
    if (dragStartX.current === null) return;
    const delta = x - dragStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goTo(index + 1);
      else goTo(index - 1);
    }
    dragStartX.current = null;
  }

  if (slides.length === 0) {
    return (
      <div className="w-full aspect-[4/5] sm:aspect-[21/9] bg-gradient-to-br from-neutral-950 via-black to-neutral-900" />
    );
  }

  return (
    <div
      className="relative w-full aspect-[4/5] sm:aspect-[21/9] overflow-hidden select-none bg-black"
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseUp={(e) => handleDragEnd(e.clientX)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.key}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 sm:hidden" />

          <div className="relative h-full flex flex-col justify-end sm:justify-center items-center sm:items-start text-center sm:text-left px-6 sm:px-14 pb-16 sm:pb-0 max-w-3xl">
            {slide.isSpecialDay && activeSpecialDay ? (
              <>
                <p className="text-amber-400 tracking-[0.3em] text-xs sm:text-sm font-medium mb-4">
                  · ÖZEL GÜN
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl text-white uppercase leading-tight">
                  {activeSpecialDay.bannerMessage}
                </h2>
                <Link
                  href="/katalog"
                  className="mt-8 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-8 py-3.5 rounded-sm font-semibold tracking-wide text-sm transition-colors"
                >
                  HEMEN ALIŞVERİŞE BAŞLA →
                </Link>
              </>
            ) : (
              <>
                <p className="text-amber-400 tracking-[0.3em] text-xs sm:text-sm font-medium mb-4">
                  · COTYORA TAKI
                </p>
                <h1 className="font-serif text-4xl sm:text-6xl text-white leading-[1.1] uppercase">
                  Zarafeti Geleceğe
                  <br />
                  Taşıyoruz
                </h1>
                <p className="text-neutral-300 max-w-md mt-5 hidden sm:block">
                  Geleneksel ustalığı, modern tasarım anlayışıyla buluşturuyoruz.
                  Her parça, senin hikayeni anlatır.
                </p>
                <Link
                  href="/katalog"
                  className="mt-8 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-8 py-3.5 rounded-sm font-semibold tracking-wide text-sm transition-colors"
                >
                  KOLEKSİYONU KEŞFET →
                </Link>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Sağ üstte sabit özellik ikonları (masaüstü) */}
      <div className="hidden lg:flex flex-col gap-6 absolute right-8 top-1/2 -translate-y-1/2 z-10">
        {SIDE_FEATURES.map(({ icon: Icon, label, href }) => {
          const content = (
            <div className="flex flex-col items-center gap-1.5 text-white/70 hover:text-amber-400 transition-colors cursor-pointer">
              <Icon size={18} />
              <span className="text-[9px] tracking-widest text-center leading-tight whitespace-pre-line">
                {label}
              </span>
            </div>
          );
          return href ? (
            <Link key={label} href={href}>
              {content}
            </Link>
          ) : (
            <div key={label}>{content}</div>
          );
        })}
      </div>

      {/* Slayt sayacı (01 — 02 — 03) */}
      <div className="absolute bottom-6 left-6 sm:left-14 z-10 flex items-center gap-2 text-white/60 text-xs tracking-widest">
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            onClick={() => goTo(i)}
            className={`transition-colors ${i === index ? "text-amber-400" : "hover:text-white"}`}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
    </div>
  );
}
