import { NextResponse } from "next/server";
import { db } from "@/db";
import { customDesignRequests, CUSTOM_DESIGN_STATUSES } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendCustomDesignUpdateEmail, type SendResult } from "@/lib/email";

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
    .returning({
      id: customDesignRequests.id,
      name: customDesignRequests.name,
      phone: customDesignRequests.phone,
      email: customDesignRequests.email,
      status: customDesignRequests.status,
      adminNote: customDesignRequests.adminNote,
    });

  if (!updated) {
    return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
  }

  const statusChanged = status !== undefined;
  const noteSaved = adminNote !== undefined && adminNote.trim() !== "";
  let notification: SendResult | null = null;

  if (statusChanged || noteSaved) {
    if (!updated.email) {
      notification = {
        sent: false,
        reason: "Bu talepte müşteri e-postası yok, bildirim gönderilemedi. Müşteriye telefonla ulaşabilirsiniz.",
      };
    } else {
      notification = await sendCustomDesignUpdateEmail({
        to: updated.email,
        customerName: updated.name,
        status: updated.status,
        adminNote: updated.adminNote,
        kind: statusChanged ? "status" : "note",
      });
    }
  }

  return NextResponse.json({ ...updated, notification });
}
