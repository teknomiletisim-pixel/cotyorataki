import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  const body = await req.json();
  const { pricePerGram } = body as { pricePerGram?: number };

  if (!pricePerGram || pricePerGram <= 0) {
    return NextResponse.json({ error: "Geçersiz fiyat." }, { status: 400 });
  }

  await db
    .insert(settings)
    .values({ key: "gold_price_per_gram", value: String(pricePerGram) })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: String(pricePerGram) },
    });

  // Bu fiyat değiştiğinde, gram altına bağlı tüm ürün fiyatları otomatik
  // olarak orantılı şekilde güncellenmiş olur (fiyat = goldGrams * pricePerGram + laborCost).
  return NextResponse.json({ success: true, pricePerGram });
}
