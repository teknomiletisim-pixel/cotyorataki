import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminEmail, getEmailConfigStatus, sendTestEmail } from "@/lib/email";

// Ayar durumunu gösterir (değerleri değil, sadece tanımlı olup olmadığını).
export async function GET() {
  return NextResponse.json(getEmailConfigStatus());
}

// Yöneticiye gerçek bir test e-postası gönderir ve sonucu/hatayı döndürür.
export async function POST() {
  const session = await auth();
  const to = session?.user?.email || getAdminEmail();
  if (!to) {
    return NextResponse.json({ sent: false, reason: "Test e-postasının gönderileceği adres bulunamadı." });
  }
  const result = await sendTestEmail(to);
  return NextResponse.json({ ...result, to });
}
