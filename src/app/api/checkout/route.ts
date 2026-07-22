import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

// Lemonsqueezy Checkout API ile ödeme oturumu oluşturur.
// Dokümantasyon: https://docs.lemonsqueezy.com/api/checkouts/create-checkout
// Gerekli .env.local değerleri: LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID,
// LEMONSQUEEZY_VARIANT_ID (mağazanızda "Sipariş Ödemesi" adında, fiyatı
// checkout anında özelleştirilebilen tek bir ürün/variant oluşturup ID'sini girin).
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const { orderId } = (await req.json()) as { orderId?: number };
  if (!orderId) {
    return NextResponse.json({ error: "orderId zorunludur." }, { status: 400 });
  }

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
  }
  if (order.userId !== Number(session.user.id)) {
    return NextResponse.json({ error: "Bu sipariş size ait değil." }, { status: 403 });
  }

  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

  if (!apiKey || !storeId || !variantId) {
    return NextResponse.json(
      {
        error:
          "Lemonsqueezy yapılandırması eksik. Lütfen .env.local dosyasındaki LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID ve LEMONSQUEEZY_VARIANT_ID değerlerini doldurun.",
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            custom_price: order.totalAmount * 100, // Lemonsqueezy fiyatları kuruş/cent cinsinden bekler
            product_options: {
              name: `COTYORA TAKI Sipariş #${order.id}`,
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/hesabim?tab=siparisler`,
            },
            checkout_data: {
              email: session.user.email ?? undefined,
              name: order.fullName,
              custom: { order_id: String(order.id) },
            },
          },
          relationships: {
            store: { data: { type: "stores", id: String(storeId) } },
            variant: { data: { type: "variants", id: String(variantId) } },
          },
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Lemonsqueezy checkout hatası:", errText);
      return NextResponse.json(
        { error: "Ödeme oturumu oluşturulamadı. Lemonsqueezy ayarlarınızı kontrol edin." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const checkoutUrl = data?.data?.attributes?.url as string | undefined;

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Ödeme linki alınamadı." }, { status: 502 });
    }

    await db
      .update(orders)
      .set({ lemonsqueezyCheckoutUrl: checkoutUrl })
      .where(eq(orders.id, order.id));

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("Lemonsqueezy bağlantı hatası:", err);
    return NextResponse.json(
      { error: "Ödeme sağlayıcısına bağlanılamadı." },
      { status: 502 }
    );
  }
}
