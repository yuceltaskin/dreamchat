# Dreamchat — Brand Guidelines v1.0

Konsept: The Good Conversation Club. Bir üreticinin masasındaki kâğıt, not ve çizimler.
Marka cümlesi: **Sen içerik üret. Sohbet aksın.**

## Konumlandırma ve ses

Dreamchat bir yorum ile anlamlı bir sohbet arasındaki işi kolaylaştırır. İnsanların kendi sesiyle konuşmasına alan açar. Sıcak, açık, oyuncu ve özenli. Kısa Türkçe cümleler, somut eylemler. “Akışını oluştur.” veya “Henüz takip görünmüyor. Tekrar deneyelim.” gibi doğrudan metinler kullan. Abartılı satış vaatleri, doğrulanmamış rakamlar ve yapay aciliyetten kaçın.

## Logo

İki katmanlı sohbet balonu ve sakin bir yüz. Siyah balonun arkasındaki sarı katman devam eden bağlantıyı simgeler. Wordmark küçük harflerle dreamchat. yazılır. Sağlanan SVG'ler esas kaynaktır. Wordmark Arial/Helvetica sistem yazı tipini içerir; dış üretime giderken tasarım aracında metni eğrilere dönüştür.

- Koruma alanı: sembol genişliğinin en az ¼’ü.
- Minimum sembol: 24 px. Minimum wordmark: 140 px.
- Esnetme, eğme, gölge veya degrade ekleme.
- Fotoğraf üstünde düz krem bir zemin ayır.

## Renkler

| İsim | Kod | Rol |
|---|---|---|
| Kâğıt / Paper | #FBF7ED | Ana zemin, yaklaşık %55 |
| Mürekkep / Ink | #24251F | Metin, kontur, CTA, yaklaşık %15 |
| Tereyağı / Butter | #F4DA77 | Ana vurgu, yaklaşık %20 |
| Adaçayı / Sage | #BFCDB2 | Akış ve takip durumları |
| Pudra / Rose | #EAC4B7 | Sıcak sohbet yüzeyleri |
| Sis / Mist | #CBD9E4 | İkincil bilgi |

Yardımcı üç renk toplam yaklaşık %10. Bunlar kompozisyon hedefidir, katı ölçüm değildir. Pastel zemin üzerinde mürekkep kullan. Sarı metni krem zemine veya pastel metni beyaz zemine koyma. İkincil metin #68695C. Durumları metin ve ikonla destekle.

## Tipografi

- Ana aile: Arial, Helvetica, sans-serif. Başlık 700–800, gövde 400.
- Editoryal vurgu: Georgia italic; başlıkta bir veya iki kelime.
- Teknik etiket: sistem monospace, 9–10 px, 1–1.5 px harf aralığı. Ana içerikte kullanma.
- Ana başlık: masaüstü 65–113 px / mobil 44–71 px, satır 1.02–1.08.
- Bölüm başlığı: 42–64 px / mobil 41 px, satır 1.02.
- Gövde: 14–16 px / mobil 13–14 px, satır 1.7–1.8.
- Butonlar: 12–14 px; kısa eylem + yön oku.

## Kompozisyon ve öğeler

8 px temel boşluk sistemi: 8/16/24/32/48/64/96. İçerik 1180–1280 px. Büyük başlık, etkileşimli sahne, editoryal iki sütun ve koyu ara bölümlerle ritim değişir. Tekrarlı üçlü özellik kartları temel düzen değildir.

- Sohbet çiçeği: özgün çizim; büyüyen bağlantıyı temsil eder. Boş durum/karşılama/editoryal kullanım. Görünüm başına bir ana figür.
- Serbest çizgi ve ok: akışın yönünü anlatır; rastgele süs olarak kullanılmaz.
- Not kâğıdı: düz pastel dolgu, 1 px kontur, 1–5° eğim, hafif sert gölge.
- Formlar ve kritik işlem butonları düz kalır.
- Buton köşesi 4–6 px; sohbet balonu 12–22 px.

## Hareket ve erişilebilirlik

Hover 150–200 ms ve 2–3 px. Mesaj gelişi 250–300 ms, 9 px aşağıdan. Otomatik kayan metin, sürekli zıplama ve parallax kullanılmaz. prefers-reduced-motion gözetilir. Klavye odağı 2 px mürekkep çizgiyle görünür. Etkileşimler gerçek davranışı açıklamalı; yalnızca dikkat dağıtmamalı.

## İçerik doğruluğu

Simülasyonları açıkça etiketle. Gerçek veri olmayan örnekler, başarı istatistiği olarak sunulmaz. Fiyatlar bu sürümde örnektir. Studio, Telegram ve TikTok yol haritasıdır. Resmî ortaklık rozeti veya müşteri logosu yetkisiz kullanılmaz.

## Uygulama ve dosyalar

- app/brand.css: ortak renk değişkenleri, ana sayfa ve rehber stilleri.
- app/components/brand.tsx: ortak logo, çiçek, serbest çizgi.
- app/components/landing.tsx: etkileşimli ana sayfa.
- /brand: görsel rehber, kopyalanabilir renkler, yazdırma/PDF düzeni.
- public/brand: SVG logo, wordmark, çiçek, ok, bu belge ve marka kiti.

Ana sayfa, giriş ekranı ve yönetim panelinin ana vurgu renkleri bu kimliği kullanır. Yeni ekranlarda aynı değişkenleri kullan.
