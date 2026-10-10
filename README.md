# Dreamchat — yerel ürün önizlemesi

Landing page, yönetici kayıt/giriş, onboarding, atlanabilir ürün turu ve Instagram otomasyon stüdyosu. Özgün SVG logo ve animasyonlu görseller. `/demo` gerçek hesabı etkilemeyen interaktif bir sunumdur.

## Hızlı başlangıç

Node 24 LTS önerilir (native SQLite modülü Node sürümüyle uyumlu kurulmalıdır).

```sh
npm install
cp .env.example .env.local
npm run dev
```

- Landing: http://127.0.0.1:3000/
- Yönetici kaydı: http://127.0.0.1:3000/signup
- Giriş: http://127.0.0.1:3000/login
- İnteraktif demo: http://127.0.0.1:3000/demo
- Yönetim: http://127.0.0.1:3000/dashboard

İlk kayıt bu yerel çalışma alanının yöneticisini oluşturur; sonradan kayıt ekranı giriş veya demoya yönlendirir. Bu sürüm çok müşterili SaaS değildir. Arkadaşlar `/demo` ile örnek senaryoyu deneyebilir. Şifreler scrypt ile hashlenir; oturum çerezi HttpOnly/SameSite ve 7 günlük sürelidir. E-posta doğrulaması, şifre sıfırlama ve ödeme henüz yoktur. Örnek fiyatlar aktif ticari teklif değildir.

## GitHub ve dağıtım

Kaynak kodu GitHub'a koyabilirsin; GitHub Pages bu Next.js/SQLite backend'ini çalıştırmaz. Tam uygulama Node sunucusu ve kalıcı disk gerektirir. Lokal demo için deploy gerekmiyor. Mevcut yerel erişim kısıtları uzaktan müşteri kullanımı için ayrıca uyarlanmalıdır; bunları kaldırmak tek başına çok müşterili güvenli ürün oluşturmaz.

```sh
npm run build
npm run start
npm run test:auth
npm run test:flow
```

`.env.local`, `data/`, SQLite veritabanı, token-key, oturumlar ve gerçek Instagram verileri GitHub'a gönderilmez. `.gitignore` bunları dışlar. Kaynak paketinde gerçek token veya kullanıcı kaydı yoktur. Uzak HTTPS yayında secure cookie, işletme gizlilik bilgileri, müşteri izolasyonu, yedekler ve kalıcı OAuth/webhook adresleri tamamlanmalıdır. Yerel yönetici hesabını ilk kez yalnızca kendi bilgisayarında oluştur.

## Yeni deneyim

Kayıt → çalışma alanı adı, rol, hedef, ekip büyüklüğü, nereden duydun soruları → dashboard ürün turu. Onboarding atlanabilir. Ürün turunun tamamlanma/atlama durumu yerel veritabanında saklanır ve yeniden açılabilir.

---

# Reel bazlı local Instagram otomasyonu

Next.js + TypeScript + SQLite/better-sqlite3 + Drizzle. Tek Instagram hesabında birden çok Reel. Hosting yok; Mac açık ve süreçler çalışıyor olmalı.

## Başlatma

Bu Mac'te Node 24 `/usr/local/bin/node` konumunda. Native SQLite modülü için aynı Node sürümünü kullan.

```sh
cd ~/Projects/instagram-dream-automation
export PATH="/usr/local/bin:$PATH"
npm run dev
```

Dashboard: http://127.0.0.1:3000/dashboard

Diğer iki terminalde aynı klasörde:

```sh
npm run webhook-proxy
cloudflared tunnel --url http://127.0.0.1:3001
```

Proxy yalnızca `/api/meta/webhook` GET/POST isteklerini geçirir; dashboard internete açılmaz. Callback adresi `https://...trycloudflare.com/api/meta/webhook`; geçici adres her başlatmada değişebilir. Oturum açılış servisi kurulmadı.

## Yeni Reel otomasyonu

