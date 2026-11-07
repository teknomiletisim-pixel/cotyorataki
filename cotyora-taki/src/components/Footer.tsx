import Link from "next/link";

// lucide-react Instagram marka ikonunu kaldırdığı için basit SVG kullanılıyor.
function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ============================================================
// BU BÖLÜMÜ SİZ DÜZENLEYECEKSİNİZ.
// Aşağıdaki değerleri kendi bilgilerinizle değiştirin:
// - instagram / whatsapp: kendi hesap linklerinizi girin
// - phone: telefon numaranız (görüntülenen metin), whatsapp linkinden
//   ayrı olarak "tel:" ile aranabilir bir link olarak gösterilir
// ============================================================
const SOCIAL_LINKS = {
  instagram: "https://instagram.com/cotyora",
  whatsapp: "https://wa.me/905000000000",
  phone: "+90 500 000 00 00", // Görüntülenecek telefon numaranız
};

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Hızlı Erişim",
    links: [
      { label: "Sepetim", href: "/sepetim" },
      { label: "Siparişlerim", href: "/hesabim?tab=siparisler" },
      { label: "Favori Ürünler", href: "/favorilerim" },
      { label: "Kargom Nerede", href: "/kargom-nerede" },
      { label: "Yüzük Ölçüsü Hesaplama", href: "/yuzuk-olcusu" },
    ],
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Biz Kimiz", href: "/biz-kimiz" },
      { label: "Blog", href: "/blog" },
      { label: "SSS", href: "/sss" },
      { label: "Garanti ve İade", href: "/garanti-iade" },
    ],
  },
  {
    title: "Sözleşmeler",
    links: [
      { label: "Satış Sözleşmesi", href: "/sozlesmeler/satis" },
      { label: "Üyelik Sözleşmesi", href: "/sozlesmeler/uyelik" },
      { label: "Gizlilik Politikası", href: "/sozlesmeler/gizlilik" },
      { label: "Dağıtım Koşulları", href: "/sozlesmeler/dagitim" },
      { label: "Garanti ve İade Koşulları", href: "/sozlesmeler/garanti-iade" },
      { label: "KVKK Ticari Elektronik İleti Onay Metni", href: "/sozlesmeler/kvkk" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <span className="font-serif text-xl tracking-[0.15em] text-amber-200">
            COTYORA TAKI
          </span>
          <p className="text-sm text-neutral-400 mt-3">
            El işçiliği ve özenle tasarlanan, sizin için üretilen takılar.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-amber-300">
              <InstagramIcon />
            </a>
            <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-amber-300">
              {/* lucide-react'ta whatsapp ikonu yok, basit SVG kullanılıyor */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.34a9.83 9.83 0 0 0 4.62 1.16h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2zm5.79 14.1c-.24.68-1.4 1.31-1.93 1.36-.5.05-1.02.25-3.4-.71-2.88-1.16-4.74-4.02-4.88-4.21-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.08 1-2.37.26-.28.57-.35.76-.35h.55c.18 0 .42-.03.64.5.24.58.81 1.99.88 2.14.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.28-.12.55.16.28.71 1.17 1.53 1.89 1.05.93 1.94 1.22 2.21 1.36.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.53.33.07.12.07.68-.17 1.36z"/>
              </svg>
            </a>
          </div>
          <a
            href={`tel:${SOCIAL_LINKS.phone.replace(/\s+/g, "")}`}
            className="block text-sm text-neutral-400 hover:text-amber-300 mt-3"
          >
            {SOCIAL_LINKS.phone}
          </a>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-medium mb-3 text-sm">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-amber-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} COTYORA TAKI. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
