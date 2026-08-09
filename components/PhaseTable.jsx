'use client';
import { fmt1, fmt2, fmtPF } from '@/utils/formatters';

/**
 * PhaseTable Component
 * ตารางสรุปค่าพลังงานไฟฟ้าแยกแต่ละเฟส L1 (R), L2 (S), L3 (T) และยอดรวม
 * ออกแบบตามรูปภาพตัวอย่างเป๊ะๆ
 */
export default function PhaseTable({ data }) {
  const p = data?.phases;

  // L1
  const l1_v = p?.L1?.v ?? 0;
  const l1_a = p?.L1?.a ?? 0;
  const l1_w = p?.L1?.w ?? 0;
  const l1_kwh = p?.L1?.kwh ?? 0;
  const l1_pf = p?.L1?.pf ?? 0;

  // L2
  const l2_v = p?.L2?.v ?? 0;
  const l2_a = p?.L2?.a ?? 0;
  const l2_w = p?.L2?.w ?? 0;
  const l2_kwh = p?.L2?.kwh ?? 0;
  const l2_pf = p?.L2?.pf ?? 0;

  // L3
  const l3_v = p?.L3?.v ?? 0;
  const l3_a = p?.L3?.a ?? 0;
  const l3_w = p?.L3?.w ?? 0;
  const l3_kwh = p?.L3?.kwh ?? 0;
  const l3_pf = p?.L3?.pf ?? 0;

  // รวม / เฉลี่ย
  // แรงดัน: ใช้ค่าเฉลี่ย (voltage ไม่บวกรวม — ระบบ 3 เฟสต้องการค่าเฉลี่ย)
  const avg_v   = ((parseFloat(l1_v) + parseFloat(l2_v) + parseFloat(l3_v)) / 3) || 0;
  const total_a = l1_a + l2_a + l3_a;
  const total_w = l1_w + l2_w + l3_w;
  const total_kwh = parseFloat(data?.total?.kwh) || (l1_kwh + l2_kwh + l3_kwh);
  const avg_pf = (parseFloat(l1_pf) + parseFloat(l2_pf) + parseFloat(l3_pf)) / 3 || 0;

  const rows = [
    {
      name: 'L1 (R)',
      colorClass: 'text-red-500 font-bold',
      v: l1_v,
      a: l1_a,
      w: l1_w,
      kwh: l1_kwh,
      pf: l1_pf,
    },
    {
      name: 'L2 (S)',
      colorClass: 'text-amber-500 font-bold',
      v: l2_v,
      a: l2_a,
      w: l2_w,
      kwh: l2_kwh,
      pf: l2_pf,
    },
    {
      name: 'L3 (T)',
      colorClass: 'text-cyan-400 font-bold',
      v: l3_v,
      a: l3_a,
      w: l3_w,
      kwh: l3_kwh,
      pf: l3_pf,
    },
  ];

  return (
    <div className="flex-1 rounded-2xl border border-white/[0.06] bg-[#0c1322]/40 backdrop-blur-md p-5 flex flex-col shadow-xl">
      {/* Title */}
      <h3 className="text-sm font-bold text-white mb-3 tracking-wide text-left">
        ค่าพลังงานไฟฟ้าแยกแต่ละเฟส
      </h3>

      {/* Table Area */}
      <div className="flex-1 overflow-hidden flex flex-col justify-center">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3">เฟส</th>
              <th className="py-2.5 px-3 text-right">แรงดัน (V)</th>
              <th className="py-2.5 px-3 text-right">กระแส (A)</th>
              <th className="py-2.5 px-3 text-right">กำลังไฟฟ้า (W)</th>
              <th className="py-2.5 px-3 text-right">พลังงาน (kWh)</th>
              <th className="py-2.5 px-3 text-right">เพาเวอร์แฟคเตอร์</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {rows.map((row) => (
              <tr key={row.name} className="hover:bg-white/[0.01] transition-colors">
                <td className={`py-3 px-3 font-mono ${row.colorClass}`}>{row.name}</td>
                <td className="py-3 px-3 text-right font-mono text-white/90">{fmt1(row.v)}</td>
                <td className="py-3 px-3 text-right font-mono text-white/90">{fmt2(row.a)}</td>
                <td className="py-3 px-3 text-right font-mono text-white/90">
                  {row.w != null ? Math.round(row.w).toLocaleString('th-TH') : '—'}
                </td>
                <td className="py-3 px-3 text-right font-mono text-white/90">{parseFloat(row.kwh).toFixed(2)}</td>
                <td className="py-3 px-3 text-right font-mono text-white/90">{fmtPF(row.pf)}</td>
              </tr>
            ))}
            
            {/* Total Row */}
            <tr className="bg-white/[0.02] font-bold text-white border-t border-white/10">
              <td className="py-3 px-3 font-bold">รวม</td>
              <td className="py-3 px-3 text-right font-mono text-white">{fmt1(avg_v)}</td>
              <td className="py-3 px-3 text-right font-mono text-white">{fmt2(total_a)}</td>
              <td className="py-3 px-3 text-right font-mono text-white">
                {total_w != null ? Math.round(total_w).toLocaleString('th-TH') : '—'}
              </td>
              <td className="py-3 px-3 text-right font-mono text-white">{total_kwh.toFixed(2)}</td>
              <td className="py-3 px-3 text-right font-mono text-white">{fmtPF(avg_pf)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
