import { CustomizationField } from "./types";

export interface SeedProduct {
  slug: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  goldGrams: number;
  laborCost: number;
  bestSeller?: boolean;
  isNew?: boolean;
  customization: CustomizationField[];
  allowCustomMessage?: boolean;
}

// NOT: Bu görseller yer tutucudur (placeholder). Gerçek ürün fotoğraflarınızı
// admin panelinden (bir sonraki aşamada kurulacak) yükleyebileceksiniz.
export const products: SeedProduct[] = [
  {
    slug: "yuzuk-zerafet",
    name: "Zerafet Tektaş Yüzük",
    category: "Yüzük",
    description:
      "İnce zarafeti simgeleyen, tek taş detaylı 14 ayar altın yüzük. Günlük kullanıma uygun, hafif ve şık tasarım.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
    ],
    goldGrams: 2.1,
    laborCost: 850,
    bestSeller: true,
    customization: [
      { key: "ringSize", label: "Yüzük Ölçüsü", placeholder: "Örn: 14" },
    ],
    allowCustomMessage: true,
  },
  {
    slug: "kolye-ayyildiz",
    name: "Ay Yıldız Kolye",
    category: "Kolye",
    description:
      "Zincir detaylı, minimal ay yıldız işlemeli kolye. Hediyelik ve günlük kombin için ideal.",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80",
    ],
    goldGrams: 3.4,
    laborCost: 1100,
    bestSeller: true,
    customization: [
      { key: "chainLength", label: "Kolye Uzunluğu (cm)", placeholder: "Örn: 45" },
    ],
    allowCustomMessage: true,
  },
  {
    slug: "bileklik-ince-zincir",
    name: "İnce Zincir Bileklik",
    category: "Bileklik",
    description: "Katlanabilir, ince işçilikli günlük bileklik.",
    images: [
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80",
      "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=800&q=80",
    ],
    goldGrams: 1.8,
    laborCost: 600,
    customization: [
      { key: "wristLength", label: "Bileklik Uzunluğu (cm)", placeholder: "Örn: 17" },
    ],
    allowCustomMessage: false,
  },
  {
    slug: "kupe-damla",
    name: "Damla Küpe",
    category: "Küpe",
    description: "Zarif damla formunda, taşlı detaylı küpe.",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80",
    ],
    goldGrams: 2.6,
    laborCost: 780,
    bestSeller: true,
    customization: [],
    allowCustomMessage: false,
  },
  {
    slug: "set-gelin",
    name: "Gelin Seti (Kolye + Küpe)",
    category: "Set",
    description: "Özel günler için tasarlanmış kolye ve küpe seti.",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    ],
    goldGrams: 6.2,
    laborCost: 2400,
    customization: [
      { key: "chainLength", label: "Kolye Uzunluğu (cm)", placeholder: "Örn: 42" },
    ],
    allowCustomMessage: true,
  },
  {
    slug: "yuzuk-alyans-ince",
    name: "İnce Alyans",
    category: "Yüzük",
    description: "Klasik ve zamansız ince alyans tasarımı, tek veya çift olarak sipariş edilebilir.",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    ],
    goldGrams: 2.9,
    laborCost: 700,
    customization: [
      { key: "ringSize", label: "Yüzük Ölçüsü", placeholder: "Örn: 16" },
      { key: "ringThickness", label: "Yüzük Kalınlığı (mm)", placeholder: "Örn: 2" },
    ],
    allowCustomMessage: true,
  },
];


