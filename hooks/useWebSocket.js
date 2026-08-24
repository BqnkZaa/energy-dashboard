'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

// ══════════════════════════════════════════════════════════════
//  WebSocket URL Resolution
//  ลำดับความสำคัญ:
//    1. window.__WS_URL__       (runtime override — Kiosk Mode)
//    2. localStorage            (ตั้งค่าจาก SettingsPanel บนหน้าเว็บ)
//    3. NEXT_PUBLIC_WS_URL      (.env.local / Vercel Environment)
//    4. Auto-detect fallback    (ws://192.168.1.100:8000/ws)
//
//  Auto-upgrade: ws:// → wss:// เมื่อหน้าโหลดผ่าน HTTPS
//  (ป้องกัน Mixed Content เมื่อ Deploy บน Vercel/Cloud)
// ══════════════════════════════════════════════════════════════
const LS_KEY_URL = 'energy_ws_url';
function resolveWsUrl() {
  if (typeof window === 'undefined') return null; // SSR — skip

  // Priority 1: Runtime override (Kiosk)
  if (window.__WS_URL__) return window.__WS_URL__;

  // Priority 2: localStorage (ตั้งค่าจาก SettingsPanel)
  try {
    const stored = localStorage.getItem(LS_KEY_URL);
    if (stored && stored.trim()) {
      const url = autoUpgradeWss(stored.trim());
      console.log(`[WS] 📦 Using localStorage URL: ${url}`);
      return url;
    }
  } catch (_) { /* localStorage unavailable */ }

  // Priority 3: Environment Variable
  const envUrl = process.env.NEXT_PUBLIC_WS_URL;
  if (envUrl) return autoUpgradeWss(envUrl);

  // Priority 4: Fallback
  return 'ws://192.168.1.100:8000/ws';
}

