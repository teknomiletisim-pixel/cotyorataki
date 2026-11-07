"use client";

import { useEffect, useState } from "react";

// Web Audio API ile "ışıltılı" bir çan/sparkle sesi üretir (harici ses dosyasına gerek yok).
function playSparkleSound() {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Birkaç yüksek perdeli, kısa süreli ton üst üste bindirilerek "ışıltı" hissi verir.
    const notes = [1568, 1976, 2349, 2793, 3136]; // G6, B6, D7, F7, G7
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.07;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.7);
    });

    setTimeout(() => ctx.close(), 1500);
  } catch {
    // Ses API'si desteklenmiyorsa sessizce devam et
  }
}

export default function SplashIntro() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("cotyora_splash_shown");
    if (alreadyShown) {
      setVisible(false);
      return;
    }

    playSparkleSound();

    const closeTimer = setTimeout(() => setClosing(true), 1400);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("cotyora_splash_shown", "1");
    }, 2100);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-all duration-700 ease-in ${
        closing ? "scale-0 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{ transformOrigin: "center" }}
    >
      <h1
        className="text-5xl md:text-7xl font-serif tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 animate-pulse"
        style={{ letterSpacing: "0.35em" }}
      >
        COTYORA
      </h1>
    </div>
  );
}
