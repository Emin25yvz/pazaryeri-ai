'use client';
import { useState } from 'react';

const platforms = [
  { id: 'trendyol', name: 'Trendyol' },
  { id: 'hepsiburada', name: 'Hepsiburada' },
  { id: 'amazon', name: 'Amazon' },
  { id: 'sahibinden', name: 'Sahibinden' },
  { id: 'shopier', name: 'Shopier' },
];

export default function Home() {
  const [platform, setPlatform] = useState('trendyol');
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!productName || !features) return alert('Urun adi ve ozellikleri gir');
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, productName, category: 'Genel', features, tone: 'Satis Odakli' })
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else setResult(data.result);
    } catch (e) { alert('Hata olustu'); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Pazaryeri AI - 5 Platform Tek Yer</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Trendyol, Hepsiburada, Amazon, Sahibinden, Shopier icin tek tikla aciklama yaz.</p>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {platforms.map(p => (
          <button key={p.id} onClick={() => setPlatform(p.id)}
            style={{ padding: '10px 18px', borderRadius: 999, border: '1px solid #ddd', background: platform===p.id ? 'black' : 'white', color: platform===p.id ? 'white' : 'black', cursor: 'pointer' }}>
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ border: '1px solid #eee', borderRadius: 16, padding: 20 }}>
          <input value={productName} onChange={e=>setProductName(e.target.value)} placeholder="Urun Adi: Orn. Oversize Pamuk T-Shirt" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', marginBottom: 12 }} />
          <textarea value={features} onChange={e=>setFeatures(e.target.value)} placeholder="Ozellikler: %100 pamuk, L beden, yikamada cekmez..." style={{ width: '100%', height: 120, padding: 12, borderRadius: 8, border: '1px solid #ddd' }} />
          <button onClick={generate} disabled={loading} style={{ marginTop: 12, width: '100%', padding: 14, borderRadius: 10, background: '#FF6000', color: 'white', border: 0, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? 'Yaziliyor...' : `${platforms.find(p=>p.id===platform)?.name} Icin Olustur`}
          </button>
          <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>🔒 Guvenli altyapi - API anahtari sunucuda korunuyor</p>
        </div>
        <div style={{ border: '1px solid #eee', borderRadius: 16, padding: 20, background: '#fafafa', minHeight: 250 }}>
          <strong>Sonuc:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 12, fontFamily: 'inherit' }}>{result || 'Aciklama burada gozukecek...'}</pre>
        </div>
      </div>
    </div>
  );
}