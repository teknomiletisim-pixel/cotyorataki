import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_GOLD_PRICE_PER_GRAM } from "@/lib/pricing";

export async function GET() {
  const [row] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "gold_price_per_gram"))
    .limit(1);

  const pricePerGram = row ? Number(row.value) : DEFAULT_GOLD_PRICE_PER_GRAM;
  return NextResponse.json({ pricePerGram });
}
