# COTYORA TAKI — E-Ticaret Sitesi

Next.js + PostgreSQL (Drizzle ORM) ile geliştirilmiş, takı tasarım/üretim atölyesi için
uçtan uca e-ticaret sitesi. Müşteri kataloğu, sepet, favoriler, hesap yönetimi, admin
paneli (sipariş/ürün/altın fiyatı yönetimi) ve Lemonsqueezy ödeme entegrasyonunu içerir.

## 1) Gereksinimler

- Node.js 20 veya üzeri
- Bir PostgreSQL veritabanı (yerelde kurulu olabilir veya Railway/Supabase/Neon gibi
  bir bulut servisi kullanabilirsiniz)
- Bir Lemonsqueezy hesabı (ödeme almak için)

## 2) Kurulum

```bash
npm install
cp .env.example .env.local
```

`.env.local` dosyasını açıp kendi bilgilerinizi girin (aşağıdaki bölümlere bakın).

## 3) Veritabanını hazırlama

```bash
npm run db:generate   # migrasyon dosyalarını oluşturur (şema değiştirdiğinizde)
npm run db:migrate    # migrasyonları veritabanına uygular
npm run db:seed       # örnek ürünleri, güncel altın fiyatını ve admin hesabını ekler
```

`db:seed` komutu, `.env.local` içindeki `ADMIN_EMAIL` / `ADMIN_PASSWORD` ile bir
yönetici hesabı oluşturur. **Bu bilgileri kendi e-postanız ve güçlü bir şifreyle
değiştirin.**

## 4) Geliştirme sunucusunu başlatma

```bash
npm run dev
```

`http://localhost:3000` adresinden siteyi açabilirsiniz.

- Kendi e-postanızla (`ADMIN_EMAIL`) giriş yaptığınızda otomatik olarak
  **Yönetim Paneli**'ne yönlendirilirsiniz.
- Başka bir e-posta ile kayıt olan herkes **müşteri hesabı** olarak sisteme girer ve
  sadece kendi sipariş/hesap bilgilerini görür.

## 5) Lemonsqueezy ödeme kurulumu

1. lemonsqueezy.com üzerinden mağazanızı oluşturun.
2. Mağazanızda "Sipariş Ödemesi" gibi tek, genel bir ürün/variant oluşturun.
   Bu ürünün fiyatı önemli değildir — sipariş anında gerçek tutar
   (custom_price) otomatik olarak gönderilir.
3. Settings > API'den bir API anahtarı oluşturun → LEMONSQUEEZY_API_KEY
4. Mağaza ID'nizi → LEMONSQUEEZY_STORE_ID
5. Oluşturduğunuz ürünün variant ID'sini → LEMONSQUEEZY_VARIANT_ID
6. Settings > Webhooks'tan yeni bir webhook oluşturun:
   - URL: https://SIZIN-DOMAININIZ.com/api/webhooks/lemonsqueezy
   - Dinlenecek olaylar: order_created, order_refunded
   - Oluşan gizli anahtarı → LEMONSQUEEZY_WEBHOOK_SECRET

Bu değerler girilmeden ödeme adımı çalışmaz; sipariş yine de veritabanına kaydedilir,
ancak müşteri ödeme sayfasına yönlendirilemez ve bir hata mesajı görür.

## 6) E-posta bildirimleri (Gmail ile)

Sipariş durumu veya değişim/iade talebi durumu değiştiğinde müşteriye otomatik
e-posta gönderilir. Bunun için Gmail hesabınızı kullanabilirsiniz — yeni bir
servise üye olmanıza gerek yok.

1. Bildirimleri göndermek istediğiniz bir Gmail adresi belirleyin (isterseniz
   işletmeniz için yeni bir Gmail hesabı da açabilirsiniz, örn.
   `cotyoratakisiparis@gmail.com`).
