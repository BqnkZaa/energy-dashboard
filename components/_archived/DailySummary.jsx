'use client';
import { fmtBaht, fmtKwh, fmt2 } from '@/utils/formatters';

/**
 * DailySummary Component
 * แสดงสรุปค่าไฟฟ้าและหน่วยพลังงานที่ใช้ไปแยกตามช่วงเวลา (Peak/Off-Peak)
 * พร้อมแสดงสัดส่วนการใช้งาน (TOU Split Bar)
 */
export default function DailySummary({ tou, monthlyCost, lastUpdated }) {
  const peak = monthlyCost?.peak_cost ?? 0;
  const offpeak = monthlyCost?.off_peak_cost ?? 0;
  const peakKwh = monthlyCost?.peak_kwh ?? 0;
  const offKwh = monthlyCost?.off_peak_kwh ?? 0;
  const totalKwh = monthlyCost?.total_kwh ?? 0;
  const svc = monthlyCost?.service_charge ?? 312.24;
  const total = monthlyCost?.total_cost ?? 0;

  const lastUpdateStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('th-TH', { hour12: false })
    : '—';

  // คำนวณสัดส่วนการใช้ไฟฟ้า Peak vs Off-Peak
  const sumKwh = (parseFloat(peakKwh) || 0) + (parseFloat(offKwh) || 0);
  const peakPct = sumKwh > 0 ? ((parseFloat(peakKwh) || 0) / sumKwh) * 100 : 0;
  const offPct = sumKwh > 0 ? ((parseFloat(offKwh) || 0) / sumKwh) * 100 : 0;

  const CELLS = [
    {
      label: 'การใช้ไฟช่วง Peak',
      kwh: peakKwh,
      cost: peak,
      color: 'text-orange-400',
      border: 'border-orange-500/20 hover:border-orange-500/35',
      bg: 'bg-orange-500/[0.02]',
      glowClass: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.2)]',
    },
    {
      label: 'การใช้ไฟช่วง Off-Peak',
      kwh: offKwh,
      cost: offpeak,
      color: 'text-indigo-400',
      border: 'border-indigo-500/20 hover:border-indigo-500/35',
      bg: 'bg-indigo-500/[0.02]',
      glowClass: 'drop-shadow-[0_0_8px_rgba(129,140,248,0.2)]',
    },
    {
      label: 'ค่าบริการคงที่รายเดือน',
      kwh: null,
      cost: svc,
      color: 'text-white/60',
      border: 'border-white/10 hover:border-white/20',
      bg: 'bg-white/[0.01]',
      glowClass: '',
    },
    {
      label: 'รวมค่าไฟฟ้าทั้งสิ้น (เดือนนี้)',
      kwh: totalKwh,
      cost: total,
      color: 'text-amber-400',
      border: 'border-amber-500/30 hover:border-amber-500/50',
      bg: 'bg-amber-500/[0.02]',
      bold: true,
      glowClass: 'drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]',
    },
  ];

  return (
    <div className="shrink-0 flex flex-col gap-2.5">
      
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">
          ▎ สรุปหน่วยพลังงานและค่าไฟฟ้าสะสม
        </span>
        <span className="text-[9.5px] text-white/20 font-mono tracking-wider">
          อัปเดตล่าสุดจากเซนเซอร์: {lastUpdateStr}
        </span>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-4 gap-3">
        {CELLS.map((cell) => (
          <div
            key={cell.label}
            style={{ padding: '20px' }}
            className={`rounded-xl border ${cell.border} ${cell.bg}
                        flex flex-col gap-2 transition-all duration-300`}
          >
            <div className="text-[10.5px] font-bold text-white/40 uppercase tracking-wider truncate">
              {cell.label}
            </div>

            <div className={`text-2xl font-black tabular-nums ${
              cell.bold ? 'text-[26px]' : ''
            } ${cell.color} ${cell.glowClass} leading-tight`}>
              {fmtBaht(cell.cost)}
              <span className="text-[11px] font-bold text-white/40 ml-1.5">บาท</span>
            </div>

            {cell.kwh != null ? (
              <div className="text-[11.5px] text-white/40 font-semibold font-mono tracking-wider">
                {parseFloat(cell.kwh).toFixed(3)} <span className="text-white/20 text-[9.5px]">kWh</span>
              </div>
            ) : (
              <div className="text-[11.5px] text-white/10 font-mono tracking-wider">—</div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Info Bar: TOU Rate & Split Bar */}
      <div className="flex justify-between items-center gap-6 px-1 mt-0.5">
        
        {/* Left Side: TOU Rate Display */}
        {tou && (
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[9px] text-white/30 font-bold tracking-widest uppercase">
              อัตราค่าไฟปัจจุบัน:
            </span>
            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border transition-all duration-300 ${
              tou.period === 'peak'
                ? 'text-orange-400 border-orange-500/20 bg-orange-500/5'
                : 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5'
            }`}>
              {tou.period === 'peak' ? '⚡ PEAK' : '🌙 OFF-PEAK'} — {tou.rate?.toFixed(4)} <span className="text-[8px] font-bold opacity-60">บ./kWh</span>
            </span>
            {tou.kwhDelta > 0 && (
              <span className="text-[9.5px] text-white/30 font-medium font-mono">
                +{tou.kwhDelta?.toFixed(5)} kWh ({fmtBaht(tou.costDelta)} บาท) รอบนี้
              </span>
            )}
          </div>
        )}

        {/* Right Side: TOU Usage Ratio Split Bar */}
        {sumKwh > 0 && (
          <div className="flex-1 max-w-[420px] flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] px-3.5 py-1.5 rounded-full text-[10px]">
            <span className="text-white/30 font-bold tracking-wider shrink-0">สัดส่วนหน่วยไฟ:</span>
            
            {/* Horizontal Split Bar */}
            <div className="flex-1 h-2 rounded-full overflow-hidden flex bg-white/[0.05]">
              <div 
                className="h-full bg-orange-500 transition-all duration-1000 ease-out" 
                style={{ width: `${peakPct}%` }} 
                title={`Peak: ${peakPct.toFixed(1)}%`}
              />
              <div 
                className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
                style={{ width: `${offPct}%` }} 
                title={`Off-Peak: ${offPct.toFixed(1)}%`}
              />
            </div>

            {/* Percentage Text */}
            <div className="font-mono font-bold flex gap-2.5 shrink-0 tracking-wide">
              <span className="text-orange-400">Peak: {peakPct.toFixed(0)}%</span>
              <span className="text-indigo-400">Off-Peak: {offPct.toFixed(0)}%</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
