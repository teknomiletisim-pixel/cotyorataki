import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import SplashIntro from "@/components/SplashIntro";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiscountBanner from "@/components/DiscountBanner";

export const metadata: Metadata = {
  title: "COTYORA TAKI | El Yapımı Takı Tasarım ve Üretim",
  description:
    "COTYORA TAKI - özel tasarım ve üretim takılar. Yüzük, kolye, bileklik ve daha fazlası.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50 font-sans">
        <AuthSessionProvider>
          <AppProvider>
            <SplashIntro />
            <DiscountBanner />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AppProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
