import { get, put } from '@vercel/blob';
import { passwordsMatch } from '../../../../utils/adminPassword';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONFIG_PATH = 'dashboard-config/websocket.json';
const NO_STORE = { 'Cache-Control': 'no-store' };

function isValidWebSocketUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return false;
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return ['ws:', 'wss:'].includes(parsed.protocol)
      && Boolean(parsed.hostname)
      && !parsed.username
      && !parsed.password
      && !parsed.hash;
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const result = await get(CONFIG_PATH, { access: 'private', useCache: false });
    if (!result) return Response.json({ url: '' }, { headers: NO_STORE });

    const saved = await new Response(result.stream).json();
    if (!isValidWebSocketUrl(saved?.url)) throw new Error('Invalid stored WebSocket URL');
    return Response.json({ url: saved.url }, { headers: NO_STORE });
  } catch (error) {
    console.error('[Config] อ่าน WebSocket URL ไม่สำเร็จ:', error);
    return Response.json(
      { message: 'ยังอ่าน WebSocket URL ส่วนกลางไม่ได้' },
      { status: 503, headers: NO_STORE },
    );
  }
}

export async function POST(request) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return Response.json(
      { message: 'ยังไม่ได้ตั้งค่า ADMIN_PASSWORD บน Vercel' },
      { status: 503, headers: NO_STORE },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'รูปแบบคำขอไม่ถูกต้อง' }, { status: 400, headers: NO_STORE });
  }

  if (!passwordsMatch(body?.password, expectedPassword)) {
    return Response.json({ message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401, headers: NO_STORE });
  }

  const url = typeof body.url === 'string' ? body.url.trim() : body.url;
  if (!isValidWebSocketUrl(url)) {
    return Response.json(
      { message: 'กรุณาใส่ WebSocket URL ที่ขึ้นต้นด้วย ws:// หรือ wss://' },
      { status: 400, headers: NO_STORE },
    );
  }

  try {
    await put(CONFIG_PATH, JSON.stringify({ url }), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return Response.json({ url }, { headers: NO_STORE });
  } catch (error) {
    console.error('[Config] บันทึก WebSocket URL ไม่สำเร็จ:', error);
    return Response.json(
      { message: 'บันทึก WebSocket URL ส่วนกลางไม่สำเร็จ กรุณาตรวจ Vercel Blob' },
      { status: 503, headers: NO_STORE },
    );
  }
}
