import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { DEFAULT_GOLD_PRICE_PER_GRAM, DEFAULT_SILVER_PRICE_PER_GRAM } from "@/lib/pricing";

// pricePerGram = gram ALTIN (eski alan adı, geriye dönük uyumluluk için korunuyor)
// silverPricePerGram = gram GÜMÜŞ
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select()
    .from(settings)
    .where(inArray(settings.key, ["gold_price_per_gram", "silver_price_per_gram"]));

  const gold = rows.find((r) => r.key === "gold_price_per_gram");
  const silver = rows.find((r) => r.key === "silver_price_per_gram");

  return NextResponse.json({
    pricePerGram: gold ? Number(gold.value) : DEFAULT_GOLD_PRICE_PER_GRAM,
    silverPricePerGram: silver ? Number(silver.value) : DEFAULT_SILVER_PRICE_PER_GRAM,
    silverPriceSet: !!silver,
  });
}
