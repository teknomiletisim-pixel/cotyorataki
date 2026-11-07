import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { customDesignRequests } from "@/db/schema";
import { notifyAdmin } from "@/lib/email";

// Tek bir dosya için makul bir üst sınır (base64 olarak DB'de tutulduğu için).
const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // ~4MB
const MAX_FILES = 4;

export async function POST(req: Request) {
  const session = await auth();

  const body = await req.json();
  const { name, phone, email, description, media } = body as {
    name?: string;
    phone?: string;
    email?: string;
    description?: string;
    media?: { type: "image" | "video"; dataUrl: string; filename: string }[];
  };

  if (!name?.trim() || !phone?.trim() || !description?.trim()) {
    return NextResponse.json(
      { error: "Ad, telefon ve açıklama zorunludur." },
      { status: 400 }
    );
  }

  // E-posta opsiyonel; verilmediyse ve kullanıcı giriş yapmışsa hesabının e-postası kullanılır.
  const rawEmail = (email?.trim() || session?.user?.email || "").toLowerCase();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail) ? rawEmail : null;

  const safeMedia = (media ?? []).slice(0, MAX_FILES).filter((m) => {
    // dataUrl base64: "data:image/png;base64,AAAA..." — kabaca boyut kontrolü
    const approxBytes = Math.ceil((m.dataUrl.length * 3) / 4);
    return approxBytes <= MAX_FILE_SIZE_BYTES;
  });

  const [created] = await db
    .insert(customDesignRequests)
    .values({
      userId: session?.user ? Number(session.user.id) : null,
      name: name.trim(),
      phone: phone.trim(),
      email: validEmail,
      description: description.trim(),
      media: safeMedia,
    })
    .returning({ id: customDesignRequests.id });

  // Yöneticiye (size) bildirim — gönderilemese de talep kaydedilmiş olur.
  await notifyAdmin(
    "Yeni özel tasarım talebi",
    [
      `Ad: ${name.trim()}`,
      `Telefon: ${phone.trim()}`,
      `E-posta: ${validEmail ?? "(verilmedi)"}`,
      `Ek dosya: ${safeMedia.length}`,
      `Açıklama: ${description.trim().slice(0, 500)}`,
    ],
    "/admin/ozel-tasarim-talepleri"
  );

  return NextResponse.json({ success: true, id: created.id });
}
