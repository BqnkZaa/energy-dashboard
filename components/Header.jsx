'use client';
import { useState, useEffect } from 'react';

/**
 * Header Component
 * - โลโก้คณะวิศวกรรมศาสตร์ มทร.ล้านนา ลำปาง (ฝั่งซ้าย)
 * - ชื่อระบบตรวจวัดพลังงานไฟฟ้าแบบเรียลไทม์ (กึ่งกลาง)
 * - วันที่พุทธศักราชไทย, นาฬิกา และไอคอนสัญญาณ Wi-Fi (ฝั่งขวา)
 */
export default function Header({ connectionStatus }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      
      // ฟอร์แมตเวลา HH:MM:SS
      setTime(now.toLocaleTimeString('th-TH', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }));

      // ฟอร์แมตวันที่พุทธศักราชไทย (เช่น 22 มิถุนายน 2568)
      const thMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      setDate(`${now.getDate()} ${thMonths[now.getMonth()]} ${now.getFullYear() + 543}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isConnected = connectionStatus === 'connected';

  return (
    <header className="flex items-center justify-between px-6 h-[80px] shrink-0
                       border-b border-white/[0.06] bg-[#02050c]/80 backdrop-blur-md
                       relative z-10 select-none">
      
      {/* ─── LEFT: RMUTL Crest Logo & Faculty ─── */}
      <div className="flex items-center gap-3">
        {/* Simplified Golden RMUTL Emblem Icon */}
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <svg className="w-8 h-10 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" viewBox="0 0 30 38" fill="currentColor">
            {/* Outline of RMUTL crown spire logo */}
            <path d="M15 2 C13 7, 7 13, 7 19 C7 25, 11 29, 15 32 C19 29, 23 25, 23 19 C23 13, 17 7, 15 2 Z" className="opacity-20" />
            <path d="M15 0 L11 9 L15 6 L19 9 Z" fill="#f59e0b" />
            <path d="M15 7 C11 11, 7 15, 7 21 C7 27, 11 31, 15 34 C19 31, 23 27, 23 21 C23 15, 19 11, 15 7 Z" fill="url(#crestGrad)" />
            <defs>
              <linearGradient id="crestGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            {/* Lotus/Wheel outline inside */}
            <circle cx="15" cy="21" r="5" fill="none" stroke="#fef08a" strokeWidth="1.5" />
            <path d="M15 16 L15 26 M10 21 L20 21" stroke="#fef08a" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="flex flex-col text-left leading-tight">
          <span className="text-[12.5px] font-black text-white tracking-wide">
            คณะวิศวกรรมศาสตร์
          </span>
          <span className="text-[9.5px] text-white/50 font-medium mt-0.5">
            มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ลำปาง
          </span>
        </div>
      </div>

      {/* ─── CENTER: Real-Time Titles ─── */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center">
        <h1 className="text-[19px] font-extrabold text-white tracking-wider leading-none">
          ระบบตรวจวัดพลังงานไฟฟ้าแบบเรียลไทม์
        </h1>
        <h2 className="text-[10px] font-black text-white/30 tracking-[0.25em] uppercase mt-2">
          Real-Time Energy Monitoring System
        </h2>
      </div>

      {/* ─── RIGHT: Date, Monospace Clock, and Wi-Fi indicator ─── */}
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-end leading-none">
          {/* Green date */}
          <span className="text-[11px] font-bold text-emerald-400 tracking-wide mb-1.5">
            {date || '22 มิถุนายน 2568'}
          </span>
          {/* Digital Clock */}
          <span className="font-mono text-[22px] font-black tracking-wider text-white">
            {time || '14:30:25'}
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-9 w-px bg-white/[0.08]" />

        {/* Wi-Fi connection indicator */}
        <div className="flex items-center justify-center" title={isConnected ? 'Connected to WebSocket' : 'Disconnected'}>
          <svg className={`w-6 h-6 transition-colors duration-500 ${
            isConnected
              ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]'
              : 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]'
          }`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21a2 2 0 110-4 2 2 0 010 4zm-5.657-5.657a8 8 0 0111.314 0l-1.414 1.414a6 6 0 00-8.486 0l-1.414-1.414zm-2.828-2.828a12 12 0 0116.97 0l-1.414 1.414a10 10 0 00-14.142 0l-1.414-1.414zm-2.829-2.829a16 16 0 0122.628 0l-1.414 1.414a14 14 0 00-19.799 0l-1.414-1.414z" />
          </svg>
        </div>
      </div>

    </header>
  );
}
