"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Product, SpecialDay } from "@/lib/types";

interface Slide {
  key: string;
  image: string;
  isSpecialDay: boolean;
}

const AUTO_ADVANCE_MS = 10000;
const DEFAULT_SPECIAL_DAY_IMAGE =
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&q=80";

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
  const containerRef = useRef<HTMLDivElement>(null);

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
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] sm:aspect-[16/9] overflow-hidden select-none bg-black"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          <div className="relative h-full flex flex-col items-center justify-end sm:justify-center text-center px-6 pb-16 sm:pb-0">
            {slide.isSpecialDay && activeSpecialDay ? (
              <>
                <p className="text-amber-400 tracking-[0.25em] text-xs sm:text-sm font-medium mb-3">
                  ÖZEL GÜN
                </p>
                <h2 className="font-serif text-2xl sm:text-4xl text-white max-w-2xl uppercase leading-snug">
                  {activeSpecialDay.bannerMessage}
                </h2>
                <Link
                  href="/katalog"
                  className="mt-6 inline-block bg-amber-400 hover:bg-amber-300 text-black px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  Hemen Alışverişe Başla
                </Link>
              </>
            ) : (
              <>
                <p className="text-amber-400 tracking-[0.3em] text-xs sm:text-sm font-medium mb-4">
                  EL İŞÇİLİĞİ · ÖZEL TASARIM
                </p>
                <h1 className="font-serif text-4xl sm:text-6xl text-white mb-4 tracking-wide">
                  COTYORA TAKI
                </h1>
                <p className="text-neutral-200 max-w-xl mb-8 hidden sm:block">
                  Sizin için özel olarak tasarlanan ve üretilen, zamana meydan okuyan takılar.
                </p>
                <Link
                  href="/katalog"
                  className="inline-block bg-amber-400 hover:bg-amber-300 text-black px-8 py-3 rounded-full font-semibold transition-colors"
                >
                  Kataloğu Keşfet
                </Link>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Nokta göstergeleri */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            onClick={() => goTo(i)}
            aria-label={`${i + 1}. slayda git`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-amber-400" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Sol/sağ ok butonları (masaüstünde daha görünür) */}
      <button
        onClick={() => goTo(index - 1)}
        aria-label="Önceki"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur"
      >
        ‹
      </button>
      <button
        onClick={() => goTo(index + 1)}
        aria-label="Sonraki"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur"
      >
        ›
      </button>
    </div>
  );
}
