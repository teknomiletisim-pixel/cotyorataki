import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, serviceRequests, SERVICE_REQUEST_STATUSES, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendServiceRequestUpdateEmail, type SendResult } from "@/lib/email";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status, adminNote } = body as { status?: string; adminNote?: string };

  if (status && !SERVICE_REQUEST_STATUSES.includes(status as (typeof SERVICE_REQUEST_STATUSES)[number])) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  const updateValues: Record<string, unknown> = {};
  if (status !== undefined) updateValues.status = status;
  if (adminNote !== undefined) updateValues.adminNote = adminNote;

  const [updated] = await db
    .update(serviceRequests)
    .set(updateValues)
    .where(eq(serviceRequests.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
  }

  // Durum değiştiyse VEYA boş olmayan bir not kaydedildiyse müşteriye e-posta gönder.
  const statusChanged = status !== undefined;
  const noteSaved = adminNote !== undefined && adminNote.trim() !== "";
  let notification: SendResult | null = null;

  if (statusChanged || noteSaved) {
    notification = { sent: false, reason: "Talebin bağlı olduğu müşteri bulunamadı." };
    if (updated.orderId) {
      const [order] = await db.select().from(orders).where(eq(orders.id, updated.orderId)).limit(1);
      if (order?.userId) {
        const [customer] = await db
          .select({ email: users.email, firstName: users.firstName })
          .from(users)
          .where(eq(users.id, order.userId))
          .limit(1);
        if (customer?.email) {
          notification = await sendServiceRequestUpdateEmail({
            to: customer.email,
            customerName: customer.firstName || order.fullName,
            orderId: order.id,
            type: updated.type,
            status: updated.status,
            adminNote: updated.adminNote,
            kind: statusChanged ? "status" : "note",
          });
        }
      }
    }
  }

  return NextResponse.json({ ...updated, notification });
}
