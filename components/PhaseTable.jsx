'use client';
import { fmt1, fmt2, fmtPF } from '@/utils/formatters';

const PHASE_META = [
  { key: 'L1', label: 'L1 (R)', color: '#f87171', bg: 'rgba(248,113,113,0.06)' },
  { key: 'L2', label: 'L2 (S)', color: '#fbbf24', bg: 'rgba(251,191,36,0.06)'  },
  { key: 'L3', label: 'L3 (T)', color: '#22d3ee', bg: 'rgba(34,211,238,0.06)'  },
];

function PFBadge({ value }) {
  const pf = parseFloat(value) || 0;
  if (!value || value === '—') return <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>;
  let color = '#f87171';
  if (pf >= 0.9) color = '#34d399';
  else if (pf >= 0.75) color = '#fbbf24';
  return (
    <span className="font-mono font-bold" style={{ color }}>{pf.toFixed(2)}</span>
  );
}

export default function PhaseTable({ data }) {
  const p = data?.phases;

  const rows = PHASE_META.map(({ key, label, color, bg }) => ({
    label, color, bg,
    v:   p?.[key]?.v   ?? 0,
    a:   p?.[key]?.a   ?? 0,
    w:   p?.[key]?.w   ?? 0,
    kwh: p?.[key]?.kwh ?? 0,
    pf:  p?.[key]?.pf  ?? 0,
  }));

  const total_a   = rows.reduce((s, r) => s + parseFloat(r.a), 0);
  const total_w   = rows.reduce((s, r) => s + parseFloat(r.w), 0);
  const total_kwh = parseFloat(data?.total?.kwh) || rows.reduce((s, r) => s + parseFloat(r.kwh), 0);
  const avg_v     = rows.reduce((s, r) => s + parseFloat(r.v), 0) / 3;
  const avg_pf    = rows.reduce((s, r) => s + parseFloat(r.pf), 0) / 3;

  return (
    <div className="flex-1 min-h-0 rounded-2xl flex flex-col overflow-hidden"
      style={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.065)' }}>

      {/* Card Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg,#22d3ee,#3b82f6)' }} />
          <h3 className="text-[12.5px] font-bold tracking-wide" style={{ color: 'rgba(255,255,255,0.85)' }}>ค่าพลังงานแยกเฟส</h3>
        </div>
        <span className="text-[9.5px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.22)' }}>3-Phase Monitor</span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden flex flex-col justify-center px-3 pb-3">
        <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
          <thead>
            <tr>
              {['เฟส','แรงดัน (V)','กระแส (A)','กำลัง (W)','พลังงาน (kWh)','P.F.'].map((h, i) => (
                <th key={i} className={`text-[9.5px] font-bold uppercase tracking-wider py-2 px-3 ${i > 0 ? 'text-right' : 'text-left'}`}
                  style={{ color: 'rgba(255,255,255,0.3)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="phase-row" style={{ borderRadius: '10px' }}>
                {/* Phase label */}
                <td className="py-2.5 px-3 rounded-l-lg" style={{ background: row.bg }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: row.color, boxShadow: `0 0 6px ${row.color}` }} />
                    <span className="text-[11px] font-black" style={{ color: row.color, fontFamily: 'var(--font-mono)' }}>{row.label}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right" style={{ background: row.bg }}>
                  <span className="text-[11.5px] font-mono font-bold" style={{ color: 'rgba(255,255,255,0.82)' }}>{fmt1(row.v)}</span>
                </td>
                <td className="py-2.5 px-3 text-right" style={{ background: row.bg }}>
                  <span className="text-[11.5px] font-mono font-bold" style={{ color: 'rgba(255,255,255,0.82)' }}>{fmt2(row.a)}</span>
                </td>
                <td className="py-2.5 px-3 text-right" style={{ background: row.bg }}>
                  <span className="text-[11.5px] font-mono font-bold" style={{ color: 'rgba(255,255,255,0.82)' }}>{row.w != null ? Math.round(row.w).toLocaleString('th-TH') : '—'}</span>
                </td>
                <td className="py-2.5 px-3 text-right" style={{ background: row.bg }}>
                  <span className="text-[11.5px] font-mono font-bold" style={{ color: 'rgba(255,255,255,0.82)' }}>{parseFloat(row.kwh).toFixed(3)}</span>
                </td>
                <td className="py-2.5 px-3 text-right rounded-r-lg" style={{ background: row.bg }}>
                  <PFBadge value={row.pf} />
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr style={{ borderRadius: '10px' }}>
              <td className="py-3 px-3 rounded-l-xl" style={{ background: 'rgba(34,211,238,0.05)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-[11px] font-black" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>∑ รวม</span>
              </td>
              <td className="py-3 px-3 text-right" style={{ background: 'rgba(34,211,238,0.05)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-[11.5px] font-mono font-black" style={{ color: '#e0f2fe' }}>{fmt1(avg_v)}</span>
              </td>
              <td className="py-3 px-3 text-right" style={{ background: 'rgba(34,211,238,0.05)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-[11.5px] font-mono font-black" style={{ color: '#e0f2fe' }}>{fmt2(total_a)}</span>
              </td>
              <td className="py-3 px-3 text-right" style={{ background: 'rgba(34,211,238,0.05)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-[11.5px] font-mono font-black" style={{ color: '#e0f2fe' }}>{Math.round(total_w).toLocaleString('th-TH')}</span>
              </td>
              <td className="py-3 px-3 text-right" style={{ background: 'rgba(34,211,238,0.05)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-[11.5px] font-mono font-black" style={{ color: '#e0f2fe' }}>{total_kwh.toFixed(3)}</span>
              </td>
              <td className="py-3 px-3 text-right rounded-r-xl" style={{ background: 'rgba(34,211,238,0.05)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <PFBadge value={avg_pf} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
