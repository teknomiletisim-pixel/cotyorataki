import LegalPageLayout from "@/components/LegalPageLayout";

export default function Page() {
  return (
    <LegalPageLayout title="Gizlilik Politikası" updatedAt="Temmuz 2026">
      <p>
        COTYORA TAKI olarak, internet sitemiz üzerinden elde ettiğimiz kişisel
        verilerinizin gizliliğine ve güvenliğine önem veriyoruz. Bu Gizlilik
        Politikası, hangi bilgileri topladığımızı, bu bilgileri nasıl
        kullandığımızı ve haklarınızı açıklamaktadır.
      </p>

      <h2>1. Toplanan Bilgiler</h2>
      <ul>
        <li>Ad, soyad, e-posta adresi, telefon numarası, teslimat adresi,</li>
        <li>Sipariş ve ödeme geçmişi (kart bilgileri tarafımızca saklanmaz),</li>
        <li>Site kullanım verileri (tarayıcı türü, IP adresi, çerezler).</li>
      </ul>

      <h2>2. Bilgilerin Kullanım Amacı</h2>
      <p>
        Toplanan bilgiler; siparişlerin işleme alınması ve teslimi, müşteri
        hizmetleri desteği sağlanması, yasal yükümlülüklerin yerine getirilmesi
        ve (izniniz dahilinde) kampanya/duyuru bildirimleri gönderilmesi
        amacıyla kullanılır.
      </p>

      <h2>3. Bilgilerin Paylaşımı</h2>
      <p>
        Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle
        paylaşılmaz. Ödeme işlemleri, tarafımızca değil doğrudan lisanslı ödeme
        altyapısı sağlayıcısı (Lemonsqueezy) üzerinden gerçekleştirilir; kart
        bilgileriniz tarafımıza ulaşmaz ve sunucularımızda tutulmaz.
      </p>

      <h2>4. Çerezler (Cookies)</h2>
      <p>
        Site, oturum yönetimi ve sepet/favori bilgilerinizin tarayıcınızda
        tutulması amacıyla teknik çerezler ve tarayıcı depolama (local storage)
        kullanır. Bu veriler pazarlama amacıyla üçüncü taraflarla paylaşılmaz.
      </p>

      <h2>5. Veri Güvenliği</h2>
      <p>
        Kişisel verileriniz, yetkisiz erişime karşı makul teknik ve idari
        tedbirlerle korunmaktadır. Şifreleriniz tarafımızca okunabilir şekilde
        değil, tek yönlü şifrelenmiş (hash) olarak saklanır.
      </p>

      <h2>6. Haklarınız</h2>
      <p>
        KVKK kapsamındaki haklarınız (bilgi talep etme, düzeltme, silme,
        işlemeye itiraz etme vb.) için KVKK Aydınlatma Metni sayfamızdaki
        iletişim bilgilerinden bize ulaşabilirsiniz.
      </p>
    </LegalPageLayout>
  );
}