2. O Gmail hesabında **2 Adımlı Doğrulama**'nın açık olması gerekir:
   myaccount.google.com/security → "2 Adımlı Doğrulama" → açın (kapalıysa).
3. Aynı sayfada (myaccount.google.com/security) **"Uygulama Şifreleri"**
   (App Passwords) bölümüne gidin — doğrudan
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   adresinden de ulaşabilirsiniz.
4. Uygulama adı olarak "Cotyora Taki" gibi bir şey yazıp oluşturun. Google
   size 16 haneli bir şifre verecek (boşluksuz kullanın).
5. `.env.local` dosyanızda:
   ```
   EMAIL_USER=sizin-gmail-adresiniz@gmail.com
   EMAIL_PASSWORD=google_un_verdigi_16_haneli_sifre
   EMAIL_FROM=COTYORA TAKI
   ```
   **Dikkat:** `EMAIL_PASSWORD`, Gmail'e giriş yaparken kullandığınız normal
   şifreniz DEĞİLDİR — sadece bu 16 haneli "Uygulama Şifresi"dir.

Bu değerleri girmezseniz site normal çalışmaya devam eder, sadece e-posta
bildirimleri gönderilmez.

## 7) Altın fiyatı mantığı

Her ürünün fiyatı şu formülle hesaplanır:

```
fiyat = (ürünün gram altın miktarı × güncel gram altın fiyatı) + işçilik bedeli
```

Yönetim Paneli > Altın Fiyatı sayfasından güncel gram altın fiyatını girdiğinizde,
tüm ürünlerin fiyatı otomatik olarak orantılı şekilde güncellenir.

## 8) Özel gün indirimi

src/lib/pricing.ts dosyasındaki SPECIAL_DAYS listesine tarihleri girerek
(Sevgililer Günü, Anneler Günü, Babalar Günü gibi) hangi günlerde otomatik
%10 indirim ve karşılama ekranının çıkacağını belirleyebilirsiniz.

## 9) Yapı özeti

```
src/
  app/                 → Sayfalar ve API route'ları (Next.js App Router)
    admin/             → Yönetim paneli (sadece admin rolü erişebilir)
    api/               → Tüm API uç noktaları
  components/          → Paylaşılan arayüz bileşenleri
  context/AppContext   → Sepet, favoriler, ürünler, altın fiyatı (client state)
  db/                  → Drizzle şeması ve veritabanı bağlantısı
  auth.ts / auth.config.ts → Kimlik doğrulama (e-posta + şifre)
  lib/                 → Fiyatlandırma, tipler, seed verisi
scripts/seed.ts        → Örnek veri + admin hesabı oluşturma script'i
drizzle/               → Veritabanı migrasyon dosyaları
```

## 10) Canlıya alma (deploy)

Bu proje Abacus.AI (veya Vercel, Railway gibi herhangi bir Next.js destekleyen platform)
üzerine deploy edilebilir. Deploy ederken:

1. Bir PostgreSQL veritabanı bağlantısı sağlayın ve DATABASE_URL'i girin.
2. Yukarıdaki tüm ortam değişkenlerini (env vars) platformun ayarlarına girin.
3. Deploy sonrası bir kereliğine `npm run db:migrate` ve `npm run db:seed`
   komutlarını çalıştırın (çoğu platformda "build command" veya "release command"
   olarak tanımlanabilir).
4. NEXT_PUBLIC_APP_URL değerini gerçek domaininizle güncelleyin.
5. Lemonsqueezy webhook URL'sini gerçek domaininizle güncelleyin.

## 11) Bilinen sınırlamalar / sıradaki adımlar

- Ürün fotoğrafları şu an URL olarak eklenir; doğrudan dosya yükleme (ör. bir
  görsel depolama servisiyle) bir sonraki geliştirme adımı olabilir.
- E-posta bildirimleri (sipariş onayı, durum güncellemesi) henüz yok.
- Kargo takip entegrasyonu (/kargom-nerede) şu an placeholder içerik gösteriyor.
