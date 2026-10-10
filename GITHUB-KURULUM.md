# GitHub’a yükleme

Bu paket Dreamchat’in güncel kaynak kodudur: pastel ana sayfa, marka rehberi, SVG varlıkları, yönetici girişi ve Instagram otomasyonu.

1. ZIP’i aç.
2. Yeni GitHub reposuna ZIP dosyasını değil, içindeki dosya ve klasörleri yükle. package.json repo kökünde olsun.
3. Gizli dosyaların da taşındığından emin ol: .gitignore, .env.example, .node-version.
4. Yerelde Node 24 ile npm ci, ardından cp .env.example .env.local ve npm run dev çalıştır.

## Yayınlama kapsamı

GitHub repo barındırır; GitHub Pages bu Next.js + SQLite uygulamasının tamamını çalıştırmaz. Tam uygulama için Node.js ve kalıcı disk gerekir. Bu sürüm yerel kullanım için hazırlanmıştır: uzak yönetici girişi kısıtları, HTTPS oturum ayarları ve kalıcı OAuth/webhook adresleri ayrıca uyarlanmalıdır. Paketi yüklemek tek başına herkese açık çalışan SaaS kurmaz.

Gerçek secret değerleri, yönetici kullanıcıları, Instagram kayıtları, veritabanı ve token anahtarı pakete dahil değildir. Bunlar GitHub’a yüklenmemelidir. Kurulumun ayrıntıları README.md içinde.

Ana sayfa: /
Marka rehberi: /brand
Etkileşimli demo: /demo
Yönetim: /dashboard
