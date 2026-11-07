import nodemailer from "nodemailer";

// E-posta bildirimleri: Nodemailer + Gmail (veya SMTP_HOST ile başka bir sağlayıcı).
// Gerekli ortam değişkenleri (CANLI SİTE İÇİN Vercel > Settings > Environment Variables):
//   EMAIL_USER     -> Gmail adresiniz
//   EMAIL_PASSWORD -> Gmail "Uygulama Şifresi" (16 haneli, normal şifre DEĞİL)
//   EMAIL_FROM     -> (opsiyonel) gönderen olarak görünecek isim, örn: COTYORA TAKI
//   ADMIN_EMAIL    -> yönetici bildirimlerinin gideceği adres (yoksa EMAIL_USER kullanılır)
// Opsiyonel (Gmail dışı sağlayıcı için): SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_IGNORE_TLS

export interface SendResult {
  sent: boolean;
  reason?: string;
}

export function getAdminEmail(): string | null {
  return process.env.ADMIN_EMAIL || process.env.EMAIL_USER || null;
}

export function getEmailConfigStatus() {
  return {
    emailUserSet: !!process.env.EMAIL_USER,
    emailPasswordSet: !!process.env.EMAIL_PASSWORD,
    emailFrom: process.env.EMAIL_FROM || "COTYORA TAKI",
    adminEmail: getAdminEmail(),
    smtpHost: process.env.SMTP_HOST || "Gmail",
  };
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function friendlyError(message: string): string {
  if (/Invalid login|535|Username and Password not accepted|BadCredentials/i.test(message)) {
    return "Gmail giriş bilgileri reddedildi. EMAIL_PASSWORD normal Gmail şifreniz değil, 16 haneli 'Uygulama Şifresi' olmalı ve EMAIL_USER doğru Gmail adresi olmalı.";
  }
  if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|ECONNRESET/i.test(message)) {
    return `E-posta sunucusuna bağlanılamadı (${message}).`;
  }
  return message;
}

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  if (!user || !pass) return null;

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      ignoreTLS: process.env.SMTP_IGNORE_TLS === "true",
      auth: { user, pass },
    });
  }
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

