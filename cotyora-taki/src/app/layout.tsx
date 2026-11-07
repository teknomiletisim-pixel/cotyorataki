import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import SplashIntro from "@/components/SplashIntro";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiscountBanner from "@/components/DiscountBanner";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cotyorataki.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "COTYORA TAKI | El Yapımı Özel Tasarım Takı",
    template: "%s | COTYORA TAKI",
  },
  description:
    "COTYORA TAKI - el işçiliği ile üretilen özel tasarım altın ve gümüş takılar. Yüzük, kolye, bileklik, küpe ve kişiye özel tasarım takı koleksiyonu.",
  keywords: [
    "Cotyora Takı",
    "cotyora taki",
    "cotyorataki",
    "özel tasarım takı",
    "el yapımı takı",
    "altın yüzük",
    "gümüş kolye",
    "Ordu takı atölyesi",
    "kişiye özel takı",
  ],
  authors: [{ name: "COTYORA TAKI" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "COTYORA TAKI",
    title: "COTYORA TAKI | El Yapımı Özel Tasarım Takı",
    description:
      "El işçiliği ile üretilen özel tasarım altın ve gümüş takılar. Yüzük, kolye, bileklik, küpe ve kişiye özel tasarım takı koleksiyonu.",
    images: [
      {
        url: "/apple-icon.png",
        width: 180,
        height: 180,
        alt: "COTYORA TAKI",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "COTYORA TAKI | El Yapımı Özel Tasarım Takı",
    description:
      "El işçiliği ile üretilen özel tasarım altın ve gümüş takılar.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  // Google Search Console'da site sahipliğini doğrulamak için:
  // Google size "google-site-verification=XXXXX" gibi bir kod verecek,
  // aşağıdaki satırı açıp XXXXX kısmına o kodu yapıştırın.
  // verification: {
  //   google: "BURAYA_GOOGLE_DOGRULAMA_KODU",
  // },
};

// Google'ın işletmenizi arama sonuçlarında ve bilgi panelinde doğru
// tanıması için yapılandırılmış veri (structured data / JSON-LD).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "COTYORA TAKI",
  alternateName: "Cotyora Takı",
  url: SITE_URL,
  image: `${SITE_URL}/apple-icon.png`,
  description:
    "El işçiliği ile üretilen özel tasarım altın ve gümüş takılar. Yüzük, kolye, bileklik, küpe ve kişiye özel tasarım takı koleksiyonu.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ordu",
    addressCountry: "TR",
  },
  sameAs: [
    // Sosyal medya hesap linklerinizi buraya ekleyin, Google bağlantıyı kurar:
    // "https://instagram.com/cotyora",
    // "https://www.facebook.com/cotyora",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-950 font-sans">
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
