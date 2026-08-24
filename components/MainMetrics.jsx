'use client';
import { fmt1, fmt2 } from '@/utils/formatters';

function MiniBar({ value, max, color }) {
  const pct = Math.min(100, Math.max(0, (parseFloat(value) / max) * 100)) || 0;
  return (
    <div className="mini-bar-track">
      <div className="mini-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function PhaseRow({ label, value, unit, color, max }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
        <span className="text-[9.5px] font-bold" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</span>
      </div>
      <div className="flex-1"><MiniBar value={value} max={max || 260} color={color} /></div>
      <span className="text-[10px] font-mono font-bold tabular shrink-0" style={{ color: 'rgba(255,255,255,0.72)' }}>
        {value != null ? parseFloat(value).toFixed(unit === 'A' ? 2 : 1) : '—'}
      </span>
    </div>
  );
}

export default function MainMetrics({ data }) {
  const p = data?.phases;
  const l1_v = p?.L1?.v ?? 0, l2_v = p?.L2?.v ?? 0, l3_v = p?.L3?.v ?? 0;
  const l1_a = p?.L1?.a ?? 0, l2_a = p?.L2?.a ?? 0, l3_a = p?.L3?.a ?? 0;
  const l1_hz = p?.L1?.hz ?? 50.0, l2_hz = p?.L2?.hz ?? 50.0, l3_hz = p?.L3?.hz ?? 50.0;
  const avg_v = (l1_v + l2_v + l3_v) / 3 || 0;
  const sum_a = l1_a + l2_a + l3_a || 0;
  const avg_hz = (l1_hz + l2_hz + l3_hz) / 3 || 0;
  const total_kwh = parseFloat(data?.total?.kwh) || parseFloat(data?.monthly_cost?.total_kwh) || 0;
  // ยอดบน Dashboard แสดงเฉพาะค่าพลังงาน + ค่า Demand
  // Ft, ค่าบริการ และ VAT คำนวณใน Google Sheets เท่านั้น
  const dashboard_cost = parseFloat(data?.monthly_cost?.dashboard_cost) || 0;

  const phaseColors = { L1: '#f87171', L2: '#fbbf24', L3: '#22d3ee' };

  return (
    <div className="grid grid-cols-5 gap-3 shrink-0 select-none">

      {/* VOLTAGE */}
      <div className="metric-card card-volt">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Voltage</span>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-md border" style={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.08)' }}>V</span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-[32px] font-black tabular leading-none glow-blue" style={{ color: '#eff6ff' }}>{fmt1(avg_v)}</span>
          <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>V</span>
        </div>
        <div className="flex flex-col gap-1.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <PhaseRow label="L1" value={l1_v} unit="V" color={phaseColors.L1} max={260} />
          <PhaseRow label="L2" value={l2_v} unit="V" color={phaseColors.L2} max={260} />
          <PhaseRow label="L3" value={l3_v} unit="V" color={phaseColors.L3} max={260} />
        </div>
      </div>

      {/* CURRENT */}
      <div className="metric-card card-amp">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Current</span>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-md border" style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.08)' }}>A</span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-[32px] font-black tabular leading-none glow-emerald" style={{ color: '#ecfdf5' }}>{fmt2(sum_a)}</span>
          <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>A</span>
        </div>
        <div className="flex flex-col gap-1.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <PhaseRow label="L1" value={l1_a} unit="A" color={phaseColors.L1} max={30} />
          <PhaseRow label="L2" value={l2_a} unit="A" color={phaseColors.L2} max={30} />
          <PhaseRow label="L3" value={l3_a} unit="A" color={phaseColors.L3} max={30} />
        </div>
      </div>

      {/* FREQUENCY */}
      <div className="metric-card card-hz">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Frequency</span>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-md border" style={{ color: '#f97316', borderColor: 'rgba(249,115,22,0.25)', background: 'rgba(249,115,22,0.08)' }}>Hz</span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-[32px] font-black tabular leading-none glow-orange" style={{ color: '#fff7ed' }}>{fmt2(avg_hz)}</span>
          <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>Hz</span>
        </div>
        {/* Animated Sine Wave */}
        <div className="flex flex-col items-center justify-center pt-2.5 gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <svg viewBox="0 0 160 28" className="w-full" style={{ height: '28px' }}>
            <path className="sine-path" d="M0 14 Q20 2 40 14 T80 14 T120 14 T160 14" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M0 14 Q20 2 40 14 T80 14 T120 14 T160 14" fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="6" />
          </svg>
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>มาตรฐาน 50 Hz</span>
        </div>
      </div>

      {/* TOTAL ENERGY */}
      <div className="metric-card card-kwh">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Total Energy</span>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-md border" style={{ color: '#8b5cf6', borderColor: 'rgba(139,92,246,0.25)', background: 'rgba(139,92,246,0.08)' }}>kWh</span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-[32px] font-black tabular leading-none glow-violet" style={{ color: '#f5f3ff' }}>{total_kwh.toFixed(2)}</span>
          <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>kWh</span>
        </div>
        <div className="flex flex-col items-center pt-2.5 gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#8b5cf6" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>พลังงานสะสม</span>
        </div>
      </div>

      {/* ENERGY + DEMAND COST */}
      <div className="metric-card card-cost">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Energy + Demand</span>
          <span className="text-[9px] font-black px-2 py-0.5 rounded-md border" style={{ color: '#f43f5e', borderColor: 'rgba(244,63,94,0.25)', background: 'rgba(244,63,94,0.08)' }}>฿</span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-[30px] font-black tabular leading-none glow-rose" style={{ color: '#fff1f2' }}>
            {dashboard_cost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>บาท</span>
        </div>
        <div className="flex flex-col items-center pt-2.5 gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#f43f5e" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>ไม่รวม Ft · ค่าบริการ · VAT</span>
        </div>
      </div>

    </div>
  );
}
