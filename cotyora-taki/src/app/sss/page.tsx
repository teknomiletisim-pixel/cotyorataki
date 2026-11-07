import LegalPageLayout from "@/components/LegalPageLayout";

const FAQ = [
  {
    q: "Siparişim ne kadar sürede hazırlanır ve kargoya verilir?",
    a: "Standart ürünlerde siparişiniz genellikle 2-7 iş günü içinde hazırlanıp kargoya verilir. Üzerine özel mesaj işlenen veya ölçüye göre üretilen ürünlerde bu süre birkaç gün uzayabilir.",
  },
  {
    q: "Siparişimin durumunu nereden takip edebilirim?",
    a: "\"Hesabım > Siparişlerim\" veya footer'daki \"Kargom Nerede\" sayfasından siparişinizin güncel durumunu (Beklemede, Onaylandı, Hazırlanıyor, Yolda, Teslim Edildi) her zaman görebilirsiniz. Durum her değiştiğinde ayrıca e-posta ile bilgilendirilirsiniz.",
  },
  {
    q: "Yüzük ölçümü hiç ölçüm aleti olmadan nasıl bulabilirim?",
    a: "Footer'daki \"Yüzük Ölçüsü Hesaplama\" sayfasında yazdırabileceğiniz bir ölçü kartı sunuyoruz. Elinizde uyan bir yüzüğü kağıttaki dairelerin üzerine koyup birebir eşleşeni bulmanız yeterli, hiçbir ölçüm yapmanıza gerek yok.",
  },
  {
    q: "Ürüne özel isim veya mesaj ekletebilir miyim?",
    a: "Evet, uygun ürünlerin sayfasında \"Takı Üzerine Özel Mesaj\" alanına istediğiniz kısa yazıyı ekleyebilirsiniz.",
  },
  {
    q: "İade, değişim veya garanti talebimi nasıl oluştururum?",
    a: "Footer'daki \"Garanti ve İade\" sayfasından, sipariş numaranızı girerek İade / Değişim / Garanti talebi oluşturabilirsiniz. Talebinizin durumu değiştikçe e-posta ile bilgilendirilirsiniz.",
  },
  {
    q: "Kişiye özel üretilen ürünleri iade edebilir miyim?",
    a: "Üzerine isim/mesaj işlenmiş veya ölçüye göre özel üretilen ürünlerde cayma hakkı, ilgili mevzuat istisnaları çerçevesinde sınırlı olabilir; bu tür ürünler öncelikli olarak üretim hatası/kusur durumunda değişime konu olur. Standart ürünlerde 14 gün içinde iade hakkınız bulunur.",
  },
  {
    q: "Hangi ödeme yöntemlerini kullanabilirim?",
    a: "Kredi/banka kartınızla güvenli ödeme altyapımız üzerinden ödeme yapabilir, dilerseniz footer'daki banka hesap bilgilerimize havale/EFT ile de ödeyebilirsiniz.",
  },
  {
    q: "Ürün fiyatları neden zaman zaman değişiyor?",
    a: "Ürün fiyatlarımız güncel gram altın fiyatına bağlı olarak hesaplanır. Bu nedenle piyasadaki altın fiyatı değiştiğinde ürün fiyatlarımız da otomatik olarak orantılı şekilde güncellenir. Sipariş anında gösterilen fiyat, o anki kesin fiyattır.",
  },
  {
    q: "Özel gün indirimleri nasıl uygulanıyor?",
    a: "Sevgililer Günü, Anneler Günü, Babalar Günü gibi özel günlerde duyurduğumuz indirim, o gün boyunca sitedeki tüm ürünlere otomatik olarak yansır; ayrıca bir kod girmenize gerek yoktur.",
  },
  {
    q: "Ürünler fotoğraftakiyle birebir aynı mı olacak?",
    a: "Ürünlerimiz el işçiliğiyle üretildiği için fotoğraflarla nihai üründe doku, parlaklık veya taş yerleşiminde milimetrik farklılıklar olabilir; bu durum bir kusur değil, el yapımı olmanın doğal bir sonucudur.",
  },
];

export default function Page() {
  return (
    <LegalPageLayout title="Sıkça Sorulan Sorular">
      <div className="space-y-6 not-prose">
        {FAQ.map((item) => (
          <div key={item.q}>
            <p className="font-medium text-white">{item.q}</p>
            <p className="text-neutral-600 mt-1">{item.a}</p>
          </div>
        ))}
      </div>
    </LegalPageLayout>
  );
}
