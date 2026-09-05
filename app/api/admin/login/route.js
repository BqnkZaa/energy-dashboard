import { timingSafeEqual } from 'node:crypto';

export const runtime = 'nodejs';

function passwordsMatch(received, expected) {
  const receivedBuffer = Buffer.from(received, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return receivedBuffer.length === expectedBuffer.length
    && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export async function POST(request) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return Response.json(
      { success: false, message: 'ยังไม่ได้ตั้งค่า ADMIN_PASSWORD บน Vercel' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  let password = '';
  try {
    ({ password } = await request.json());
  } catch {
    return Response.json(
      { success: false, message: 'รูปแบบคำขอไม่ถูกต้อง' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  if (typeof password !== 'string' || !passwordsMatch(password, expectedPassword)) {
    return Response.json(
      { success: false, message: 'รหัสผ่านไม่ถูกต้อง' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  return Response.json(
    { success: true },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