// Auto-upgrade ws:// → wss:// เมื่ออยู่ใน HTTPS
function autoUpgradeWss(url) {
  if (typeof window === 'undefined') return url;
  const isHttps = window.location.protocol === 'https:';
  if (isHttps && url.startsWith('ws://')) {
    const upgraded = url.replace(/^ws:\/\//, 'wss://');
    console.warn(`[WS] ⚠️  Auto-upgraded: ${url} → ${upgraded}`);
    return upgraded;
  }
  return url;
}

// ══════════════════════════════════════════════════════════════
//  Exponential Backoff
//  1s → 2s → 4s → 8s → 16s → 30s (capped) ± 20% jitter
// ══════════════════════════════════════════════════════════════
const BACKOFF_BASE_MS = 1_000;
const BACKOFF_MAX_MS  = 30_000;
const BACKOFF_JITTER  = 0.2;

function calcBackoff(attempt) {
  const base   = Math.min(BACKOFF_BASE_MS * 2 ** attempt, BACKOFF_MAX_MS);
  const jitter = base * BACKOFF_JITTER * (Math.random() * 2 - 1);
  return Math.round(base + jitter);
}

// ══════════════════════════════════════════════════════════════
//  useWebSocket Hook
// ══════════════════════════════════════════════════════════════
/**
 * Custom Hook: useWebSocket
 *
 * Features:
 *  ✅ WSS auto-upgrade เมื่ออยู่ใน HTTPS (Vercel / Cloud)
 *  ✅ Exponential backoff: 1s → 2s → 4s → ... → 30s
 *  ✅ ±20% jitter ป้องกัน thundering herd
 *  ✅ Page Visibility reconnect (กลับมาจาก background tab)
 *  ✅ SSR-safe (ไม่ access window ฝั่ง server)
 *
 * @returns {{ data, status, lastUpdated, retryCount, reconnectWithNewUrl }}
 */
export function useWebSocket() {
  const [data,        setData]        = useState(null);
  const [status,      setStatus]      = useState('connecting');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [retryCount,  setRetryCount]  = useState(0);
  const [billingSettings, setBillingSettings] = useState(null);

  const wsRef          = useRef(null);
  const reconnectTimer = useRef(null);
  const mountedRef     = useRef(true);
  const attemptRef     = useRef(0);
  const wsUrlRef       = useRef(null);  // resolved lazily on first connect
  const connectRef     = useRef(null);   // ref to connect fn — avoids circular dep
  const billingSaveRef = useRef(null);

  // ── Connect function ──────────────────────────────────────
  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    // Resolve URL once (needs window to be ready)
    if (!wsUrlRef.current) {
      wsUrlRef.current = resolveWsUrl();
      if (!wsUrlRef.current) return; // still SSR
      console.log(`[WS] 🔗 Connecting to: ${wsUrlRef.current}`);
    }

    try {
      setStatus('connecting');
      const ws = new WebSocket(wsUrlRef.current);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        attemptRef.current = 0;
        setRetryCount(0);
        setStatus('connected');
        ws.send(JSON.stringify({ type: 'get_billing_settings' }));
        console.log('[WS] ✅ Connected');
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'energy_update' && msg.data) {
            setData(msg.data);
            setLastUpdated(new Date());
          }
          if (msg.type === 'billing_settings' && msg.data) {
            setBillingSettings(msg.data);
            if (billingSaveRef.current) {
              clearTimeout(billingSaveRef.current.timer);
              billingSaveRef.current.resolve(msg.data);
              billingSaveRef.current = null;
            }
          }
          if (msg.type === 'error' && billingSaveRef.current) {
            clearTimeout(billingSaveRef.current.timer);
            billingSaveRef.current.reject(new Error(msg.message || 'บันทึกการตั้งค่าไม่สำเร็จ'));
            billingSaveRef.current = null;
          }
          // msg.type === 'connected' (Welcome) — no action needed
        } catch (e) {
          console.error('[WS] Parse Error:', e);
        }
      };

      ws.onclose = (e) => {
        if (!mountedRef.current) return;
        setStatus('disconnected');

        const delay = calcBackoff(attemptRef.current);
        console.warn(
          `[WS] 💤 Disconnected (code=${e.code}) — ` +
          `retry #${attemptRef.current + 1} in ${(delay / 1000).toFixed(1)}s`
        );
        reconnectTimer.current = setTimeout(connect, delay);
        attemptRef.current += 1;
        setRetryCount(attemptRef.current);
      };

      ws.onerror = () => {
        // onerror always precedes onclose — log only, let onclose handle retry
        console.error('[WS] ❌ Connection error');
      };

    } catch (e) {
      console.error('[WS] Failed to create WebSocket:', e);
      const delay = calcBackoff(attemptRef.current);
      reconnectTimer.current = setTimeout(connect, delay);
      attemptRef.current += 1;
      setRetryCount(attemptRef.current);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  connectRef.current = connect; // keep ref up-to-date

  // ── Reconnect with new URL (called from SettingsPanel) ────
  // ใช้ connectRef แทนการอ้างถึง connect ตรงๆ เพื่อหลีก circular dependency
  const reconnectWithNewUrl = useCallback(() => {
    clearTimeout(reconnectTimer.current);
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close(1000, 'URL changed');
    }
    wsUrlRef.current = null; // force re-resolve — picks up new localStorage value
    attemptRef.current = 0;
    setRetryCount(0);
    setStatus('connecting');
    console.log('[WS] 🔄 URL changed — reconnecting...');
    setTimeout(() => connectRef.current?.(), 300);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveBillingSettings = useCallback((settings) => new Promise((resolve, reject) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      reject(new Error('ยังไม่เชื่อมต่อกับ Backend'));
      return;
    }
    if (billingSaveRef.current) {
      clearTimeout(billingSaveRef.current.timer);
      billingSaveRef.current.reject(new Error('กำลังบันทึกการตั้งค่าเดิมอยู่'));
    }
    const timer = setTimeout(() => {
      if (billingSaveRef.current) {
        billingSaveRef.current.reject(new Error('หมดเวลารอการบันทึก'));
        billingSaveRef.current = null;
      }
    }, 8_000);
    billingSaveRef.current = { resolve, reject, timer };
    ws.send(JSON.stringify({ type: 'update_billing_settings', data: settings }));
  }), []);

  // ── Mount / Unmount ───────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    // รอ 150ms ให้ client-side render เสร็จก่อน (หลีกเลี่ยง SSR hydration issue)
    const initTimer = setTimeout(connect, 150);

    // ── Page Visibility API ──
    // เมื่อ user กลับมาดู tab → reconnect ทันที (ถ้าหลุดไป)
    function handleVisibilityChange() {
      if (document.visibilityState !== 'visible') return;
      const ws = wsRef.current;
      const isDown = !ws
        || ws.readyState === WebSocket.CLOSED
        || ws.readyState === WebSocket.CLOSING;

      if (isDown) {
        console.log('[WS] 👁️  Tab active again — reconnecting immediately');
        clearTimeout(reconnectTimer.current);
        attemptRef.current = 0; // reset backoff — user is actively looking
        connect();
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mountedRef.current = false;
      clearTimeout(initTimer);
      clearTimeout(reconnectTimer.current);
      if (billingSaveRef.current) {
        clearTimeout(billingSaveRef.current.timer);
        billingSaveRef.current.reject(new Error('ยกเลิกการเชื่อมต่อ'));
        billingSaveRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect loop on unmount
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, [connect]);

  return {
    data,
    status,
    lastUpdated,
    retryCount,
    billingSettings,
    reconnectWithNewUrl,
    saveBillingSettings,
  };
}
