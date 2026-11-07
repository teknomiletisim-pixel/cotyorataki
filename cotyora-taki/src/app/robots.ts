import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://cotyorataki.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Arama motorlarının dizinlemesine gerek olmayan sayfalar:
        disallow: ["/admin/", "/api/", "/hesabim", "/sepetim", "/giris", "/kayit", "/giris-yonlendir", "/siparis-tamamla"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
