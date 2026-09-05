'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header({ connectionStatus, activePage = 'dashboard' }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      const thMonths = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
      setDate(`${now.getDate()} ${thMonths[now.getMonth()]} ${now.getFullYear() + 543}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isConnected = connectionStatus === 'connected';

  return (
    <header className="relative shrink-0 select-none" style={{ height: '72px', background: 'rgba(5,8,15,0.97)', borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
      {/* Shimmer accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 header-line" />

      <div className="h-full flex items-center justify-between px-6">

        {/* LEFT: Logo + Faculty */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Lanna University emblem */}
          <div className="relative w-9 h-14 shrink-0 flex items-center justify-center">
            <Image
              src="/lanna-logo.png"
              alt="ตราสัญลักษณ์มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา"
              width={32}
              height={59}
              priority
              className="object-contain"
              style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.25))' }}
            />
          </div>

          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-[13px] font-bold tracking-wide" style={{ color: 'rgba(255,255,255,0.90)' }}>
              คณะวิศวกรรมศาสตร์
            </span>
            <span className="text-[10px] font-medium tracking-wide truncate" style={{ color: 'rgba(255,255,255,0.38)' }}>
              มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ลำปาง
            </span>
          </div>
        </div>

        {/* CENTER: System Title */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center pointer-events-none">
          <h1 className="text-[17px] font-extrabold tracking-wider leading-tight" style={{ color: 'rgba(255,255,255,0.93)', letterSpacing: '0.04em' }}>
            ระบบตรวจวัดพลังงานไฟฟ้าแบบเรียลไทม์
          </h1>
          <p className="text-[9.5px] font-bold tracking-[0.3em] uppercase mt-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Real-Time Energy Monitoring System
          </p>
        </div>

        {/* RIGHT: Navigation + Date + Clock + Status */}
        <div className="flex items-center gap-5">
          <Link
            href={activePage === 'map' ? '/' : '/map'}
            title={activePage === 'map' ? 'กลับสู่ Dashboard' : 'ดูแผนที่ตำแหน่งติดตั้ง'}
            className="hidden md:flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-bold transition-colors"
            style={{
              color: activePage === 'map' ? '#a78bfa' : 'rgba(255,255,255,0.48)',
              background: activePage === 'map' ? 'rgba(167,139,250,0.11)' : 'rgba(255,255,255,0.035)',
              border: `1px solid ${activePage === 'map' ? 'rgba(167,139,250,0.28)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <span aria-hidden="true">{activePage === 'map' ? '▦' : '⌖'}</span>
            {activePage === 'map' ? 'DASHBOARD' : 'แผนที่'}
          </Link>

          {/* Date & Clock */}
          <div className="flex flex-col items-end leading-none gap-1.5">
            <span className="text-[10.5px] font-semibold" style={{ color: '#34d399' }}>
              {date || '9 สิงหาคม 2569'}
            </span>
            <span className="font-mono text-[22px] font-black tabular tracking-wider" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '0.06em' }}>
              {time || '20:58:31'}
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.07)' }} />

          {/* Connection status */}
          <div className="flex flex-col items-center gap-1.5" title={isConnected ? 'Connected' : 'Disconnected'}>
            {isConnected ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 live-dot" style={{ color: '#34d399', filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.5))' }}>
                <path d="M12 21a2 2 0 110-4 2 2 0 010 4zm-5.657-5.657a8 8 0 0111.314 0l-1.414 1.414a6 6 0 00-8.486 0l-1.414-1.414zm-2.828-2.828a12 12 0 0116.97 0l-1.414 1.414a10 10 0 00-14.142 0l-1.414-1.414zm-2.829-2.829a16 16 0 0122.628 0l-1.414 1.414a14 14 0 00-19.799 0l-1.414-1.414z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6 animate-pulse" style={{ color: '#f87171', filter: 'drop-shadow(0 0 8px rgba(248,113,113,0.4))' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.584 10.587a2 2 0 002.828 2.83M6.343 6.343A8 8 0 0017.657 17.657M3.515 3.515A16 16 0 0020.485 20.485" />
              </svg>
            )}
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: isConnected ? '#34d399' : '#f87171' }}>
              {isConnected ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
