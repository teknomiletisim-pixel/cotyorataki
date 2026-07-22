import nodemailer from "nodemailer";

// E-posta bildirimleri için Nodemailer + Gmail SMTP kullanılıyor.
// Gerekli .env.local değerleri:
//   EMAIL_USER     -> Gmail adresiniz, örn: cotyoratakisiparis@gmail.com
//   EMAIL_PASSWORD -> Gmail "Uygulama Şifresi" (normal Gmail şifreniz DEĞİL!)
//                     Nasıl oluşturulacağı için README'ye bakın.
//   EMAIL_FROM     -> (opsiyonel) Gönderen olarak görünecek isim, boşsa EMAIL_USER kullanılır
//
// Bu değerler girilmemişse fonksiyon sessizce hiçbir şey yapmaz (siteyi bozmaz).

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

const STATUS_MESSAGES: Record<string, string> = {
  "Beklemede": "Siparişiniz alındı ve işleme alınmayı bekliyor.",
  "Onaylandı": "Siparişiniz onaylandı, hazırlığa başlanacak.",
  "Hazırlanıyor": "Siparişiniz atölyemizde özenle hazırlanıyor.",
  "Yolda": "Siparişiniz kargoya verildi, yola çıktı!",
  "Teslim Edildi": "Siparişiniz teslim edildi. Bizi tercih ettiğiniz için teşekkür ederiz!",
  "İptal Edildi": "Siparişiniz iptal edildi.",
};

export async function sendOrderStatusEmail(params: {
  to: string;
  orderId: number;
  customerName: string;
  status: string;
}) {
  const transporter = getTransporter();
  if (!transporter) return;

  const { to, orderId, customerName, status } = params;
  const statusMessage = STATUS_MESSAGES[status] ?? `Sipariş durumunuz güncellendi: ${status}`;
  const fromName = process.env.EMAIL_FROM || "COTYORA TAKI";

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Siparişiniz güncellendi — #${orderId}: ${status}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #292524;">
          <h2 style="color: #92400e;">COTYORA TAKI</h2>
          <p>Merhaba ${customerName || ""},</p>
          <p><strong>#${orderId}</strong> numaralı siparişinizin durumu güncellendi:</p>
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold; color: #92400e;">${status}</p>
            <p style="margin: 8px 0 0 0; color: #57534e;">${statusMessage}</p>
          </div>
          <p style="font-size: 13px; color: #a8a29e;">
            Siparişinizin detaylarını "Hesabım &gt; Siparişlerim" bölümünden takip edebilirsiniz.
          </p>
        </div>
      `,
    });
  } catch (err) {
    // E-posta gönderimi başarısız olursa sipariş işlemini bozmasın, sadece logla.
    console.error("Sipariş durumu e-postası gönderilemedi:", err);
  }
}

export async function sendServiceRequestStatusEmail(params: {
  to: string;
  customerName: string;
  orderId: number;
  type: string;
  status: string;
  adminNote?: string | null;
}) {
  const transporter = getTransporter();
  if (!transporter) return;

  const { to, customerName, orderId, type, status, adminNote } = params;
  const typeLabel = type === "iade" ? "İade" : type === "degisim" ? "Değişim" : "Garanti";
  const fromName = process.env.EMAIL_FROM || "COTYORA TAKI";

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      to,
      subject: `${typeLabel} talebiniz güncellendi — Sipariş #${orderId}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #292524;">
          <h2 style="color: #92400e;">COTYORA TAKI</h2>
          <p>Merhaba ${customerName || ""},</p>
          <p><strong>#${orderId}</strong> numaralı siparişiniz için açtığınız <strong>${typeLabel}</strong>
          talebinin durumu güncellendi:</p>
          <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold; color: #92400e;">${status}</p>
            ${adminNote ? `<p style="margin: 8px 0 0 0; color: #57534e;">${adminNote}</p>` : ""}
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Talep durumu e-postası gönderilemedi:", err);
  }
}
