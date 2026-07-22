export type Category = "Yüzük" | "Kolye" | "Bileklik" | "Küpe" | "Set";

export interface CustomizationField {
  key: string;
  label: string;
  placeholder?: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: Category | string;
  description: string;
  images: string[];
  goldGrams: number; // ürünün gram altın karşılığı
  laborCost: number; // işçilik + tasarım bedeli (TRY, sabit)
  bestSeller?: boolean;
  isNew?: boolean;
  customizationFields: CustomizationField[]; // ör: yüzük ölçüsü, kolye boyu
  allowCustomMessage?: boolean;
  active?: boolean;
}

export interface CartItemCustomization {
  [key: string]: string;
}

export type OrderStatus =
  | "Beklemede"
  | "Onaylandı"
  | "Hazırlanıyor"
  | "Yolda"
  | "Teslim Edildi"
  | "İptal Edildi";

export interface CartItem {
  productId: number;
  quantity: number;
  customization: CartItemCustomization;
  customMessage?: string;
  status?: OrderStatus; // sipariş verildikten sonra atanır
}

export interface SpecialDay {
  id?: number;
  name: string;
  month: number; // 1-12
  day: number;
  discountRate: number; // 0.10 = %10
  bannerMessage: string;
  bannerImage?: string | null;
  active?: boolean;
}
