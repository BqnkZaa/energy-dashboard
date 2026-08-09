'use client';
import { useState, useEffect, useRef } from 'react';

const SETTINGS_PIN = process.env.NEXT_PUBLIC_SETTINGS_PIN || '1234';
const LS_KEY_URL   = 'energy_ws_url';

export default function SettingsPanel({ onUrlChanged }) {
  const [isOpen,      setIsOpen]      = useState(false);
  const [pin,         setPin]         = useState('');
  const [isUnlocked,  setIsUnlocked]  = useState(false);
  const [pinError,    setPinError]    = useState(false);
  const [wsUrl,       setWsUrl]       = useState('');
  const [savedUrl,    setSavedUrl]    = useState('');
  const [saved,       setSaved]       = useState(false);
  const pinRef = useRef(null);
  const urlRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(LS_KEY_URL) || '';
      setSavedUrl(stored);
      setWsUrl(stored);
      setPin('');
      setIsUnlocked(false);
      setPinError(false);
      setSaved(false);
      setTimeout(() => pinRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isUnlocked) setTimeout(() => urlRef.current?.focus(), 100);
  }, [isUnlocked]);

  function handlePinSubmit(e) {
    e.preventDefault();
    if (pin === SETTINGS_PIN) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
      pinRef.current?.focus();
    }
  }

  function handleSave(e) {
    e.preventDefault();
    const trimmed = wsUrl.trim();
    if (trimmed) localStorage.setItem(LS_KEY_URL, trimmed);
    else localStorage.removeItem(LS_KEY_URL);
    setSavedUrl(trimmed);
    setSaved(true);
    onUrlChanged?.(trimmed);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleClear() {
    localStorage.removeItem(LS_KEY_URL);
    setWsUrl('');
    setSavedUrl('');
    onUrlChanged?.('');
  }

  /* ── Floating Gear Button ─────────────────────────────────── */
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="ตั้งค่า WebSocket URL"
        style={{
          position: 'fixed',
          bottom: '56px',
          right: '16px',
          zIndex: 50,
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(11,17,32,0.85)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(34,211,238,0.08)';
          e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(11,17,32,0.85)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        }}
      >
        <svg
          style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.35)', transition: 'color 0.25s' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }

  /* ── Modal ────────────────────────────────────────────────── */
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      />

      {/* Modal Card */}
      <div style={{
        position: 'relative',
        width: '420px',
        maxWidth: '92vw',
        borderRadius: '20px',
        background: '#0b1120',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}>
        {/* Top accent line */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg,#3b82f6 0%,#22d3ee 50%,#10b981 100%)', opacity: 0.7 }} />

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.055)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Icon */}
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'rgba(34,211,238,0.08)',
              border: '1px solid rgba(34,211,238,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg style={{ width: '16px', height: '16px', color: '#22d3ee' }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>ตั้งค่าการเชื่อมต่อ</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px', letterSpacing: '0.05em' }}>WebSocket URL Configuration</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'transparent', border: '1px solid transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.35)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>

          {/* ── PIN Screen ──────────────────────────────────── */}
          {!isUnlocked && (
            <form onSubmit={handlePinSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                {/* Lock icon */}
                <div style={{
                  width: '60px', height: '60px', borderRadius: '16px',
                  background: 'rgba(251,191,36,0.07)',
                  border: '1px solid rgba(251,191,36,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg style={{ width: '28px', height: '28px', color: '#fbbf24' }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.88)' }}>กรุณากรอก PIN</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
                    กรอกรหัส PIN 4 หลักเพื่อเข้าถึงการตั้งค่า
                  </div>
                </div>

                {/* PIN dots input */}
                <div style={{ position: 'relative' }}>
                  <input
                    ref={pinRef}
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(false); }}
                    style={{
                      width: '148px', height: '52px',
                      textAlign: 'center',
                      fontSize: '26px',
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      letterSpacing: '0.55em',
                      borderRadius: '12px',
                      border: `1px solid ${pinError ? 'rgba(248,113,113,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      background: pinError ? 'rgba(248,113,113,0.05)' : 'rgba(255,255,255,0.03)',
                      color: 'white',
                      outline: 'none',
                      caretColor: '#22d3ee',
                      transition: 'all 0.2s',
                    }}
                    onFocus={e => { if (!pinError) e.target.style.borderColor = 'rgba(34,211,238,0.4)'; }}
                    onBlur={e => { if (!pinError) e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    placeholder="••••"
                  />
                </div>

                {pinError && (
                  <div style={{
                    fontSize: '11px', fontWeight: 700,
                    color: '#f87171',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span>✕</span> รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pin.length < 4}
                  style={{
                    width: '148px', height: '40px',
                    borderRadius: '10px',
                    border: '1px solid rgba(34,211,238,0.3)',
                    background: pin.length === 4 ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.03)',
                    color: pin.length === 4 ? '#22d3ee' : 'rgba(255,255,255,0.25)',
                    fontSize: '12px', fontWeight: 700,
                    cursor: pin.length === 4 ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    letterSpacing: '0.05em',
                  }}
                >
                  ปลดล็อก
                </button>
              </div>
            </form>
          )}

          {/* ── URL Editor Screen ────────────────────────────── */}
          {isUnlocked && (
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Unlocked badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', borderRadius: '10px',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}>
                  <svg style={{ width: '14px', height: '14px', color: '#10b981', flexShrink: 0 }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>ปลดล็อกสำเร็จ</span>
                </div>

                {/* Label */}
                <div>
                  <div style={{
                    fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
                    marginBottom: '8px',
                  }}>
                    WebSocket URL (WSS)
                  </div>
                  <input
                    ref={urlRef}
                    type="url"
                    value={wsUrl}
                    onChange={e => { setWsUrl(e.target.value); setSaved(false); }}
                    placeholder="wss://xxxx.trycloudflare.com/ws"
                    style={{
                      width: '100%', height: '44px',
                      padding: '0 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '12px',
                      outline: 'none',
                      caretColor: '#22d3ee',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(34,211,238,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>

                {/* Current URL */}
                {savedUrl && (
                  <div style={{
                    padding: '8px 12px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.35)', marginRight: '6px' }}>URL ปัจจุบัน:</span>
                    <span style={{ fontSize: '9.5px', fontFamily: 'monospace', color: '#22d3ee', wordBreak: 'break-all' }}>
                      {savedUrl}
                    </span>
                  </div>
                )}

                {/* Hint */}
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', lineHeight: 1.65 }}>
                  💡 วาง URL จากคำสั่ง{' '}
                  <code style={{ fontFamily: 'monospace', color: 'rgba(34,211,238,0.6)', background: 'rgba(255,255,255,0.04)', padding: '1px 5px', borderRadius: '4px' }}>
                    tunnel-url
                  </code>{' '}
                  บน Raspberry Pi ในรูปแบบ{' '}
                  <code style={{ fontFamily: 'monospace', color: 'rgba(34,211,238,0.6)', background: 'rgba(255,255,255,0.04)', padding: '1px 5px', borderRadius: '4px' }}>
                    wss://xxxx.trycloudflare.com/ws
                  </code>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1, height: '42px',
                      borderRadius: '10px',
                      border: '1px solid rgba(34,211,238,0.3)',
                      background: saved ? 'rgba(16,185,129,0.12)' : 'rgba(34,211,238,0.1)',
                      color: saved ? '#10b981' : '#22d3ee',
                      fontSize: '12px', fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      transition: 'all 0.2s',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {saved ? (
                      <>
                        <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        บันทึกแล้ว!
                      </>
                    ) : 'บันทึกและเชื่อมต่อใหม่'}
                  </button>

                  {savedUrl && (
                    <button
                      type="button"
                      onClick={handleClear}
                      style={{
                        height: '42px', paddingInline: '16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(248,113,113,0.2)',
                        background: 'rgba(248,113,113,0.05)',
                        color: 'rgba(248,113,113,0.7)',
                        fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      ล้าง
                    </button>
                  )}
                </div>

              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
