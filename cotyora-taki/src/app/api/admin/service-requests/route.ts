import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, serviceRequests, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const requests = await db
    .select({
      id: serviceRequests.id,
      orderId: serviceRequests.orderId,
      type: serviceRequests.type,
      reason: serviceRequests.reason,
      contactPhone: serviceRequests.contactPhone,
      status: serviceRequests.status,
      adminNote: serviceRequests.adminNote,
      createdAt: serviceRequests.createdAt,
      customerEmail: users.email,
      customerName: orders.fullName,
    })
    .from(serviceRequests)
    .leftJoin(orders, eq(serviceRequests.orderId, orders.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(serviceRequests.createdAt));

  return NextResponse.json(requests);
}
