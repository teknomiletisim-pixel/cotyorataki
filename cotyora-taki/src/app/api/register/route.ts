import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone, address } = body as {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      address?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // NOT: role her zaman 'customer' olarak kaydedilir. Admin hesabı sadece
    // seed script'i ile (.env.local -> ADMIN_EMAIL/ADMIN_PASSWORD) oluşturulur;
    // bu uçtan admin hesabı açılamaz.
    await db.insert(users).values({
      email: normalizedEmail,
      passwordHash,
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      phone: phone ?? "",
      address: address ?? "",
      role: "customer",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Kayıt hatası:", err);
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
