import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

// Kullanıcılar: hem müşteriler hem de yönetici tek tabloda tutulur.
// role alanı 'customer' veya 'admin' olabilir. Admin hesabı seed script'i
// ile ADMIN_EMAIL / ADMIN_PASSWORD üzerinden oluşturulur.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 100 }).default(""),
  lastName: varchar("last_name", { length: 100 }).default(""),
  phone: varchar("phone", { length: 30 }).default(""),
  address: text("address").default(""),
  role: varchar("role", { length: 20 }).notNull().default("customer"), // 'customer' | 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Yüzük | Kolye | Bileklik | Küpe | Set
  description: text("description").default(""),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  goldGrams: numeric("gold_grams", { precision: 10, scale: 3 }).notNull(),
  laborCost: integer("labor_cost").notNull(), // TRY, sabit işçilik bedeli
  bestSeller: boolean("best_seller").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  customizationFields: jsonb("customization_fields")
    .$type<{ key: string; label: string; placeholder?: string }[]>()
    .notNull()
    .default([]),
  allowCustomMessage: boolean("allow_custom_message").notNull().default(false),
  active: boolean("active").notNull().default(true), // silme yerine pasife alma
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ORDER_STATUSES = [
  "Beklemede",
  "Onaylandı",
  "Hazırlanıyor",
  "Yolda",
  "Teslim Edildi",
  "İptal Edildi",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fullName: varchar("full_name", { length: 150 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  address: text("address").notNull(),
  deliveryDate: varchar("delivery_date", { length: 20 }),
  status: varchar("status", { length: 20 }).notNull().default("Beklemede"),
  totalAmount: integer("total_amount").notNull(), // TRY, sipariş anındaki toplam
  discountApplied: boolean("discount_applied").notNull().default(false),
  lemonsqueezyOrderId: text("lemonsqueezy_order_id"),
  lemonsqueezyCheckoutUrl: text("lemonsqueezy_checkout_url"),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("beklemede"), // beklemede | odendi | iptal
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 200 }).notNull(), // sipariş anındaki isim (ürün silinse de kalsın)
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(), // sipariş anındaki fiyat (TRY)
  customization: jsonb("customization").$type<Record<string, string>>().default({}),
  customMessage: text("custom_message"),
});

// Basit anahtar-değer ayarlar tablosu: güncel gram altın fiyatı burada tutulur.
export const settings = pgTable("settings", {
  key: varchar("key", { length: 50 }).primaryKey(),
  value: text("value").notNull(),
});

// Özel günler: admin panelinden yönetilir. Bugünün ay/gün bilgisi burada
// aktif (active=true) bir kayıtla eşleşirse, tüm ürünlerde indirim uygulanır
// ve ana sayfada karşılama banner'ı gösterilir.
export const specialDays = pgTable("special_days", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // Örn: "Anneler Günü"
  month: integer("month").notNull(), // 1-12
  day: integer("day").notNull(), // 1-31
  discountRate: numeric("discount_rate", { precision: 4, scale: 3 }).notNull().default("0.10"), // 0.10 = %10
  bannerMessage: text("banner_message").notNull(), // Örn: "ANNELER GÜNÜNE ÖZEL TÜM ÜRÜNLERDE %10 İNDİRİM"
  bannerImage: text("banner_image"), // Karşılama ekranındaki görsel URL'i
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Değişim / İade / Garanti talepleri: müşteri sipariş numarasıyla talep açar,
// admin panelinden görüntülenip durumu güncellenir.
export const SERVICE_REQUEST_TYPES = ["degisim", "iade", "garanti"] as const;
export type ServiceRequestType = (typeof SERVICE_REQUEST_TYPES)[number];

export const SERVICE_REQUEST_STATUSES = ["Beklemede", "İnceleniyor", "Onaylandı", "Reddedildi", "Tamamlandı"] as const;

export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  type: varchar("type", { length: 20 }).notNull(), // degisim | iade | garanti
  reason: text("reason").notNull(),
  contactPhone: varchar("contact_phone", { length: 30 }),
  status: varchar("status", { length: 20 }).notNull().default("Beklemede"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

