export async function getSharedWsUrl() {
  const response = await fetch('/api/config/websocket', { cache: 'no-store' });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'อ่าน WebSocket URL ส่วนกลางไม่สำเร็จ');
  return payload.url || '';
}

export async function saveSharedWsUrl(url, password) {
  const response = await fetch('/api/config/websocket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({ url, password }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message || 'บันทึก WebSocket URL ส่วนกลางไม่สำเร็จ');
  return payload.url;
}
