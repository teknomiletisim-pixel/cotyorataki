import type { NextAuthConfig } from "next-auth";

// Bu dosya middleware (Edge runtime) tarafından da kullanıldığı için
// bcrypt, pg gibi Node-only paketler İÇERMEMELİDİR. Gerçek Credentials
// provider'ı (bcrypt + veritabanı erişimi gerektiren) src/auth.ts içinde
// tanımlanır ve sadece API route'larında / sunucu bileşenlerinde kullanılır.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "customer";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "customer";
      }
      return session;
    },
  },
};
