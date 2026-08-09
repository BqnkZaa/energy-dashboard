'use client';
import { fmt2, fmt1, fmtPF } from '@/utils/formatters';

/**
 * PhaseCard Component
 * แสดงสถานะและค่าไฟฟ้าของแต่ละเฟส (L1 / L2 / L3)
 * ปรับปรุง layout เป็นแบบแถวตั้ง มี Circular Gauge และกริดข้อมูลที่กระชับประหยัดพื้นที่
 */
const PHASE_CONFIG = {
  L1: {
    label: 'Phase L1',
    subLabel: 'เฟส 1 (R)',
    color: '#f59e0b',
    border: 'border-amber-500/15 hover:border-amber-500/35',
    bg: 'from-amber-500/[0.04] to-amber-600/[0.005]',
    glow: 'shadow-amber-500/[0.02] hover:shadow-amber-500/[0.08]',
    dot: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
    text: 'text-amber-400',
  },
  L2: {
    label: 'Phase L2',
    subLabel: 'เฟส 2 (S)',
    color: '#06b6d4',
    border: 'border-cyan-500/15 hover:border-cyan-500/35',
    bg: 'from-cyan-500/[0.04] to-cyan-600/[0.005]',
    glow: 'shadow-cyan-500/[0.02] hover:shadow-cyan-500/[0.08]',
    dot: 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]',
    text: 'text-cyan-400',
  },
  L3: {
    label: 'Phase L3',
    subLabel: 'เฟส 3 (T)',
    color: '#10b981',
    border: 'border-emerald-500/15 hover:border-emerald-500/35',
    bg: 'from-emerald-500/[0.04] to-emerald-600/[0.005]',
    glow: 'shadow-emerald-500/[0.02] hover:shadow-emerald-500/[0.08]',
    dot: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
    text: 'text-emerald-400',
  },
};

function MiniBar({ value, max, color }) {
  const pct = Math.min(100, (parseFloat(value) / max) * 100) || 0;
  return (
    <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden mt-1">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function PhaseCard({ phase, phaseData }) {
  const cfg = PHASE_CONFIG[phase] || PHASE_CONFIG.L1;
  const isValid = phaseData?.valid !== false;

  const v   = phaseData?.v   ?? null;
  const a   = phaseData?.a   ?? null;
  const w   = phaseData?.w   ?? null;
  const pf  = phaseData?.pf  ?? null;
  const hz  = phaseData?.hz  ?? null;
  const kwh = phaseData?.kwh ?? null;

  // จัดการระดับสีเตือนของ Power Factor (PF)
  // PF >= 0.90 (ดีมาก - เขียว), 0.70 - 0.89 (ปานกลาง - เหลือง), < 0.70 (ต้องปรับปรุง - แดง)
  let pfColor = 'text-white/80';
  if (pf != null) {
    const pfNum = parseFloat(pf);
    if (pfNum >= 0.9) pfColor = 'text-emerald-400 font-bold';
    else if (pfNum >= 0.7) pfColor = 'text-amber-400 font-bold';
    else pfColor = 'text-red-400 font-bold animate-pulse';
  }

  return (
    <div
      style={{ padding: '20px' }}
      className={`relative rounded-xl border ${cfg.border}
                  bg-gradient-to-br ${cfg.bg}
                  shadow-md ${cfg.glow}
                  flex flex-col gap-4 overflow-hidden shrink-0
                  transition-all duration-300 ease-out
                  ${ !isValid ? 'opacity-40 select-none' : '' }`}
    >
      {/* Background radial highlight */}
      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full
                      bg-white/[0.01] blur-xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}
                           ${ isValid ? 'animate-pulse' : '' }`} />
          <span className="text-[13.5px] font-black text-white/90 tracking-wide">
            {cfg.label} <span className="text-[11px] text-white/40 font-medium ml-1.5">{cfg.subLabel}</span>
          </span>
        </div>
        { !isValid && (
          <span className="text-[8px] font-black text-red-400 bg-red-500/10
                           border border-red-500/20 px-2 py-0.5 rounded-full tracking-widest">
            ERROR
          </span>
        )}
      </div>

      {/* Main Row: Circular Gauge & Metrics */}
      <div className="flex items-center gap-5 z-10">
        {/* Left Side: Circular SVG Voltage Gauge */}
        <div className="relative w-[68px] h-[68px] flex items-center justify-center shrink-0">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 44 44">
            {/* Background track */}
            <circle
              cx="22"
              cy="22"
              r="18"
              className="stroke-white/[0.04]"
              strokeWidth="3.5"
              fill="none"
            />
            {/* Active voltage track (scaled up to 260V max) */}
            <circle
              cx="22"
              cy="22"
              r="18"
              stroke={cfg.color}
              strokeWidth="3.5"
              fill="none"
              strokeDasharray={113.1}
              strokeDashoffset={113.1 - (113.1 * Math.min(260, Math.max(0, v || 0)) / 260)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 4px ${cfg.color}40)` }}
            />
          </svg>
          {/* Inner value */}
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[12px] font-black tracking-tight tabular-nums leading-none" style={{ color: cfg.color }}>
              {v != null ? parseFloat(v).toFixed(1) : '—'}
            </span>
            <span className="text-[7.5px] font-extrabold text-white/30 uppercase tracking-widest mt-1">Volt</span>
          </div>
        </div>

        {/* Right Side: Metrics Grid */}
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 min-w-0">
          
          {/* Current (A) */}
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider leading-none">
              กระแส (Current)
            </span>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-[14.5px] font-black tabular-nums text-white/90 leading-none">
                {a != null ? parseFloat(a).toFixed(2) : '—'}
              </span>
              <span className="text-[10px] font-bold text-white/30">A</span>
            </div>
            {/* Mini Progress Bar for Current (relative to 30A nominal max) */}
            <MiniBar value={a} max={30} color={cfg.color} />
          </div>

          {/* Active Power (kW) */}
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider leading-none">
              กำลังไฟ (Power)
            </span>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-[14.5px] font-black tabular-nums text-white/90 leading-none">
                {w != null ? (parseFloat(w) / 1000).toFixed(3) : '—'}
              </span>
              <span className="text-[10px] font-bold text-white/30">kW</span>
            </div>
          </div>

          {/* Power Factor (PF) */}
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider leading-none">
              Power Factor
            </span>
            <span className={`text-[14.5px] font-black tabular-nums mt-1 leading-none ${pfColor}`}>
              {fmtPF(pf)}
            </span>
          </div>

          {/* Frequency (Hz) */}
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider leading-none">
              ความถี่ (Freq)
            </span>
            <div className="flex items-baseline gap-0.5 mt-1">
              <span className="text-[14.5px] font-black tabular-nums text-white/90 leading-none">
                {hz != null ? parseFloat(hz).toFixed(1) : '—'}
              </span>
              <span className="text-[10px] font-bold text-white/30">Hz</span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer: Cumulative Energy (kWh) */}
      <div className="border-t border-white/[0.04] pt-2.5 flex justify-between items-center z-10">
        <span className="text-[9.5px] text-white/40 uppercase tracking-widest font-bold">
          พลังงานสะสมสุทธิ
        </span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-[13.5px] font-black tabular-nums" style={{ color: cfg.color }}>
            {kwh != null ? parseFloat(kwh).toFixed(3) : '—'}
          </span>
          <span className="text-[10px] font-bold text-white/30">kWh</span>
        </div>
      </div>
    </div>
  );
}