async function sendMail(to: string, subject: string, html: string): Promise<SendResult> {
  const transporter = getTransporter();
  if (!transporter) {
    const missing = [
      !process.env.EMAIL_USER && "EMAIL_USER",
      !process.env.EMAIL_PASSWORD && "EMAIL_PASSWORD",
    ].filter(Boolean);
    return {
      sent: false,
      reason: `E-posta ayarı eksik: ${missing.join(", ")} tanımlı değil (Vercel > Environment Variables).`,
    };
  }

  const fromName = process.env.EMAIL_FROM || "COTYORA TAKI";
  try {
    await transporter.sendMail({
      from: `"${fromName.replace(/"/g, "")}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("E-posta gönderilemedi:", message);
    return { sent: false, reason: friendlyError(message) };
  }
}

function wrap(inner: string): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #292524;">
      <h2 style="color: #92400e;">COTYORA TAKI</h2>
      ${inner}
    </div>`;
}

function box(title: string, body?: string | null): string {
  return `
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 16px 0;">
      <p style="margin: 0; font-weight: bold; color: #92400e;">${escapeHtml(title)}</p>
      ${body ? `<p style="margin: 8px 0 0 0; color: #57534e;">${escapeHtml(body)}</p>` : ""}
    </div>`;
}

const ORDER_STATUS_MESSAGES: Record<string, string> = {
  "Beklemede": "Siparişiniz alındı ve işleme alınmayı bekliyor.",
  "Onaylandı": "Siparişiniz onaylandı, hazırlığa başlanacak.",
  "Hazırlanıyor": "Siparişiniz atölyemizde özenle hazırlanıyor.",
  "Yolda": "Siparişiniz kargoya verildi, yola çıktı!",
  "Teslim Edildi": "Siparişiniz teslim edildi. Bizi tercih ettiğiniz için teşekkür ederiz!",
  "İptal Edildi": "Siparişiniz iptal edildi.",
};

// ---------- Müşteriye giden e-postalar ----------

export async function sendOrderStatusEmail(params: {
  to: string;
  orderId: number;
  customerName: string;
  status: string;
}): Promise<SendResult> {
  const { to, orderId, customerName, status } = params;
  const message = ORDER_STATUS_MESSAGES[status] ?? `Sipariş durumunuz güncellendi: ${status}`;
  return sendMail(
    to,
    `Siparişiniz güncellendi — #${orderId}: ${status}`,
    wrap(`
      <p>Merhaba ${escapeHtml(customerName)},</p>
      <p><strong>#${orderId}</strong> numaralı siparişinizin durumu güncellendi:</p>
      ${box(status, message)}
      <p style="font-size: 13px; color: #a8a29e;">Siparişinizin detaylarını "Hesabım &gt; Siparişlerim" bölümünden takip edebilirsiniz.</p>`)
  );
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  iade: "İade",
  degisim: "Değişim",
  garanti: "Garanti",
};

export async function sendServiceRequestUpdateEmail(params: {
  to: string;
  customerName: string;
  orderId: number;
  type: string;
  status: string;
  adminNote?: string | null;
  kind: "status" | "note";
}): Promise<SendResult> {
  const { to, customerName, orderId, type, status, adminNote, kind } = params;
  const typeLabel = SERVICE_TYPE_LABELS[type] ?? "Garanti";
  const heading =
    kind === "status"
      ? `<strong>#${orderId}</strong> numaralı siparişiniz için açtığınız <strong>${typeLabel}</strong> talebinin durumu güncellendi:`
      : `<strong>#${orderId}</strong> numaralı siparişiniz için açtığınız <strong>${typeLabel}</strong> talebine bir not eklendi:`;
  return sendMail(
    to,
    kind === "status"
      ? `${typeLabel} talebiniz güncellendi — Sipariş #${orderId}`
      : `${typeLabel} talebinize not eklendi — Sipariş #${orderId}`,
    wrap(`
      <p>Merhaba ${escapeHtml(customerName)},</p>
      <p>${heading}</p>
      ${box(`Durum: ${status}`, adminNote)}`)
  );
}

export async function sendCustomDesignUpdateEmail(params: {
  to: string;
  customerName: string;
  status: string;
  adminNote?: string | null;
  kind: "status" | "note";
}): Promise<SendResult> {
  const { to, customerName, status, adminNote, kind } = params;
  const heading =
    kind === "status"
      ? "Özel tasarım talebinizin durumu güncellendi:"
      : "Özel tasarım talebinize bir not eklendi:";
  return sendMail(
    to,
    kind === "status" ? "Özel tasarım talebiniz güncellendi" : "Özel tasarım talebinize not eklendi",
    wrap(`
      <p>Merhaba ${escapeHtml(customerName)},</p>
      <p>${heading}</p>
      ${box(`Durum: ${status}`, adminNote)}
      <p style="font-size: 13px; color: #a8a29e;">Sorularınız için bizimle iletişime geçebilirsiniz.</p>`)
  );
}

// ---------- Yöneticiye (size) giden e-postalar ----------

export async function notifyAdmin(subject: string, lines: string[], link?: string): Promise<SendResult> {
  const to = getAdminEmail();
  if (!to) {
    return { sent: false, reason: "Yönetici e-postası belirlenemedi (ADMIN_EMAIL veya EMAIL_USER tanımlı değil)." };
  }
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  return sendMail(
    to,
    subject,
    wrap(`
      <p><strong>${escapeHtml(subject)}</strong></p>
      <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 16px 0;">
        ${lines.map((l) => `<p style="margin: 4px 0; color: #57534e;">${escapeHtml(l)}</p>`).join("")}
      </div>
      ${link ? `<p><a href="${escapeHtml(base + link)}" style="color: #92400e;">Yönetim panelinde aç</a></p>` : ""}`)
  );
}

export async function sendTestEmail(to: string): Promise<SendResult> {
  return sendMail(
    to,
    "COTYORA TAKI — test e-postası",
    wrap(`${box("E-posta ayarlarınız çalışıyor ✓", "Bu bir test mesajıdır. Bunu görüyorsanız sipariş ve talep bildirimleri de gönderilebiliyor demektir.")}`)
  );
}