1. Dashboard'da **Yeni Reel otomasyonu** bölümüne git.
2. Meta bağlantısı hazırsa **Instagram’dan Reel’leri getir** düğmesini kullan. Son 500 medya içindeki Reel'ler listeye alınır. Yeni Reel paylaşınca tekrar güncelle.
3. Reel listesinden seç; API ID ve bağlantı otomatik dolar. Bağlantı yoksa media ID'yi elle gir. Reel URL'sindeki shortcode API media ID değildir.
4. Otomasyon adı, yorum keyword'ü, açık yanıt varyasyonları (satır başına bir), ilk DM, takip isteği, final mesaj ve HTTPS linki gir.
5. Takip kontrolünü ve aktif durumunu seç; kaydet.

Her Reel için tek otomasyon bulunabilir. Karttan düzenle, duraklat veya etkinleştir. Üst sekmeler sayaçları ve son hareketleri Reel'e göre filtreler. Test modunda aktif otomasyon Instagram'a mesaj göndermez.

## Akış

Keyword içeren yorum → comment_id tekilleştirme → açık yanıt → private reply → contact state. Kullanıcı ilk DM'deki cevap kodunu gönderince takip kontrolü yapılır, ardından ilgili Reel'in linki gönderilir. `{keyword}` ilk DM'de Reel'e ait cevap koduyla değiştirilir.

Bir kişi birden fazla Reel'in akışına katılabilir. Aynı keyword birden fazla bekleyen akışa uyarsa sistem hangi Reel için devam edileceğini sorar; yanlış link göndermez. `TAKİP ETTİM <otomasyon ID>` beyanı ilgili Reel'e uygulanır.

`is_user_follow_business` alanı API context'inde kullanılabiliyorsa true/false ile doğrulama yapılır; kullanılamıyorsa self-confirmation fallback vardır. Beyan ve verified takipçiler ayrı sayılır. Takip kontrolü kapalıysa kullanıcı cevabından sonra link gönderilir.

Duraklatma hem yeni yorumları hem bekleyen DM akışlarını durdurur. Mesaj/link düzenlemeleri bekleyen kullanıcıların sonraki adımına da uygulanır. Verisi olan otomasyonun Reel ID'si değiştirilemez; başka Reel için yeni otomasyon aç.

## Meta kurulumu

1. Meta Developer App oluştur ve Instagram API / Instagram Login ekle. Instagram Business veya Creator hesabı kullan. Test aşamasında App/Instagram tester rollerini tamamla.
2. İzinler: `instagram_business_basic`, `instagram_business_manage_comments`, `instagram_business_manage_messages`. App dışındaki kullanıcılar için gerekli Advanced Access/App Review süreçlerini tamamla.
3. App Dashboard üzerinden token üret veya Instagram Login authorization flow ile al. Bu MVP OAuth callback ve otomatik token yenileme sağlamaz.
4. `.env.local` içinde gerçek `META_APP_ID`, `META_APP_SECRET`, `META_ACCESS_TOKEN`, `INSTAGRAM_ACCOUNT_ID` değerlerini gir. `META_API_VERSION` hesabın desteklediği sürümle eşleşmeli; varsayılan v25.0. Gerçek credentiallar başlangıçta boştur.
5. Meta webhook callback URL ve `.env.local` içindeki `WEBHOOK_VERIFY_TOKEN` değerini kullan. GET doğrulaması hub.challenge döndürür. App webhook fields: comments, messages.
6. Hesabı resmi Graph Instagram API'de `POST /{ig-user-id}/subscribed_apps` ve `subscribed_fields=comments,messages` ile kullanıcı tokenını kullanarak abone et.
7. Reel ayarları ve linkleri panelde tamamla. Hazır olduğunda `MOCK_MODE=false` yapıp sunucuyu yeniden başlat.

Gerçek modda webhook HMAC-SHA256 imzası META_APP_SECRET ile doğrulanır. Mock modunda yerelde üretilen LOCAL_TEST_SIGNING_SECRET kullanılır. WEBHOOK_VERIFY_TOKEN da rastgele üretildi; bu değerler gerçek access token değildir. .env.local ve data git dışında; credentialları sohbet/log çıktısına yazdırma.

## Veriler ve sınırlar

