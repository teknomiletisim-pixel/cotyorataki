import { Material, Product, SpecialDay } from "./types";

// Admin panelinden güncellenecek olan güncel gram altın fiyatı (TRY).
// Şimdilik başlangıç değeri - AppContext üzerinden state olarak yönetiliyor.
export const DEFAULT_GOLD_PRICE_PER_GRAM = 4250;

// Admin panelinden girilen gram gümüş fiyatı yoksa kullanılacak başlangıç değeri (TRY).
// Gerçek fiyatı Yönetim Paneli > Altın / Gümüş Fiyatı sayfasından mutlaka girin.
export const DEFAULT_SILVER_PRICE_PER_GRAM = 60;

export interface MetalPrices {
  gold: number; // gram altın (TRY)
  silver: number; // gram gümüş (TRY)
}

export const MATERIAL_LABELS: Record<Material, string> = {
  altin: "Altın",
  gumus: "Gümüş",
};

// Fiyat = gram metal miktarı × seçilen malzemenin gram fiyatı + işçilik.
// Bilerek tek bir "prices" nesnesi alıyor: böylece gümüş ürünün yanlışlıkla
// altın fiyatıyla hesaplanması mümkün olmuyor.
export function calculatePrice(product: Pick<Product, "material" | "goldGrams" | "laborCost">, prices: MetalPrices): number {
  const perGram = product.material === "gumus" ? prices.silver : prices.gold;
  return Math.round(product.goldGrams * perGram + product.laborCost);
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
