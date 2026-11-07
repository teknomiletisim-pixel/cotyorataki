import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderItems, orders, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// NOT: Bu route middleware tarafından zaten admin rolüyle korunuyor
// (bkz. src/middleware.ts, /api/admin/:path* eşleşmesi).
export async function GET() {
  const allOrders = await db
    .select({
      id: orders.id,
      fullName: orders.fullName,
      phone: orders.phone,
      address: orders.address,
      deliveryDate: orders.deliveryDate,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
      customerEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  const items = await db.select().from(orderItems);

  const withItems = allOrders.map((o) => ({
    ...o,
    items: items.filter((i) => i.orderId === o.id),
  }));

  return NextResponse.json(withItems);
}
