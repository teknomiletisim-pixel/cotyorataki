"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useApp } from "@/context/AppContext";

const DEFAULT_BANNER_IMAGE =
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80";

export default function DiscountBanner() {
  const { activeSpecialDay } = useApp();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!activeSpecialDay) return;

    const dismissKey = `cotyora_discount_dismissed_${activeSpecialDay.month}_${activeSpecialDay.day}`;
    const dismissed = localStorage.getItem(dismissKey);
    if (dismissed) return;

    setShow(true);
  }, [activeSpecialDay]);

  function handleClose() {
    if (activeSpecialDay) {
      const dismissKey = `cotyora_discount_dismissed_${activeSpecialDay.month}_${activeSpecialDay.day}`;
      localStorage.setItem(dismissKey, "1");
    }
    setShow(false);
  }

  if (!show || !activeSpecialDay) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-amber-200">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-1.5 text-neutral-500 hover:text-neutral-800"
          aria-label="Kapat"
        >
          <X size={18} />
        </button>

        <div className="relative w-full aspect-[4/3] bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeSpecialDay.bannerImage || DEFAULT_BANNER_IMAGE}
            alt={activeSpecialDay.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 text-center">
          <h3 className="font-serif text-lg text-amber-900 leading-snug uppercase tracking-wide">
            {activeSpecialDay.bannerMessage}
          </h3>
          <button
            onClick={handleClose}
            className="mt-4 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium px-6 py-2.5 rounded-full"
          >
            Alışverişe Başla
          </button>
        </div>
      </div>
    </div>
  );
}
