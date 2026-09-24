import { timingSafeEqual } from 'node:crypto';

export function passwordsMatch(received, expected) {
  if (typeof received !== 'string' || !expected) return false;
  const receivedBuffer = Buffer.from(received, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return receivedBuffer.length === expectedBuffer.length
    && timingSafeEqual(receivedBuffer, expectedBuffer);
}
