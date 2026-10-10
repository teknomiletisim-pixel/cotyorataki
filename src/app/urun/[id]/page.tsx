import type { Metadata } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProductDetailClient from "./ProductDetailClient";

// Google'ın her ürünü kendi başlık/açıklamasıyla dizinlemesi için sunucu
// tarafında bu ürüne özel metadata üretiyoruz. Sayfanın interaktif kısmı
// (sepete ekleme, favori, kişiselleştirme) hâlâ ProductDetailClient'ta.
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, id))
      .limit(1);

    if (!product) {
      return { title: "Ürün Bulunamadı" };
    }

    const description =
      product.description?.slice(0, 155) ||
      `${product.name} - COTYORA TAKI özel tasarım ${product.category.toLowerCase()} koleksiyonu.`;

    return {
      title: product.name,
      description,
      alternates: { canonical: `/urun/${product.slug}` },
      openGraph: {
        title: `${product.name} | COTYORA TAKI`,
        description,
        images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
      },
    };
  } catch {
    return { title: "COTYORA TAKI" };
  }
}

export default async function ProductDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let jsonLd = null;

  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, id))
      .limit(1);

    if (product) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.images,
        category: product.category,
        brand: { "@type": "Brand", name: "COTYORA TAKI" },
      };
    }
  } catch {
    // JSON-LD olmadan da sayfa normal çalışmaya devam eder
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient />
    </>
  );
}
