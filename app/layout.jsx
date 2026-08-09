import './globals.css';

export const metadata = {
  title: 'ระบบตรวจวัดพลังงานไฟฟ้า | Real-Time Energy Monitoring System',
  description: 'ระบบตรวจวัดพลังงานไฟฟ้า 3 เฟสแบบเรียลไทม์ | ESP32 + PZEM-004T + Raspberry Pi',
  keywords: 'energy monitoring, 3-phase, PZEM, ESP32, real-time, dashboard',
};

// Next.js 16: viewport ต้อง export แยกต่างหาก (ไม่รวมใน metadata)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};


export default function RootLayout({ children }) {
  return (
    <html lang="th" className="h-full overflow-hidden">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Thai:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden bg-[#080c17]">
        {children}
      </body>
    </html>
  );
}
