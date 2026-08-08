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
          [Buraya atölyenizin kuruluş hikayesini, kaç yıldır bu işi yaptığınızı,
          neden bu işe başladığınızı yazabilirsiniz.]
        </p>
        <p>
          [İkinci paragraf: üretim sürecinizden, kullandığınız malzemelerden
          veya felsefenizden bahsedebilirsiniz.]
        </p>
      </div>
    </div>
  );
}
