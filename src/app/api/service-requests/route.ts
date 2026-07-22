import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { orders, serviceRequests, SERVICE_REQUEST_TYPES } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  // Sadece giriş yapan kullanıcının kendi siparişlerine ait talepler
  const myOrders = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.userId, Number(session.user.id)));
  const myOrderIds = myOrders.map((o) => o.id);

  if (myOrderIds.length === 0) return NextResponse.json([]);

  const all = await db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
  const mine = all.filter((r) => r.orderId !== null && myOrderIds.includes(r.orderId));

  return NextResponse.json(mine);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Talep oluşturmak için giriş yapmalısınız." }, { status: 401 });
  }

  const body = await req.json();
  const { orderId, type, reason, contactPhone } = body as {
    orderId?: number;
    type?: string;
    reason?: string;
    contactPhone?: string;
  };

  if (!orderId || !type || !reason?.trim()) {
    return NextResponse.json({ error: "Sipariş no, işlem türü ve açıklama zorunludur." }, { status: 400 });
  }
  if (!SERVICE_REQUEST_TYPES.includes(type as (typeof SERVICE_REQUEST_TYPES)[number])) {
    return NextResponse.json({ error: "Geçersiz işlem türü." }, { status: 400 });
  }

  // Sipariş numarasının gerçekten bu kullanıcıya ait olduğunu doğrula
  const [order] = await db.select().from(orders).where(eq(orders.id, Number(orderId))).limit(1);
  if (!order) {
    return NextResponse.json({ error: "Bu sipariş numarasıyla bir sipariş bulunamadı." }, { status: 404 });
  }
  if (order.userId !== Number(session.user.id)) {
    return NextResponse.json({ error: "Bu sipariş size ait değil." }, { status: 403 });
  }

  const [created] = await db
    .insert(serviceRequests)
    .values({
      orderId: order.id,
      type,
      reason: reason.trim(),
      contactPhone: contactPhone?.trim() || null,
    })
    .returning();

  return NextResponse.json(created);
}
