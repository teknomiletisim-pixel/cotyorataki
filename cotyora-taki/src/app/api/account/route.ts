import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      address: users.address,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, Number(session.user.id)))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const body = await req.json();
  const { firstName, lastName, phone, address, newPassword } = body as {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    newPassword?: string;
  };

  const updateValues: Record<string, unknown> = {};
  if (firstName !== undefined) updateValues.firstName = firstName;
  if (lastName !== undefined) updateValues.lastName = lastName;
  if (phone !== undefined) updateValues.phone = phone;
  if (address !== undefined) updateValues.address = address;
  if (newPassword) {
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Yeni şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }
    updateValues.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const [updated] = await db
    .update(users)
    .set(updateValues)
    .where(eq(users.id, Number(session.user.id)))
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      address: users.address,
    });

  return NextResponse.json(updated);
}
