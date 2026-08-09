'use client';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0c1322]/90 border border-white/[0.08] rounded-xl p-3 shadow-2xl
                    text-xs backdrop-blur-md">
      <p className="text-white/40 font-bold mb-1.5 font-mono">เวลา {label}</p>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />
        <span className="text-white/60">kWh สะสม:</span>
        <span className="text-[#0ea5e9] font-black font-mono text-[13px] tabular-nums">
          {payload[0].value?.toFixed(2)} kWh
        </span>
      </div>
    </div>
  );
}

export default function RealtimeChartInner({ chartPoints }) {
  const isEmpty = !chartPoints || chartPoints.length === 0;

  if (isEmpty) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-400
                        rounded-full animate-spin" />
        <p className="text-white/20 text-xs tracking-wider">
          รอข้อมูลสัญญาณกราฟ...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {/* Title inside chart card */}
      <div className="flex justify-between items-center mb-1 shrink-0">
        <h3 className="text-sm font-bold text-white tracking-wide text-left">
          กราฟการใช้พลังงานไฟฟ้า (kWh)
        </h3>
        <span className="text-[10px] text-white/30 font-bold font-mono">kWh</span>
      </div>

      {/* Recharts LineChart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartPoints}
            margin={{ top: 12, right: 12, left: -22, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(255,255,255,0.03)"
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              interval={Math.max(0, Math.floor(chartPoints.length / 6) - 1)}
            />

            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toFixed(0)}
              width={40}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="bottom"
              height={24}
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: 11, paddingTop: 4 }}
              formatter={(value) => (
                <span className="text-white/60 font-medium ml-1">
                  {value}
                </span>
              )}
            />

            {/* Line representing accumulated kWh */}
            <Line
              type="monotone"
              dataKey="kwh"
              name="kWh สะสม"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#0ea5e9', strokeWidth: 0 }}
              activeDot={{ r: 4.5, fill: '#0ea5e9', strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
