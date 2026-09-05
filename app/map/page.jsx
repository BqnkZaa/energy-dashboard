'use client';

import dynamic from 'next/dynamic';
import { useWebSocket } from '@/hooks/useWebSocket';
import { authenticateAdmin } from '@/utils/adminAuth';

const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const MapPanel = dynamic(() => import('@/components/MapPanel'), { ssr: false });
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel'), { ssr: false });

export default function MapPage() {
  const {
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
      <Header connectionStatus={status} activePage="map" />

      <main className="flex-1 min-h-0 flex flex-col" style={{ padding: '14px 20px' }}>
        <MapPanel billingSettings={billingSettings} connectionStatus={status} />
      </main>

      <footer className="shrink-0 flex items-center justify-center gap-2.5 select-none" style={{ height: '36px', background: 'rgba(3,7,18,0.8)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-[10px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.25)' }}>อัปเดตล่าสุด {lastUpdateStr}</span>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: status === 'connected' ? '#34d399' : '#f87171', boxShadow: status === 'connected' ? '0 0 8px #34d399' : '0 0 8px #f87171' }} />
        {status !== 'connected' && retryCount > 0 && (
          <span className="font-mono text-[10px] animate-pulse" style={{ color: 'rgba(248,113,113,0.7)' }}>reconnecting #{retryCount}…</span>
        )}
      </footer>

      <SettingsPanel
        onUrlChanged={reconnectWithNewUrl}
        billingSettings={billingSettings}
        onBillingSettingsSave={saveBillingSettings}
        onAdminAuthenticate={authenticateAdmin}
      />
    </div>
  );
}
