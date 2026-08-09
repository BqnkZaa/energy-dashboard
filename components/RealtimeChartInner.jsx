'use client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(7,13,26,0.96)',
      border: '1px solid rgba(34,211,238,0.2)',
      borderRadius: '12px',
      padding: '10px 14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(12px)',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontFamily: 'monospace', marginBottom: '6px' }}>
        ⏱ {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }} />
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px' }}>พลังงานสะสม:</span>
        <span style={{ color: '#22d3ee', fontWeight: 900, fontSize: '14px', fontFamily: 'monospace' }}>
          {payload[0].value?.toFixed(3)} kWh
        </span>
      </div>
    </div>
  );
}

export default function RealtimeChartInner({ chartPoints }) {
  if (!chartPoints || chartPoints.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '2px solid rgba(34,211,238,0.15)',
          borderTopColor: '#22d3ee',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', letterSpacing: '0.15em' }}>
          รอข้อมูลจากเซ็นเซอร์...
        </p>
      </div>
    );
  }

  const interval = Math.max(0, Math.floor((chartPoints.length - 1) / 5));

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '16px', borderRadius: '2px', background: 'linear-gradient(180deg,#22d3ee,#3b82f6)' }} />
          <h3 style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.03em' }}>
            กราฟการใช้พลังงานไฟฟ้า
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', boxShadow: '0 0 8px #22d3ee', display: 'inline-block' }} />
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#22d3ee', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Live
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartPoints} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="kwhGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#22d3ee" stopOpacity={0.25} />
                <stop offset="85%" stopColor="#22d3ee" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal vertical={false} />

            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 9.5, fontFamily: 'JetBrains Mono, monospace' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              interval={interval}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.22)', fontSize: 9.5, fontFamily: 'JetBrains Mono, monospace' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toFixed(1)}
              width={38}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'rgba(34,211,238,0.15)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />

            <Area
              type="monotone"
              dataKey="kwh"
              name="kWh สะสม"
              stroke="#22d3ee"
              strokeWidth={2.5}
              fill="url(#kwhGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#22d3ee', stroke: 'rgba(34,211,238,0.3)', strokeWidth: 6 }}
              isAnimationActive={false}
              style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.4))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
