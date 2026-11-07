import type { MetadataRoute } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

// Ürünler admin panelinden sürekli eklenip çıkarılabildiği için, sitemap'in
// her build'de değil, her istekte güncel veritabanı durumunu yansıtması gerekir.
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cotyorataki.com";

const STATIC_PAGES = [
  "",
  "/katalog",
  "/biz-kimiz",
  "/blog",
  "/sss",
  "/garanti-iade",
  "/ozel-tasarim",
  "/yuzuk-olcusu",
  "/kargom-nerede",
  "/sozlesmeler/satis",
  "/sozlesmeler/uyelik",
  "/sozlesmeler/gizlilik",
  "/sozlesmeler/dagitim",
  "/sozlesmeler/garanti-iade",
  "/sozlesmeler/kvkk",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const activeProducts = await db
      .select({ slug: products.slug, createdAt: products.createdAt })
      .from(products)
      .where(eq(products.active, true));

    productEntries = activeProducts.map((p) => ({
      url: `${SITE_URL}/urun/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // Veritabanına erişilemezse sitemap yine de statik sayfalarla oluşsun
  }

  return [...staticEntries, ...productEntries];
}
