import { NextResponse } from "next/server";
import { db } from "@/db";
import { specialDays } from "@/db/schema";
import { and, eq } from "drizzle-orm";

// Herkese açık: bugün aktif olan özel günü döner (yoksa null).
// Ürün fiyatlandırması ve karşılama banner'ı bu uç noktayı kullanır.
export async function GET() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const [active] = await db
    .select()
    .from(specialDays)
    .where(and(eq(specialDays.month, month), eq(specialDays.day, day), eq(specialDays.active, true)))
    .limit(1);

  return NextResponse.json(active ?? null);
}
