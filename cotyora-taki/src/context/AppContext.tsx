"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { CartItem, CartItemCustomization, Product, SpecialDay } from "@/lib/types";
import { DEFAULT_GOLD_PRICE_PER_GRAM } from "@/lib/pricing";

interface AppContextValue {
  goldPricePerGram: number;
  products: Product[];
  productsLoading: boolean;
  getProductById: (id: number) => Product | undefined;
  activeSpecialDay: SpecialDay | null;
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  cart: CartItem[];
  addToCart: (
    productId: number,
    customization: CartItemCustomization,
    customMessage?: string,
    quantity?: number
  ) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  favorites: "cotyora_favorites",
  cart: "cotyora_cart",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [goldPricePerGram, setGoldPricePerGram] = useState(DEFAULT_GOLD_PRICE_PER_GRAM);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeSpecialDay, setActiveSpecialDay] = useState<SpecialDay | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Ürünleri ve güncel gram altın fiyatını veritabanından çek
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Array<Record<string, unknown>>) => {
        setProducts(
          data.map((p) => ({
            id: p.id as number,
            slug: p.slug as string,
            name: p.name as string,
            category: p.category as string,
            description: (p.description as string) ?? "",
            images: (p.images as string[]) ?? [],
            goldGrams: Number(p.goldGrams),
            laborCost: p.laborCost as number,
            bestSeller: !!p.bestSeller,
            isNew: !!p.isNew,
            customizationFields: (p.customizationFields as Product["customizationFields"]) ?? [],
            allowCustomMessage: !!p.allowCustomMessage,
            active: p.active as boolean,
          }))
        );
      })
      .finally(() => setProductsLoading(false));

    fetch("/api/gold-price")
      .then((r) => r.json())
      .then((d) => setGoldPricePerGram(d.pricePerGram))
      .catch(() => {});

    fetch("/api/special-days")
      .then((r) => r.json())
      .then((data: Record<string, unknown> | null) => {
        if (!data) {
          setActiveSpecialDay(null);
          return;
        }
        setActiveSpecialDay({
          id: data.id as number,
          name: data.name as string,
          month: data.month as number,
          day: data.day as number,
          discountRate: Number(data.discountRate),
          bannerMessage: data.bannerMessage as string,
          bannerImage: (data.bannerImage as string | null) ?? null,
          active: data.active as boolean,
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem(STORAGE_KEYS.favorites);
      const storedCart = localStorage.getItem(STORAGE_KEYS.cart);
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch {
      // localStorage erişilemezse sessizce devam et
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
  }, [cart, hydrated]);

  const getProductById = useCallback(
    (id: number) => products.find((p) => p.id === id),
    [products]
  );

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isFavorite = useCallback(
    (productId: number) => favorites.includes(productId),
    [favorites]
  );

  const addToCart = useCallback(
    (
      productId: number,
      customization: CartItemCustomization,
      customMessage?: string,
      quantity: number = 1
    ) => {
      setCart((prev) => [
        ...prev,
        { productId, customization, customMessage, quantity, status: "Beklemede" },
      ]);
    },
    []
  );

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <AppContext.Provider
      value={{
        goldPricePerGram,
        products,
        productsLoading,
        getProductById,
        activeSpecialDay,
        favorites,
        toggleFavorite,
        isFavorite,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp, AppProvider içinde kullanılmalıdır");
  return ctx;
}
