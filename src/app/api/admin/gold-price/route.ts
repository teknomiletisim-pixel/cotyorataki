import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";

async function saveSetting(key: string, value: number) {
  await db
    .insert(settings)
    .values({ key, value: String(value) })
    .onConflictDoUpdate({ target: settings.key, set: { value: String(value) } });
}

// Gövde: { pricePerGram?: number (gram altın), silverPricePerGram?: number (gram gümüş) }
// En az biri gönderilmelidir. Fiyat değişince o malzemedeki tüm ürünlerin fiyatı
// otomatik güncellenir (fiyat = gram miktarı × gram fiyatı + işçilik).
export async function PUT(req: Request) {
  const body = await req.json();
  const { pricePerGram, silverPricePerGram } = body as {
    pricePerGram?: number;
    silverPricePerGram?: number;
  };

  const goldGiven = pricePerGram !== undefined;
  const silverGiven = silverPricePerGram !== undefined;

  if (!goldGiven && !silverGiven) {
    return NextResponse.json({ error: "Güncellenecek bir fiyat gönderilmedi." }, { status: 400 });
  }
  if (goldGiven && !(Number(pricePerGram) > 0)) {
    return NextResponse.json({ error: "Geçersiz gram altın fiyatı." }, { status: 400 });
  }
  if (silverGiven && !(Number(silverPricePerGram) > 0)) {
    return NextResponse.json({ error: "Geçersiz gram gümüş fiyatı." }, { status: 400 });
  }

  if (goldGiven) await saveSetting("gold_price_per_gram", Number(pricePerGram));
  if (silverGiven) await saveSetting("silver_price_per_gram", Number(silverPricePerGram));

  return NextResponse.json({ success: true, pricePerGram, silverPricePerGram });
}
