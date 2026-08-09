/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Turbopack (Next.js 16 default bundler) ────────────────
  // ระบุ empty config เพื่อ silence warning เมื่อไม่มี webpack config
  turbopack: {},

  // ── Image Optimization ────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // ── Logging ───────────────────────────────────────────────
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

export default nextConfig;

