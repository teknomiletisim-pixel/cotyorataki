import { NextResponse } from "next/server";
import { db } from "@/db";
import { specialDays } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, month, day, discountRate, bannerMessage, bannerImage, active } = body as Partial<{
    name: string;
    month: number;
    day: number;
    discountRate: number;
    bannerMessage: string;
    bannerImage: string;
    active: boolean;
  }>;

  const updateValues: Record<string, unknown> = {};
  if (name !== undefined) updateValues.name = name;
  if (month !== undefined) updateValues.month = month;
  if (day !== undefined) updateValues.day = day;
  if (discountRate !== undefined) updateValues.discountRate = String(discountRate);
  if (bannerMessage !== undefined) updateValues.bannerMessage = bannerMessage;
  if (bannerImage !== undefined) updateValues.bannerImage = bannerImage;
  if (active !== undefined) updateValues.active = active;

  const [updated] = await db
    .update(specialDays)
    .set(updateValues)
    .where(eq(specialDays.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Özel gün bulunamadı." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(specialDays).where(eq(specialDays.id, Number(id)));
  return NextResponse.json({ success: true });
}
