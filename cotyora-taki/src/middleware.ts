import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// Middleware Edge runtime'da çalıştığı için burada sadece edge-uyumlu
// authConfig kullanılıyor (bcrypt/pg içermeyen versiyon).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAdminRoute =
    req.nextUrl.pathname.startsWith("/admin") ||
    req.nextUrl.pathname.startsWith("/api/admin");
  if (!isAdminRoute) return NextResponse.next();

  const role = req.auth?.user?.role;
  if (role !== "admin") {
    if (req.nextUrl.pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }
    const loginUrl = new URL("/giris", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
