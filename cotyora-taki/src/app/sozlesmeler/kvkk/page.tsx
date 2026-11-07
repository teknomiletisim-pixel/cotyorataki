import LegalPageLayout from "@/components/LegalPageLayout";

export default function Page() {
  return (
    <LegalPageLayout
      title="KVKK Aydınlatma Metni ve Ticari Elektronik İleti Onay Metni"
      updatedAt="Temmuz 2026"
    >
      <h2>1. Veri Sorumlusu</h2>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca,
        kişisel verileriniz veri sorumlusu sıfarıyla COTYORA TAKI
        (&quot;Şirket&quot;) tarafından aşağıda açıklanan kapsamda işlenmektedir.
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <p>
        Ad-soyad, telefon numarası, e-posta adresi, teslimat/fatura adresi,
        sipariş ve ödeme geçmişi, site kullanım/log kayıtları.
      </p>

      <h2>3. İşleme Amaçları</h2>
      <ul>
        <li>Sipariş ve teslimat süreçlerinin yürütülmesi,</li>
        <li>Müşteri ilişkileri yönetimi ve destek sağlanması,</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi,</li>
        <li>Onay vermeniz halinde kampanya/duyuru iletişimi.</li>
      </ul>

      <h2>4. Kişisel Verilerin Aktarımı</h2>
      <p>
        Verileriniz, kargo teslimatının sağlanması için anlaşmalı kargo
        firmasına, ödeme işleminin gerçekleştirilmesi için ödeme altyapısı
        sağlayıcısına (Lemonsqueezy) ve yasal zorunluluk halinde yetkili
        kamu kurumlarına aktarılabilir.
      </p>

      <h2>5. Haklarınız</h2>
      <p>KVKK madde 11 uyarınca; kişisel verilerinizin</p>
      <ul>
        <li>işlenip işlenmediğini öğrenme,</li>
        <li>işlenmişse buna ilişkin bilgi talep etme,</li>
        <li>işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
        <li>KVKK&apos;da öngörülen şartlarda silinmesini/yok edilmesini isteme,</li>
        <li>işlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
        <li>zarara uğramanız halinde zararın giderilmesini talep etme</li>
      </ul>
      <p>haklarına sahipsiniz. Bu haklarınızı kullanmak için [e-posta adresiniz] üzerinden bize ulaşabilirsiniz.</p>

      <h2>6. Ticari Elektronik İleti Onayı</h2>
      <p>
        Sipariş/kayıt sırasında ilgili kutucuğu işaretlemeniz halinde, tarafınıza
        kampanya, indirim ve yeni ürün duyurularını içeren ticari elektronik
        iletiler (SMS, e-posta, WhatsApp) gönderilmesine onay vermiş
        olursunuz. Bu onayı dilediğiniz zaman, gönderilen iletilerdeki
        "iletişimi durdur" bağlantısı üzerinden veya bize doğrudan yazarak geri
        çekebilirsiniz.
      </p>
    </LegalPageLayout>
  );
}
