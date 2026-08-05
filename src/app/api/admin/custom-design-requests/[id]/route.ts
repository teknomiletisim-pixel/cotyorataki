import { NextResponse } from "next/server";
import { db } from "@/db";
import { customDesignRequests, CUSTOM_DESIGN_STATUSES } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status, adminNote } = body as { status?: string; adminNote?: string };

  if (status && !CUSTOM_DESIGN_STATUSES.includes(status as (typeof CUSTOM_DESIGN_STATUSES)[number])) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  const updateValues: Record<string, unknown> = {};
  if (status !== undefined) updateValues.status = status;
  if (adminNote !== undefined) updateValues.adminNote = adminNote;

  const [updated] = await db
    .update(customDesignRequests)
    .set(updateValues)
    .where(eq(customDesignRequests.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
  }
  return NextResponse.json(updated);
}
