import LegalPageLayout from "@/components/LegalPageLayout";

export default function Page() {
  return (
    <LegalPageLayout title="Mesafeli Satış Sözleşmesi" updatedAt="Temmuz 2026">
      <p>
        İşbu Mesafeli Satış Sözleşmesi (&quot;Sözleşme&quot;), aşağıda bilgileri yer alan
        SATICI ile ALICI arasında, ALICI&apos;nın SATICI&apos;ya ait internet sitesi üzerinden
        elektronik ortamda sipariş verdiği ürünün satışı ve teslimi ile ilgili olarak,
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini belirlemek
        amacıyla düzenlenmiştir.

      </p>

      <h2>1. Taraflar</h2>
      <p>
        <strong>SATICI:</strong> COTYORA TAKI<br />
        Adres: [Atölye/İşletme adresiniz — bu bilgiyi kendi kodunuzdan doldurabilirsiniz]<br />
        Vergi Dairesi / No: [Doldurulacak]<br />
        E-posta: [Doldurulacak]<br />
        Telefon: [Doldurulacak]
      </p>
      <p>
        <strong>ALICI:</strong> İnternet sitesi üzerinden sipariş veren, sipariş formunda
        bilgileri yer alan gerçek veya tüzel kişi.
      </p>

      <h2>2. Sözleşmenin Konusu</h2>
      <p>
        İşbu Sözleşme&apos;nin konusu, ALICI&apos;nın SATICI&apos;ya ait internet sitesinden
        elektronik ortamda siparişini verdiği, Sözleşme&apos;de belirtilen nitelikleri
        haiz ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin
        Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri
        gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
      </p>

      <h2>3. Sözleşme Konusu Ürün Bilgileri</h2>
      <p>
        Ürünün cinsi, türü, adedi, marka/modeli, rengi, satış bedeli (KDV dahil),
        ödeme şekli ve teslimat bilgileri, sipariş sırasında sitede belirtilmiş ve
        ALICI tarafından onaylanmıştır. Ürünler el işçiliği ile üretildiği için
        fotoğraflardaki görsellerle nihai üründe milimetrik farklılıklar olabilir;
        bu durum ayıp veya kusur teşkil etmez.
      </p>

      <h2>4. Genel Hükümler</h2>
      <ol>
        <li>
          ALICI, sitede sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve
          ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi
          olduğunu, elektronik ortamda gerekli teyidi verdiğini kabul eder.
        </li>
        <li>
          Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir
          ürün için ALICI&apos;nın yerleşim yerinin uzaklığına bağlı olarak internet
          sitesinde ön bilgiler içinde açıklanan süre içinde ALICI veya gösterdiği
          adresteki kişi/kuruluşa teslim edilir.
        </li>
        <li>
          Sözleşme konusu ürün, ALICI&apos;dan başka bir kişi/kuruluşa teslim
          edilecek ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesinden
          SATICI sorumlu tutulamaz.
        </li>
        <li>
          SATICI, sözleşme konusu ürünün sağlam, eksiksiz, siparişte belirtilen
          niteliklere uygun teslim edilmesinden sorumludur.
        </li>
        <li>
          Özel tasarım / kişiye özel üretilen (üzerine isim/mesaj işlenmiş, ölçüye
          göre üretilmiş) ürünlerde, Mesafeli Sözleşmeler Yönetmeliği&apos;nin
          istisnaları kapsamında cayma hakkı sınırlı olabilir; detaylar Garanti ve
          İade Koşulları sayfasında yer almaktadır.
        </li>
      </ol>

      <h2>5. Ödeme</h2>
      <p>
        Ödemeler, sitede sunulan güvenli ödeme altyapısı üzerinden kredi/banka
        kartı ile veya banka havalesi/EFT yoluyla yapılabilir. Kart bilgileri
        SATICI tarafından hiçbir şekilde saklanmaz; ödeme işlemleri lisanslı
        ödeme kuruluşu üzerinden gerçekleştirilir.
      </p>

      <h2>6. Cayma Hakkı</h2>
      <p>
        ALICI, mesafeli sözleşme konusu ürünün kendisine veya gösterdiği adresteki
        kişi/kuruluşa tesliminden itibaren 14 (on dört) gün içinde, herhangi bir
        gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına
        sahiptir. Kişiye özel üretilen ürünlerde bu hak, ilgili mevzuat
        istisnaları çerçevesinde uygulanmayabilir.
      </p>

      <h2>7. Yetkili Mahkeme</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen
        değere kadar ALICI&apos;nın yerleşim yerindeki Tüketici Hakem Heyetleri ile
        SATICI veya ALICI&apos;nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
      </p>

      <p className="text-sm text-neutral-400 mt-8">
        Bu metin genel bir taslak olarak hazırlanmıştır; işletmenize özgü vergi
        dairesi, adres ve iletişim bilgilerini eklemeniz, gerekiyorsa bir hukuk
        danışmanına kontrol ettirmeniz önerilir.
      </p>
    </LegalPageLayout>
  );
}
