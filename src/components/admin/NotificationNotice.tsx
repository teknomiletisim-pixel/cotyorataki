"use client";

export interface Notification {
  sent: boolean;
  reason?: string;
}

// Admin işlemlerinden sonra "müşteriye e-posta gitti mi?" sonucunu gösterir.
export default function NotificationNotice({ notice }: { notice: Notification | null }) {
  if (!notice) return null;
  return (
    <div
      className={`mb-4 rounded-lg px-4 py-3 text-sm border ${
        notice.sent
          ? "bg-green-500/10 border-green-500/30 text-green-300"
          : "bg-amber-500/10 border-amber-500/30 text-amber-300"
      }`}
    >
      {notice.sent
        ? "Müşteriye e-posta bildirimi gönderildi ✓"
        : `E-posta gönderilemedi: ${notice.reason ?? "bilinmeyen neden"}`}
    </div>
  );
}
