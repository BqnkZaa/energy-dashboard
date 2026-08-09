'use client';
import { fmt1, fmt2 } from '@/utils/formatters';

/**
 * MainMetrics Component
 * แสดง 5 การ์ดหลักด้านบนตามต้นแบบ (VOLTAGE, CURRENT, FREQUENCY, TOTAL ENERGY, ENERGY COST)
 * ออกแบบตามรูปภาพตัวอย่างเป๊ะๆ
 */
export default function MainMetrics({ data }) {
  const p = data?.phases;

  // L1
  const l1_v = p?.L1?.v ?? 0;
  const l1_a = p?.L1?.a ?? 0;
  const l1_hz = p?.L1?.hz ?? 50.0;
  
  // L2
  const l2_v = p?.L2?.v ?? 0;
  const l2_a = p?.L2?.a ?? 0;
  const l2_hz = p?.L2?.hz ?? 50.0;

  // L3
  const l3_v = p?.L3?.v ?? 0;
  const l3_a = p?.L3?.a ?? 0;
  const l3_hz = p?.L3?.hz ?? 50.0;

  // คำนวณค่ารวม/ค่าเฉลี่ย
  const avg_v = (l1_v + l2_v + l3_v) / 3 || 0;
  const sum_a = l1_a + l2_a + l3_a || 0;
  const avg_hz = (l1_hz + l2_hz + l3_hz) / 3 || 0;
  const total_kwh = parseFloat(data?.total?.kwh) || parseFloat(data?.monthly_cost?.total_kwh) || 0;
  const total_cost = parseFloat(data?.monthly_cost?.total_cost) || 0;

  return (
    <div className="grid grid-cols-5 gap-3 shrink-0 select-none">
      
      {/* ─── CARD 1: VOLTAGE (Blue Theme) ─── */}
      <div style={{ padding: '16px' }} className="rounded-xl border border-blue-500/15 bg-blue-500/[0.02] flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-bold text-white/40 tracking-wider">VOLTAGE</span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">V</span>
        </div>
        <div className="flex items-baseline gap-1 mt-2.5 z-10">
          <span className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.05)]">
            {fmt1(avg_v)}
          </span>
          <span className="text-xs font-bold text-white/30">V</span>
        </div>
        {/* Phase Breakdown */}
        <div className="flex flex-col gap-1 mt-3.5 pt-3 border-t border-white/[0.04] text-[10px] text-white/50 font-mono z-10">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> L1</span>
            <span className="text-white/80">{fmt1(l1_v)} V</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> L2</span>
            <span className="text-white/80">{fmt1(l2_v)} V</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> L3</span>
            <span className="text-white/80">{fmt1(l3_v)} V</span>
          </div>
        </div>
      </div>

      {/* ─── CARD 2: CURRENT (Green Theme) ─── */}
      <div style={{ padding: '16px' }} className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.02] flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-bold text-white/40 tracking-wider">CURRENT</span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">A</span>
        </div>
        <div className="flex items-baseline gap-1 mt-2.5 z-10">
          <span className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.05)]">
            {fmt2(sum_a)}
          </span>
          <span className="text-xs font-bold text-white/30">A</span>
        </div>
        {/* Phase Breakdown */}
        <div className="flex flex-col gap-1 mt-3.5 pt-3 border-t border-white/[0.04] text-[10px] text-white/50 font-mono z-10">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> L1</span>
            <span className="text-white/80">{fmt2(p?.L1?.a ?? 0)} A</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> L2</span>
            <span className="text-white/80">{fmt2(p?.L2?.a ?? 0)} A</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> L3</span>
            <span className="text-white/80">{fmt2(p?.L3?.a ?? 0)} A</span>
          </div>
        </div>
      </div>

      {/* ─── CARD 3: FREQUENCY (Orange Theme) ─── */}
      <div style={{ padding: '16px' }} className="rounded-xl border border-orange-500/15 bg-orange-500/[0.02] flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-bold text-white/40 tracking-wider">FREQUENCY</span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">Hz</span>
        </div>
        <div className="flex items-baseline gap-1 mt-2.5 z-10">
          <span className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.05)]">
            {fmt2(avg_hz)}
          </span>
          <span className="text-xs font-bold text-white/30">Hz</span>
        </div>
        {/* Styled Waveform & Static Text */}
        <div className="flex flex-col items-center mt-3 pt-2 border-t border-white/[0.04] z-10">
          {/* Sine wave SVG */}
          <svg className="w-full h-5 text-orange-400/70" viewBox="0 0 160 20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M 0 10 Q 20 0 40 10 T 80 10 T 120 10 T 160 10" strokeLinecap="round" />
          </svg>
          <span className="text-[9.5px] text-white/40 font-bold tracking-wide mt-1.5 uppercase">
            ความถี่มาตรฐาน 50 Hz
          </span>
        </div>
      </div>

      {/* ─── CARD 4: TOTAL ENERGY (Purple Theme) ─── */}
      <div style={{ padding: '16px' }} className="rounded-xl border border-purple-500/15 bg-purple-500/[0.02] flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-bold text-white/40 tracking-wider">TOTAL ENERGY</span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">kWh</span>
        </div>
        <div className="flex items-baseline gap-1 mt-2.5 z-10">
          <span className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.05)]">
            {total_kwh.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-white/30">kWh</span>
        </div>
        {/* Purple Circle icon & Text */}
        <div className="flex flex-col items-center mt-2.5 pt-1.5 border-t border-white/[0.04] z-10">
          <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-[9.5px] text-white/40 font-bold tracking-wide mt-2.5 uppercase">
            พลังงานไฟฟ้าสะสม
          </span>
        </div>
      </div>

      {/* ─── CARD 5: ENERGY COST (Red Theme) ─── */}
      <div style={{ padding: '16px' }} className="rounded-xl border border-red-500/15 bg-red-500/[0.02] flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-bold text-white/40 tracking-wider">ENERGY COST</span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400">฿</span>
        </div>
        <div className="flex items-baseline gap-1 mt-2.5 z-10">
          <span className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.05)]">
            {total_cost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs font-bold text-white/30">บาท</span>
        </div>
        {/* Red Circle coin icon & Text */}
        <div className="flex flex-col items-center mt-2.5 pt-1.5 border-t border-white/[0.04] z-10">
          <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[9.5px] text-white/40 font-bold tracking-wide mt-2.5 uppercase">
            ค่าไฟฟ้ารวม (บาท)
          </span>
        </div>
      </div>

    </div>
  );
}
