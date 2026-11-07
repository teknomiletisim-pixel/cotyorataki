import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notifyAdmin } from "@/lib/email";

// Lemonsqueezy Webhook: https://docs.lemonsqueezy.com/help/webhooks
// Mağaza panelinizde webhook URL'sini şu şekilde tanımlayın:
//   https://SIZIN-DOMAININIZ.com/api/webhooks/lemonsqueezy
// ve "order_created" olayını dinleyin. Secret değerini .env.local'daki
// LEMONSQUEEZY_WEBHOOK_SECRET ile aynı yapın.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "";

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const isValid =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (!isValid) {
    return NextResponse.json({ error: "Geçersiz imza." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload?.meta?.event_name as string | undefined;
  const orderIdFromCustomData = payload?.meta?.custom_data?.order_id as string | undefined;

  if (eventName === "order_created" && orderIdFromCustomData) {
    const status = payload?.data?.attributes?.status; // 'paid', 'pending', 'refunded', vb.
    await db
      .update(orders)
      .set({
        paymentStatus: status === "paid" ? "odendi" : "beklemede",
        lemonsqueezyOrderId: String(payload?.data?.id ?? ""),
      })
      .where(eq(orders.id, Number(orderIdFromCustomData)));
  }

  if (eventName === "order_created" && orderIdFromCustomData && payload?.data?.attributes?.status === "paid") {
    await notifyAdmin("Ödeme alındı", [`Sipariş no: #${orderIdFromCustomData}`], "/admin/siparisler");
  }

  if (eventName === "order_refunded" && orderIdFromCustomData) {
    await db
      .update(orders)
      .set({ paymentStatus: "iptal" })
      .where(eq(orders.id, Number(orderIdFromCustomData)));
  }

  return NextResponse.json({ received: true });
}
