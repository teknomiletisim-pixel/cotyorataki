import type { Metadata } from "next";
import KatalogClient from "./KatalogClient";

export const metadata: Metadata = {
  title: "Takı Kataloğu",
  description:
    "COTYORA TAKI koleksiyonundaki tüm yüzük, kolye, bileklik, küpe ve özel tasarım ürünleri keşfedin.",
  alternates: { canonical: "/katalog" },
};

export default function KatalogPage() {
  return <KatalogClient />;
}
