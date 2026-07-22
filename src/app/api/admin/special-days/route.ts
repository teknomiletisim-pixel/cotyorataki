import { NextResponse } from "next/server";
import { db } from "@/db";
import { specialDays } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  const all = await db.select().from(specialDays).orderBy(asc(specialDays.month), asc(specialDays.day));
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, month, day, discountRate, bannerMessage, bannerImage, active } = body as {
    name: string;
    month: number;
    day: number;
    discountRate?: number;
    bannerMessage: string;
    bannerImage?: string;
    active?: boolean;
  };

  if (!name || !month || !day || !bannerMessage) {
    return NextResponse.json({ error: "Eksik alanlar var." }, { status: 400 });
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return NextResponse.json({ error: "Geçersiz ay/gün değeri." }, { status: 400 });
  }

  const [created] = await db
    .insert(specialDays)
    .values({
      name,
      month,
      day,
      discountRate: String(discountRate ?? 0.1),
      bannerMessage,
      bannerImage: bannerImage ?? null,
      active: active ?? true,
    })
    .returning();

  return NextResponse.json(created);
}
