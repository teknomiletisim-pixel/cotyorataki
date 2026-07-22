import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { orderItems, orders, products, settings, specialDays } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { DEFAULT_GOLD_PRICE_PER_GRAM } from "@/lib/pricing";

interface IncomingItem {
  productId: number;
  quantity: number;
  customization?: Record<string, string>;
  customMessage?: string;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, Number(session.user.id)))
    .orderBy(desc(orders.createdAt));

  const items = await db.select().from(orderItems);

  const withItems = myOrders.map((o) => ({
    ...o,
    items: items.filter((i) => i.orderId === o.id),
  }));

  return NextResponse.json(withItems);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Sipariş vermek için giriş yapmalısınız." }, { status: 401 });
  }

  const body = await req.json();
  const { fullName, phone, address, deliveryDate, items } = body as {
    fullName: string;
    phone: string;
    address: string;
    deliveryDate?: string;
    items: IncomingItem[];
  };

  if (!fullName || !phone || !address || !items?.length) {
    return NextResponse.json({ error: "Eksik sipariş bilgisi." }, { status: 400 });
  }

  // Güncel gram altın fiyatı - fiyat her zaman sunucu tarafında yeniden hesaplanır.
  const [goldRow] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "gold_price_per_gram"))
    .limit(1);
  const goldPricePerGram = goldRow ? Number(goldRow.value) : DEFAULT_GOLD_PRICE_PER_GRAM;

  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const [activeSpecialDay] = await db
    .select()
    .from(specialDays)
    .where(and(eq(specialDays.month, todayMonth), eq(specialDays.day, todayDay), eq(specialDays.active, true)))
    .limit(1);
  const discountRate = activeSpecialDay ? Number(activeSpecialDay.discountRate) : 0;

  let totalAmount = 0;
  const resolvedItems: {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    customization: Record<string, string>;
    customMessage?: string;
  }[] = [];

  for (const item of items) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, item.productId))
      .limit(1);
    if (!product) continue;

    let unitPrice = Math.round(Number(product.goldGrams) * goldPricePerGram + product.laborCost);
    if (activeSpecialDay) {
      unitPrice = Math.round(unitPrice * (1 - discountRate));
    }

    totalAmount += unitPrice * (item.quantity || 1);
    resolvedItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity || 1,
      unitPrice,
      customization: item.customization ?? {},
      customMessage: item.customMessage,
    });
  }

  if (resolvedItems.length === 0) {
    return NextResponse.json({ error: "Sepetteki ürünler bulunamadı." }, { status: 400 });
  }

  const [order] = await db
    .insert(orders)
    .values({
      userId: Number(session.user.id),
      fullName,
      phone,
      address,
      deliveryDate,
      totalAmount,
      discountApplied: !!activeSpecialDay,
      status: "Beklemede",
      paymentStatus: "beklemede",
    })
    .returning();

  await db.insert(orderItems).values(
    resolvedItems.map((i) => ({
      orderId: order.id,
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      customization: i.customization,
      customMessage: i.customMessage,
    }))
  );

  // NOT: Lemonsqueezy ödeme entegrasyonu bir sonraki adımda burada
  // (checkout URL oluşturma) tetiklenecek. Şimdilik sipariş "beklemede"
  // ödeme durumuyla oluşturuluyor.

  return NextResponse.json({ orderId: order.id, totalAmount });
}
