// ============================================================
// BU SAYFAYI SİZ DÜZENLEYECEKSİNİZ.
// Aşağıdaki <p> etiketlerinin içindeki yazıyı kendi hikayenizle,
// atölyenizin kuruluş öyküsüyle değiştirin. İstediğiniz kadar
// paragraf ekleyebilir, fotoğraf da koyabilirsiniz (bunun için
// bize "Biz Kimiz sayfasına fotoğraf ekle" diyebilirsiniz).
// ============================================================
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="font-serif text-3xl text-white mb-6">Biz Kimiz</h1>
      <div className="prose prose-neutral text-neutral-400 leading-relaxed space-y-4">
        <p>
          Yaklaşık 20 yıl önce İstanbulda bir kuyumculuk işletmemiz vardı.Bu işletmemizi uzun süre boyunca kapattık.
          2 yıl önce yeniden bi atölye açtık ve bu atölyeyi Ordu da şu an işletmeye devam ediyoruz. Tamamen kendi ve özel üretimlerimizi yapmaktayız.
        </p>
        <p>
          Hem tasarım hem üretim yapan Karadeniz'in tek işletmesiyiz .
          Tasarım,model,kalıp,döküm,işleme ve diğer tüm işlemleri tüm ürünlerimiz için kendimiz yapmaktayız.
        </p>
      </div>
    </div>
  );
}
