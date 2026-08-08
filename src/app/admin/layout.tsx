"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Coins, LogOut, Sparkles, MessageSquareWarning, Gem } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/siparisler", label: "Siparişler", icon: LayoutDashboard },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/altin-fiyati", label: "Altın Fiyatı", icon: Coins },
  { href: "/admin/ozel-gunler", label: "Özel Günler", icon: Sparkles },
  { href: "/admin/talepler", label: "Değişim/İade Talepleri", icon: MessageSquareWarning },
  { href: "/admin/ozel-tasarim-talepleri", label: "Özel Tasarım Talepleri", icon: Gem },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">
        <p className="font-serif text-lg text-amber-300 mb-4 px-2">Yönetim Paneli</p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                active
                  ? "bg-amber-400/15 text-amber-300"
                  : "text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-500/10 mt-4"
        >
          <LogOut size={16} />
          Çıkış Yap
        </button>
      </aside>
      <div>{children}</div>
    </div>
  );
}
