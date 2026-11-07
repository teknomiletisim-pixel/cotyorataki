"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface Status {
  emailUserSet: boolean;
  emailPasswordSet: boolean;
  emailFrom: string;
  adminEmail: string | null;
  smtpHost: string;
}

function Row({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-neutral-900 border border-white/10 rounded-lg px-4 py-3">
      <div>
        <p className="text-sm text-neutral-100">{label}</p>
        {detail && <p className="text-xs text-neutral-400 mt-0.5">{detail}</p>}
      </div>
      {ok ? (
        <span className="flex items-center gap-1 text-xs text-green-400 shrink-0"><CheckCircle2 size={14} /> Tanımlı</span>
      ) : (
        <span className="flex items-center gap-1 text-xs text-rose-400 shrink-0"><XCircle size={14} /> EKSİK</span>
      )}
    </div>
  );
}

export default function AdminEmailPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: boolean; reason?: string; to?: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/email-status").then((r) => r.json()).then(setStatus);
  }, []);

  async function sendTest() {
    setSending(true);
    setResult(null);
    const res = await fetch("/api/admin/email-status", { method: "POST" });
    setResult(await res.json());
    setSending(false);
  }

  if (!status) return <p className="text-neutral-400">Yükleniyor...</p>;

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl text-white mb-2">E-posta Ayarları</h1>
      <p className="text-sm text-neutral-400 mb-6">
        Sipariş ve talep bildirimlerinin gönderilebilmesi için canlı sitede (Vercel &gt; Settings &gt;
        Environment Variables) aşağıdaki ayarların tanımlı olması gerekir.
      </p>

      <div className="space-y-2 mb-6">
        <Row label="EMAIL_USER (Gmail adresiniz)" ok={status.emailUserSet} />
        <Row label="EMAIL_PASSWORD (16 haneli uygulama şifresi)" ok={status.emailPasswordSet} />
        <Row
          label="Yönetici bildirim adresi"
          ok={!!status.adminEmail}
          detail={status.adminEmail ?? "ADMIN_EMAIL veya EMAIL_USER tanımlayın"}
        />
        <p className="text-xs text-neutral-400 px-1">Gönderen adı: {status.emailFrom}</p>
      </div>

      <button
        onClick={sendTest}
        disabled={sending}
        className="bg-black hover:bg-neutral-800 disabled:opacity-60 text-amber-400 font-medium px-6 py-3 rounded-full"
      >
        {sending ? "Gönderiliyor..." : "Test e-postası gönder"}
      </button>

      {result && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm border ${
            result.sent
              ? "bg-green-500/10 border-green-500/30 text-green-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {result.sent
            ? `Test e-postası ${result.to} adresine gönderildi. Gelen kutusunu (ve spam klasörünü) kontrol edin.`
            : `Gönderilemedi: ${result.reason}`}
        </div>
      )}
    </div>
  );
}
