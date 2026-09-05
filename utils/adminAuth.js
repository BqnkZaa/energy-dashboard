export async function authenticateAdmin(password) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
    cache: 'no-store',
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'ยืนยันตัวตนไม่สำเร็จ');
  }
}
