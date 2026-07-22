import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, ORDER_STATUSES, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendOrderStatusEmail } from "@/lib/email";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body as { status?: string };

  if (!status || !ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return NextResponse.json({ error: "Geçersiz sipariş durumu." }, { status: 400 });
  }

  const [updated] = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
  }

  // Durum değiştiğinde müşteriye e-posta bildirimi gönder (best-effort;
  // e-posta ayarlanmamışsa veya gönderim başarısız olursa işlem yine de tamamlanır).
  if (updated.userId) {
    const [customer] = await db
      .select({ email: users.email, firstName: users.firstName })
      .from(users)
      .where(eq(users.id, updated.userId))
      .limit(1);

    if (customer?.email) {
      await sendOrderStatusEmail({
        to: customer.email,
        orderId: updated.id,
        customerName: customer.firstName ?? updated.fullName,
        status,
      });
    }
  }

  return NextResponse.json(updated);
}
