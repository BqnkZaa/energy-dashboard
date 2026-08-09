'use client';
import { useState, useEffect, useRef } from 'react';

// ══════════════════════════════════════════════════════════════
//  SettingsPanel Component
//  - กดปุ่ม ⚙️ เพื่อเปิด Panel
//  - กรอก PIN 4 หลัก (ค่า Default: 1234)
//  - เมื่อปลดล็อกแล้ว สามารถกรอก WSS URL ใหม่ได้
//  - บันทึกลง localStorage → useWebSocket อ่านค่าอัตโนมัติ
// ══════════════════════════════════════════════════════════════

const SETTINGS_PIN = process.env.NEXT_PUBLIC_SETTINGS_PIN || '1234';
const LS_KEY_URL   = 'energy_ws_url';

export default function SettingsPanel({ onUrlChanged }) {
  const [isOpen, setIsOpen]           = useState(false);
  const [pinInput, setPinInput]       = useState('');
  const [isUnlocked, setIsUnlocked]  = useState(false);
  const [pinError, setPinError]       = useState(false);
  const [wsUrl, setWsUrl]             = useState('');
  const [saved, setSaved]             = useState(false);
  const [currentUrl, setCurrentUrl]   = useState('');
  const pinRef                        = useRef(null);
  const urlRef                        = useRef(null);

  // โหลดค่าปัจจุบันจาก localStorage เมื่อเปิด Panel
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(LS_KEY_URL) || '';
      setCurrentUrl(stored);
      setWsUrl(stored);
      setPinInput('');
      setIsUnlocked(false);
      setPinError(false);
      setSaved(false);
      // Auto-focus PIN input
      setTimeout(() => pinRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // เมื่อปลดล็อก → focus URL input
  useEffect(() => {
    if (isUnlocked) {
      setTimeout(() => urlRef.current?.focus(), 100);
    }
  }, [isUnlocked]);

  // ── PIN Submit ─────────────────────────────────────────────
  function handlePinSubmit(e) {
    e.preventDefault();
    if (pinInput === SETTINGS_PIN) {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
      pinRef.current?.focus();
    }
  }

  // ── Save URL ───────────────────────────────────────────────
  function handleSaveUrl(e) {
    e.preventDefault();
    const trimmed = wsUrl.trim();
    if (trimmed) {
      localStorage.setItem(LS_KEY_URL, trimmed);
    } else {
      localStorage.removeItem(LS_KEY_URL);
    }
    setCurrentUrl(trimmed);
    setSaved(true);
    // Notify parent → reconnect with new URL
    onUrlChanged?.(trimmed);
    setTimeout(() => setSaved(false), 3000);
  }

  // ── Clear URL (Reset to Default) ──────────────────────────
  function handleClearUrl() {
    localStorage.removeItem(LS_KEY_URL);
    setWsUrl('');
    setCurrentUrl('');
    setSaved(false);
    onUrlChanged?.('');
  }

  if (!isOpen) {
    // ── Floating Gear Button ─────────────────────────────────
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 right-4 z-50 w-10 h-10 rounded-full
                   bg-white/[0.05] border border-white/[0.08] backdrop-blur-md
                   hover:bg-white/[0.12] hover:border-white/20
                   transition-all duration-300 group
                   flex items-center justify-center
                   shadow-lg shadow-black/20"
        title="ตั้งค่า WebSocket URL"
      >
        <svg
          className="w-5 h-5 text-white/40 group-hover:text-white/80
                     transition-all duration-300 group-hover:rotate-90"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }

  // ── Full Panel (Modal Overlay) ─────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-[440px] max-w-[95vw] rounded-2xl border border-white/[0.08]
                      bg-[#0c1322]/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20
                            flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">ตั้งค่าการเชื่อมต่อ</h3>
              <p className="text-[10px] text-white/40">WebSocket URL Configuration</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center
                       transition-colors text-white/40 hover:text-white/80"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">

          {!isUnlocked ? (
            /* ── PIN Entry ──────────────────────────────────── */
            <form onSubmit={handlePinSubmit}>
              <div className="flex flex-col items-center gap-4">
                {/* Lock Icon */}
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20
                                flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>

                <div className="text-center">
                  <p className="text-sm font-bold text-white">กรุณากรอก PIN</p>
                  <p className="text-[11px] text-white/40 mt-1">กรอกรหัส PIN 4 หลักเพื่อเข้าถึงการตั้งค่า</p>
                </div>

                {/* PIN Input */}
                <input
                  ref={pinRef}
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                    setPinError(false);
                  }}
                  className={`w-40 h-12 text-center text-2xl font-mono font-bold tracking-[0.5em]
                             rounded-xl border bg-white/[0.03] text-white outline-none
                             transition-all duration-300
                             ${pinError
                               ? 'border-red-500/50 bg-red-500/[0.05] animate-[shake_0.3s_ease-in-out]'
                               : 'border-white/[0.08] focus:border-cyan-500/40 focus:bg-cyan-500/[0.02]'
                             }`}
                  placeholder="••••"
                />

                {pinError && (
                  <p className="text-xs text-red-400 font-medium animate-pulse">
                    ❌ รหัส PIN ไม่ถูกต้อง กรุณาลองใหม่
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pinInput.length < 4}
                  className="w-40 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30
                             text-cyan-400 font-bold text-sm
                             hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed
                             transition-all duration-200"
                >
                  ปลดล็อก
                </button>
              </div>
            </form>

          ) : (
            /* ── URL Editor ─────────────────────────────────── */
            <form onSubmit={handleSaveUrl}>
              <div className="flex flex-col gap-4">

                {/* Unlocked Badge */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg
                                bg-emerald-500/[0.06] border border-emerald-500/20">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="text-[11px] text-emerald-400 font-bold">ปลดล็อกสำเร็จ</span>
                </div>

                {/* Label */}
                <div>
                  <label className="text-[11px] text-white/50 font-bold uppercase tracking-wider block mb-2">
                    WebSocket URL (WSS)
                  </label>
                  <input
                    ref={urlRef}
                    type="url"
                    value={wsUrl}
                    onChange={(e) => { setWsUrl(e.target.value); setSaved(false); }}
                    className="w-full h-11 px-4 rounded-xl border border-white/[0.08]
                               bg-white/[0.03] text-white font-mono text-sm
                               outline-none focus:border-cyan-500/40 focus:bg-cyan-500/[0.02]
                               transition-all duration-300
                               placeholder:text-white/20"
                    placeholder="wss://xxxx.trycloudflare.com/ws"
                  />
                </div>

                {/* Current URL display */}
                {currentUrl && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-lg
                                  bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] text-white/40 font-bold shrink-0 mt-0.5">URL ปัจจุบัน:</span>
                    <span className="text-[10px] text-cyan-400 font-mono break-all">{currentUrl}</span>
                  </div>
                )}

                {/* Hint */}
                <p className="text-[10px] text-white/30 leading-relaxed">
                  💡 วาง URL ที่ได้จากคำสั่ง <code className="text-cyan-400/60 bg-white/[0.04] px-1 rounded">tunnel-url</code> บน Raspberry Pi
                  ในรูปแบบ <code className="text-cyan-400/60 bg-white/[0.04] px-1 rounded">wss://xxxx.trycloudflare.com/ws</code><br />
                  เว้นว่างและกดบันทึกเพื่อกลับไปใช้ค่า Default
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30
                               text-cyan-400 font-bold text-sm
                               hover:bg-cyan-500/30 transition-all duration-200
                               flex items-center justify-center gap-2"
                  >
                    {saved ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        บันทึกแล้ว!
                      </>
                    ) : (
                      'บันทึกและเชื่อมต่อใหม่'
                    )}
                  </button>

                  {currentUrl && (
                    <button
                      type="button"
                      onClick={handleClearUrl}
                      className="h-10 px-4 rounded-xl border border-red-500/20
                                 text-red-400/70 text-sm font-medium
                                 hover:bg-red-500/[0.06] transition-all duration-200"
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