SQLite `data/app.db` dosyasında: automations, contacts, events ve Instagram'dan getirilen Reel metadatası için reels. Contacts anahtarı kullanıcı + otomasyon ID; events automation_id içerir. Env'deki INSTAGRAM_MEDIA_ID/NOTION_URL yalnızca ilk kayıt ve eski sürümden geçiş içindir; sonraki ayarlar panelden kalıcı olarak saklanır ve restart sırasında sıfırlanmaz. Eski contacts/events ilk otomasyona bağlanarak korunur.

Private reply tek mesajdır; devamı kullanıcı cevabını bekler. 7 günden eski comment webhookları ve 24 saatten eski DM webhookları atlanır; Meta ayrıca mesajlaşma sınırlarını uygular.

Operasyonlar gönderim öncesinde events tablosunda claim edilir. Ağ sonucu belirsiz, failed veya processing işlemler otomatik yeniden gönderilmez: çift gönderimi önler, fakat başarısız teslimat manuel inceleme gerektirebilir. Kalıcı job queue/backoff bu MVP'de yoktur. Son hareketler işlem durumunu gösterir. Mac uyurken/kapalıyken işlem yapılmaz.

## Testler

```sh
npm test
node --import tsx scripts/migration-test.ts
# Sunucu açık ve panelde aktif test otomasyonu yapılandırılmışken:
npm run fake-webhook -- 2
```

Unit/handler testleri izole geçici veritabanında çalışır: tekilleştirme, takip beyanı, tek link, imza doğrulaması, farklı Reel'lerde aynı kullanıcı, belirsiz keyword seçimi, duraklatma, düzenleme ve çift Reel doğrulaması. Migration testi eski state ve eventleri koruduğunu kontrol eder. Fake webhook scripti seçilen otomasyonun ayarlarıyla yalnızca mock modunda HTTP istekleri gönderir; simülasyon kayıtları dashboard'da görünür.

## Resmi kaynaklar

- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
- https://developers.facebook.com/docs/instagram-platform/private-replies/
- https://developers.facebook.com/docs/instagram-platform/webhooks/
- https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile/
- https://www.postman.com/meta/instagram/overview
- https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/

Yalnızca resmi Meta API kullanılır; scraping veya Instagram browser automation yoktur. Meta bağlantısı ve Reel listeleme gerçek credentiallarla henüz doğrulanmadı.


## Instagram ile bağlan (OAuth)

Panelde Hesap ve bağlantı → Instagram ile bağlan. Kullanıcı Instagram'ın kendi sayfasında giriş yapıp izin verir; şifresi bu uygulamaya girilmez. İzin sonrası HTTPS tunnel callback'i yalnızca izin kodunu alır; kullanıcı local uygulamaya döner. Yerelde başlangıç tarayıcısına ait HttpOnly verifier cookie kontrol edilir; state 10 dakika geçerli ve tek kullanımlıktır. Kod server tarafında tokena çevrilir; profil, hesap webhook aboneliği ve Reel listesi alınır.

