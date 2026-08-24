'use client';
import dynamic from 'next/dynamic';
import { useWebSocket } from '@/hooks/useWebSocket';

const Header        = dynamic(() => import('@/components/Header'),        { ssr: false });
const MainMetrics   = dynamic(() => import('@/components/MainMetrics'),   { ssr: false });
const PhaseTable    = dynamic(() => import('@/components/PhaseTable'),    { ssr: false });
const RealtimeChart = dynamic(() => import('@/components/RealtimeChart'), { ssr: false });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false });

export default function DashboardPage() {
  const {
    data,
    status,
    lastUpdated,
    retryCount,
    billingSettings,
    reconnectWithNewUrl,
    saveBillingSettings,
  } = useWebSocket();

  const lastUpdateStr = lastUpdated
    ? lastUpdated.toLocaleTimeString('th-TH', { hour12: false })
    : '—';

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-dot-grid">

      {/* ═══ HEADER ═══ */}
      <Header connectionStatus={status} />

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 overflow-hidden flex flex-col min-h-0" style={{ padding: '14px 20px', gap: '12px' }}>

        {/* ROW 1: Metric Cards */}
        <MainMetrics data={data} />

        {/* ROW 2: Phase Table + Chart */}
        <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: '5fr 7fr' }}>

          {/* Phase Table */}
          <div className="flex flex-col min-h-0">
            <PhaseTable data={data} />
          </div>

          {/* Chart */}
          <div className="flex flex-col min-h-0 rounded-2xl p-5"
            style={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.065)' }}>
            <RealtimeChart liveData={data} />
          </div>

        </div>

      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="shrink-0 flex items-center justify-center gap-2.5 select-none"
        style={{ height: '36px', background: 'rgba(3,7,18,0.8)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-[10px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>
          อัปเดตล่าสุด {lastUpdateStr}
        </span>
        <span className="w-1.5 h-1.5 rounded-full" style={{
          background: status === 'connected' ? '#34d399' : '#f87171',
          boxShadow: status === 'connected' ? '0 0 8px #34d399' : '0 0 8px #f87171',
        }} />
        {status !== 'connected' && retryCount > 0 && (
          <span className="font-mono text-[10px] animate-pulse" style={{ color: 'rgba(248,113,113,0.7)' }}>
            reconnecting #{retryCount}…
          </span>
        )}
      </footer>

      {/* ⚙️ Settings Panel */}
      <SettingsPanel
        onUrlChanged={reconnectWithNewUrl}
        billingSettings={billingSettings}
        onBillingSettingsSave={saveBillingSettings}
      />

    </div>
  );
}
