import { NextRequest, NextResponse } from 'next/server';

// BASIT RATE LIMIT - Hafizada tutar (Vercel icin yeterli)
// Gercek projede Upstash Redis kullan
const ipMap = new Map<string, { count: number, reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipMap.get(ip);
  if (!record || now > record.reset) {
    ipMap.set(ip, { count: 1, reset: now + 60 * 60 * 1000 }); // 1 saat
    return false;
  }
  if (record.count >= 20) return true; // saatte max 20 istek
  record.count++;
  return false;
}

// Input temizleme - XSS / Prompt Injection korumasi
function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>?/gm, '') // HTML taglari sil
    .replace(/\$\{.*?\}/g, '') // ${} injection sil
    .slice(0, 1000); // max 1000 karakter
}

export async function POST(req: NextRequest) {
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Cok fazla istek. 1 saat sonra tekrar dene.' }, { status: 429 });
  }

  try {
    const { platform, productName, category, features, tone } = await req.json();

    if (!productName || !features) {
      return NextResponse.json({ error: 'Urun adi ve ozellikleri gerekli' }, { status: 400 });
    }

    // Guvenli temizleme
    const cleanName = sanitize(productName);
    const cleanFeatures = sanitize(features);

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      return NextResponse.json({ error: 'API anahtari ayarlanmamis' }, { status: 500 });
    }

    // Platforma gore prompt
    const prompts: any = {
      trendyol: `Sen Trendyol icin urun aciklamasi yazan uzmansin. Kisa, etiketli, satisi artiran dil kullan. Urun: ${cleanName}, Kategori: ${category}, Ozellikler: ${cleanFeatures}, Ton: ${tone}`,
      hepsiburada: `Sen Hepsiburada icin SEO uyumlu uzun aciklama yazan uzmansin. Anahtar kelimeler kullan. Urun: ${cleanName}, Ozellikler: ${cleanFeatures}`,
      amazon: `Sen Amazon TR icin bullet-point ve SEO odakli aciklama yazan uzmansin. 5 bullet + aciklama + search terms. Urun: ${cleanName}, Ozellikler: ${cleanFeatures}`,
      sahibinden: `Sen Sahibinden.com icin guven veren ikinci el/sifir urun aciklamasi yazan uzmansin. Samimi ve guvenilir. Urun: ${cleanName}, Ozellikler: ${cleanFeatures}`,
      shopier: `Sen Shopier ve Instagram satisi icin samimi, emojili, genc dili kullanan aciklama yazan uzmansin. Urun: ${cleanName}, Ozellikler: ${cleanFeatures}`
    };

    const selectedPrompt = prompts[platform] || prompts.trendyol;

    // OpenAI Cagrisi - ANAHTAR SADECE BURADA, FRONTEND'DE ASLA YOK
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // en ucuz ve hizli
        messages: [{ role: 'user', content: selectedPrompt }],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || 'Aciklama olusturulamadi';

    return NextResponse.json({ result });

  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatasi' }, { status: 500 });
  }
}