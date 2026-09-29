# Pazaryeri AI - Güvenli Kurulum (1. Sınıf Seviyesi)

Bu proje 5 pazar yeri için AI açıklama yazıcıdır. Güvenlik en üst seviyede.

## NE ZAMANA YAYINLANIR?
- Kodu Vercel'e atma: 5 dakika
- Domain bağlama: 10 dakika
- Toplam: 30 dakikada internette.

## GÜVENLİK ÖNLEMLERİ (Kodun içinde hazır)
1. API Anahtarı asla tarayıcıda yok - sadece /api/generate içinde
2. Rate Limit: Aynı IP saatte max 20 istek (bot koruması)
3. Input Temizleme: <script> gibi zararlı kodlar otomatik silinir
4. .env dosyası GitHub'a gitmez

## KURULUM - EN KOLAY YOL (3 Adım)

ADIM 1: Vercel Hesabı Aç
vercel.com -> GitHub ile giriş yap (bedava)

ADIM 2: Projeyi Yükle
Bu klasörü GitHub'a yükle, Vercel otomatik algılar.

ADIM 3: API Anahtarı Ekle (ÇOK ÖNEMLİ)
Vercel Dashboard > Settings > Environment Variables
Key: OPENAI_API_KEY
Value: sk-.... (OpenAI'den aldığın anahtar)

Hepsi bu. Site yayında.

## Maliyet
- Vercel Hosting: 0 TL (bedava)
- Domain: ~150 TL / yıl (türkiye için Natro/GoDaddy)
- OpenAI: 1 açıklama ~0.02 TL, sen 99TL'ye satıyorsun
- iyzico: Sadece satış olunca %2.9 komisyon

## Dosyalar
- app/page.tsx -> Sitenin ön yüzü (temiz tasarım)
- app/api/generate/route.ts -> Gizli, güvenli AI bağlantısı
- .env.example -> Örnek anahtar dosyası

Güvenlik için ASLA .env dosyasını kimseyle paylaşma.
