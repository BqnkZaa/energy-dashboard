'use client';
import dynamic from 'next/dynamic';
import { useWebSocket } from '@/hooks/useWebSocket';

// โหลด Components (ทุกตัวเป็น Client-side เลี่ยงปัญหากับ SSR Recharts/Clock)
const Header        = dynamic(() => import('@/components/Header'),        { ssr: false });
const MainMetrics   = dynamic(() => import('@/components/MainMetrics'),   { ssr: false });
const PhaseTable    = dynamic(() => import('@/components/PhaseTable'),    { ssr: false });
const RealtimeChart = dynamic(() => import('@/components/RealtimeChart'), { ssr: false });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false });

/**
 * Dashboard Page — Full-Screen TV Layout (RMUTL Lampang Mockup Match)
 * 
 * ┌──────────────────────────────────────────────────────────────┐
 * │  HEADER: Faculty Crest Logo | Real-Time Titles | Clock & Wifi│
 * ├──────────────────────────────────────────────────────────────┤
 * │  MAIN METRICS (5 Cards): V | A | Hz | kWh | Energy Cost     │
 * ├──────────────────────────────────────────────────────────────┤
 * │  [ Phase table (5 cols) ]   │   [ Cumulative kWh Chart ]    │
 * ├──────────────────────────────────────────────────────────────┤
 * │  FOOTER: อัปเดตล่าสุด: HH:MM:SS ●                             │
 * └──────────────────────────────────────────────────────────────┘
 */
export default function DashboardPage() {
  const { data, status, lastUpdated, retryCount, reconnectWithNewUrl } = useWebSocket();

  const lastUpdateStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('th-TH', { hour12: false })
    : '—';

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#01040a] bg-grid-pattern">

      {/* ═══ HEADER ═══ */}
      <Header connectionStatus={status} />

      {/* ═══ CONTENT AREA ═══ */}
      <main style={{ padding: '16px 24px' }} className="flex-1 overflow-hidden flex flex-col gap-4 min-h-0">

        {/* ─── ROW 1: Main Metrics (5 Cards) ─── */}
        <MainMetrics data={data} />

        {/* ─── ROW 2: Phase Table + Cumulative Energy Chart ─── */}
        <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
          
          {/* Left Column: Phase Data Table */}
          <div className="col-span-5 flex flex-col min-h-0">
            <PhaseTable data={data} />
          </div>

          {/* Right Column: Chart Panel */}
          <div className="col-span-7 flex flex-col min-h-0">
            <div style={{ padding: '24px' }} className="flex-1 rounded-2xl border border-white/[0.06] bg-[#0c1322]/40 backdrop-blur-md flex flex-col shadow-xl">
              <RealtimeChart liveData={data} />
            </div>
          </div>

        </div>

      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="h-10 shrink-0 border-t border-white/[0.04] bg-[#02050c]/60 flex items-center justify-center gap-2 select-none">
        <span className="text-[10.5px] text-white/30 font-bold tracking-wider">
          อัปเดตล่าสุด {lastUpdateStr}
        </span>
        <span className={`w-2 h-2 rounded-full ${
          status === 'connected'
            ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse'
            : 'bg-red-500 shadow-[0_0_8px_#f87171]'
        }`} />
        {status !== 'connected' && retryCount > 0 && (
          <span className="text-[10px] text-red-400/70 font-mono animate-pulse">
            reconnecting #{retryCount}…
          </span>
        )}
      </footer>

      {/* ═══ SETTINGS PANEL (Floating Gear ⚙️ + PIN Modal) ═══ */}
      <SettingsPanel onUrlChanged={reconnectWithNewUrl} />

    </div>
  );
}