Uygulama sahibi bir kez `.env.local` içinde `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET` (Instagram API Setup'taki değerler) ve `INSTAGRAM_REDIRECT_URI` yapılandırır. ID/Secret boşsa eski META_APP_ID/SECRET alanları fallback olur. META_APP_SECRET ayrıca canlı webhook imzası için gereklidir. Redirect tam olarak `https://TUNNEL-ADRESI/api/instagram/callback` olmalı; Meta Instagram Login → Valid OAuth Redirect URIs alanına aynı adres kaydedilmeli. `APP_LOCAL_ORIGIN=http://127.0.0.1:3000` local dönüş adresidir. Bağlantı bu tarayıcıda ve Mac üzerinde tamamlanır; local panel remote kullanıcılara açık değildir.

Proxy artık yalnızca webhook ve OAuth callback'i açar; start/complete/dashboard dışarı açılmaz. Tunnel adresi değişirse env redirect ve Meta redirect ayarını güncelle. Hesap Business/Creator olmalı. Başkalarının kendi hesaplarını bağlaması için Meta App'in ilgili izinlerinde gerekli App Review/Advanced Access şartları tamamlanmalıdır. Tek çalışma alanında tek hesap desteklenir; farklı hesapla yeniden bağlanma reddedilir.

Token AES-256-GCM ile SQLite instagram_connection tablosunda şifreli saklanır. Anahtar `data/token-key` dosyasında 0600 izinle üretilir. Veritabanı yedeği alırken bu anahtarı da güvenli şekilde koru. Token veya App Secret client props'a gönderilmez. OAuth callback URL'leri geliştirme request log'larında gizlenir. Token otomatik yenilenmez; panel geçerlilik tarihini gösterir ve süresi dolunca yeniden bağlantı gerekir.

Hesabı bağlamak test modunu değiştirmez. Reel'ler gerçek bağlı hesaptan test modunda da alınabilir. Gerçek mesaj gönderimini kullanıcı panelden ayrıca açar; bu işlem hesap bağlantısı, webhook aboneliği ve Meta webhook secret/verification ayarlarını gerektirir. Meta'da comments/messages alanlarının App webhook aboneliğini yine uygulama sahibi tamamlamalıdır.

Test: `node --import tsx scripts/oauth-test.ts`. Ağ çağrıları izole testte mock edilir; gerçek hesapla uçtan uca izin/token testi App bilgileri gelince yapılır.

## Facebook Login setup

For “API setup with Facebook login”, set `META_LOGIN_PROVIDER=facebook`, `META_APP_ID` and `META_APP_SECRET` in `.env.local`. Leave `INSTAGRAM_APP_ID` and `INSTAGRAM_APP_SECRET` empty to use Meta credentials. Register `INSTAGRAM_REDIRECT_URI` in Facebook Login for Business → Settings → Valid OAuth Redirect URIs. The app exchanges the code, lists managed Pages, selects the linked Instagram matching `INSTAGRAM_EXPECTED_USERNAME`, and encrypts the Page token. Facebook Page webhook subscription needs separate configuration and authorization; live mode stays blocked until that subscription is completed. Direct Instagram Login remains available with `META_LOGIN_PROVIDER=instagram`. Never share App Secret in screenshots or chat; enter it in the local environment file.

## Visual flow builder

Drag public reply, message, follow-check and link blocks from the right palette. Move blocks by their headers. Connect an output circle to a target input; click a line to remove the connection. Add public-reply variants with +; one is randomly selected per comment. Message quick replies each have their own connection. A follow check has Yes and No branches; connect No back to the follow request message. The first private comment reply stays text-only and requires a user response before subsequent quick-reply messages. Follow API unavailable defaults to No; explicit self-confirmation can be enabled in the follow block and is tracked separately. Existing contacts keep a snapshot of the flow while new comments use the latest saved version. Flow validation rejects missing edges, disconnected blocks, immediate loops and delivery before the first user response. Preview simulates both follower states.

Run `node --import tsx scripts/flow-test.ts` for isolated graph runtime tests. Live Instagram quick-reply rendering requires a connected account and has not been verified by the local simulator.


İlk takip DM akışı: yorum → public yanıt → takip mesajı (postback buton şablonu) → takip kontrolü → link. Ek EVET/DREAM cevabı istenmez. İlk butonlu DM en fazla 3 buton/640 karakter; sonraki mesajlar quick replies kullanır. Bu ilk özel yanıt şablonu yalnızca yerel testlerde doğrulandı; gerçek Instagram teslimi henüz test edilmedi. API reddederse otomatik ikinci özel yanıt denenmez.


Webhook teslimi aksarsa resmi API yedek kontrolü: `node --env-file=.env.local --import tsx scripts/poll-meta.ts`. Etkin Reel yorumlarını ve bekleyen akışlardaki DM cevaplarını yorumları 6 saniyede, bekleyen DM cevaplarını 3 saniyede kontrol eder (istek sürerken yeni tur açılmaz). Başlangıçtan 15 dakika önceki olaylara kadar bakar; eski yorumları topluca işlemez. Aynı SQLite olay kimlikleri tekrarları engeller. Uygulama ve bu işlem Mac açıkken çalışır; otomatik açılış servisi değildir.
