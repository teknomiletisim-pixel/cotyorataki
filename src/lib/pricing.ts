import { Product, SpecialDay } from "./types";

// Admin panelinden güncellenecek olan güncel gram altın fiyatı (TRY).
// Şimdilik başlangıç değeri - AppContext üzerinden state olarak yönetiliyor.
export const DEFAULT_GOLD_PRICE_PER_GRAM = 4250;

export function calculatePrice(product: Product, goldPricePerGram: number): number {
  return Math.round(product.goldGrams * goldPricePerGram + product.laborCost);
}

export const SPECIAL_DAY_DISCOUNT_RATE = 0.1;

// Özel günler artık admin panelinden yönetiliyor (veritabanı: special_days tablosu).
// Bu fonksiyon, o listeyi parametre olarak alıp bugünün özel gün olup olmadığını kontrol eder.
export function getActiveSpecialDay(
  specialDays: SpecialDay[],
  date: Date = new Date()
): SpecialDay | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return specialDays.find((sd) => sd.month === month && sd.day === day) ?? null;
}

export function formatTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}
