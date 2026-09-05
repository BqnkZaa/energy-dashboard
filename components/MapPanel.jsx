'use client';

const DEFAULT_DELTA = 0.006;

function toCoordinate(value, min, max) {
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

function createMapUrl(latitude, longitude) {
  const west = Math.max(-180, longitude - DEFAULT_DELTA);
  const east = Math.min(180, longitude + DEFAULT_DELTA);
  const south = Math.max(-90, latitude - DEFAULT_DELTA);
  const north = Math.min(90, latitude + DEFAULT_DELTA);
  const params = new URLSearchParams({
    bbox: `${west},${south},${east},${north}`,
    layer: 'mapnik',
    marker: `${latitude},${longitude}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

export default function MapPanel({ billingSettings, connectionStatus }) {
  const latitude = toCoordinate(billingSettings?.siteLatitude, -90, 90);
  const longitude = toCoordinate(billingSettings?.siteLongitude, -180, 180);
  const hasLocation = latitude !== null && longitude !== null;

  if (!hasLocation) {
    return (
      <section className="flex-1 min-h-0 rounded-2xl flex flex-col items-center justify-center text-center p-8" style={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.065)' }}>
        <div style={{ fontSize: '38px', filter: 'drop-shadow(0 0 16px rgba(167,139,250,0.35))' }}>📍</div>
        <h2 style={{ marginTop: '14px', color: 'rgba(255,255,255,0.9)', fontSize: '17px', fontWeight: 700 }}>ยังไม่ได้ระบุตำแหน่งติดตั้ง</h2>
        <p style={{ maxWidth: '410px', marginTop: '7px', color: 'rgba(255,255,255,0.42)', fontSize: '12px', lineHeight: 1.7 }}>
          แอดมินกดปุ่ม ⚙ แล้วกรอกรหัสผ่าน เพื่อระบุ Latitude และ Longitude ของจุดติดตั้งเครื่องตรวจวัด
        </p>
        {connectionStatus !== 'connected' && (
          <p style={{ marginTop: '14px', color: '#fbbf24', fontSize: '11px' }}>ต้องเชื่อมต่อ Backend ก่อนบันทึกพิกัด</p>
        )}
      </section>
    );
  }

  const mapUrl = createMapUrl(latitude, longitude);
  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;

  return (
    <section className="flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col" style={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.065)' }}>
      <div className="shrink-0 flex items-center justify-between gap-4 px-5" style={{ minHeight: '64px', borderBottom: '1px solid rgba(255,255,255,0.065)' }}>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 700 }}>ตำแหน่งติดตั้งอุปกรณ์</div>
          <div className="font-mono" style={{ marginTop: '3px', color: 'rgba(255,255,255,0.42)', fontSize: '11px' }}>LAT {latitude.toFixed(6)} · LNG {longitude.toFixed(6)}</div>
        </div>
        <a href={osmUrl} target="_blank" rel="noreferrer" style={{ flexShrink: 0, padding: '8px 11px', borderRadius: '8px', color: '#a78bfa', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', fontSize: '11px', fontWeight: 700 }}>
          เปิดแผนที่เต็มจอ ↗
        </a>
      </div>
      <iframe title="แผนที่จุดติดตั้งระบบตรวจวัดพลังงาน" src={mapUrl} className="flex-1 min-h-0 w-full" style={{ border: 0, filter: 'saturate(0.9) contrast(1.03)' }} loading="lazy" referrerPolicy="no-referrer" />
    </section>
  );
}
