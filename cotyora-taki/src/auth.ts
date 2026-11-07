import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authConfig } from "./auth.config";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "E-posta", type: "email" },
      password: { label: "Şifre", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email as string | undefined;
      const password = credentials?.password as string | undefined;
      if (!email || !password) return null;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email.toLowerCase().trim()))
        .limit(1);

      // Google ile oluşturulmuş, şifresi olmayan hesaplar e-posta/şifre ile giriş yapamaz.
      if (!user || !user.passwordHash) return null;

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return null;

      return {
        id: String(user.id),
        email: user.email,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        role: user.role,
      };
    },
  }),
];

// Google Client ID/Secret .env.local'da tanımlıysa Google ile giriş seçeneği eklenir.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // Sadece Google ile girişte çalışır: kullanıcı veritabanımızda yoksa oluşturulur.
      if (account?.provider === "google" && user.email) {
        const normalizedEmail = user.email.toLowerCase().trim();
        const [existing] = await db
          .select()
          .from(users)
          .where(eq(users.email, normalizedEmail))
          .limit(1);

        if (!existing) {
          const isAdminEmail =
            process.env.ADMIN_EMAIL &&
            normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase().trim();

          const nameParts = (user.name ?? "").split(" ");
          await db.insert(users).values({
            email: normalizedEmail,
            passwordHash: null,
            googleId: account.providerAccountId,
            firstName: nameParts[0] ?? "",
            lastName: nameParts.slice(1).join(" ") ?? "",
            role: isAdminEmail ? "admin" : "customer",
          });
        } else if (!existing.googleId) {
          // Daha önce e-posta/şifre ile kayıt olmuş bir kullanıcı Google ile de giriş yapıyorsa hesapları birleştir.
          await db
            .update(users)
            .set({ googleId: account.providerAccountId })
            .where(eq(users.id, existing.id));
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // İlk girişte (credentials veya google fark etmeksizin) veritabanındaki
      // gerçek kullanıcı kaydını bulup token'a kendi iç id/role bilgimizi yazıyoruz.
      if (user?.email && (account?.provider === "google" || account?.provider === "credentials")) {
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email.toLowerCase().trim()))
          .limit(1);
        if (dbUser) {
          token.id = String(dbUser.id);
          token.role = dbUser.role;
        }
      }
      return token;
    },
  },
});
