'use client';

import { useState } from 'react';

const LS_KEY_URL = 'energy_ws_url';
const EMPTY_SETTINGS = {
  peakRate: '', offPeakRate: '', demandRate: '', ftRate: '', serviceCharge: '', vatRate: '',
  siteLatitude: '', siteLongitude: '',
};

function formFromSettings(settings) {
  if (!settings) return EMPTY_SETTINGS;
  return {
    peakRate: settings.peakRate ?? '',
    offPeakRate: settings.offPeakRate ?? '',
    demandRate: settings.demandRate ?? '',
    ftRate: settings.ftRate ?? '',
    serviceCharge: settings.serviceCharge ?? '',
    vatRate: settings.vatRate ?? '',
    siteLatitude: settings.siteLatitude ?? '',
    siteLongitude: settings.siteLongitude ?? '',
  };
}

const inputStyle = {
  width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px',
  color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.035)',
  border: '1px solid rgba(255,255,255,0.1)', outline: 'none', fontFamily: 'monospace',
};

function Field({ label, field, value, onChange, step = '0.01', hint, min, max }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', marginBottom: '6px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.48)' }}>{label}</span>
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        style={inputStyle}
      />
      {hint && <span style={{ display: 'block', marginTop: '3px', fontSize: '9px', color: 'rgba(255,255,255,0.28)' }}>{hint}</span>}
    </label>
  );
}

function ModalFrame({ children, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
      {children}
    </div>
  );
}

export default function SettingsPanel({ onUrlChanged, billingSettings, onBillingSettingsSave, onAdminAuthenticate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [wsUrl, setWsUrl] = useState('');
  const [form, setForm] = useState(EMPTY_SETTINGS);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function openSettings() {
    setIsOpen(true);
    setIsAuthorized(false);
    setPassword('');
    setWsUrl(localStorage.getItem(LS_KEY_URL) || '');
    setForm(formFromSettings(billingSettings));
    setStatus('');
  }

  function closeSettings() {
    setIsOpen(false);
    setIsAuthorized(false);
    setPassword('');
    setStatus('');
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleAuthenticate(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus('');
    try {
      if (!onAdminAuthenticate) throw new Error('ระบบยืนยันตัวตนยังไม่พร้อมใช้งาน');
      await onAdminAuthenticate(password);
      setIsAuthorized(true);
      setPassword('');
    } catch (error) {
      setStatus(error.message || 'รหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus('');
    try {
      if (billingSettings) {
        await onBillingSettingsSave?.({
          peakRate: Number(form.peakRate),
          offPeakRate: Number(form.offPeakRate),
          demandRate: Number(form.demandRate),
          ftRate: Number(form.ftRate),
          serviceCharge: Number(form.serviceCharge),
          vatRate: Number(form.vatRate),
          siteLatitude: form.siteLatitude === '' ? null : Number(form.siteLatitude),
          siteLongitude: form.siteLongitude === '' ? null : Number(form.siteLongitude),
        });
      }

      const previousUrl = localStorage.getItem(LS_KEY_URL) || '';
      const trimmedUrl = wsUrl.trim();
      if (trimmedUrl) localStorage.setItem(LS_KEY_URL, trimmedUrl);
      else localStorage.removeItem(LS_KEY_URL);
      if (trimmedUrl !== previousUrl) onUrlChanged?.(trimmedUrl);
      setStatus(billingSettings ? 'บันทึกการตั้งค่าแล้ว' : 'บันทึก URL แล้ว - รอเชื่อมต่อ Backend');
    } catch (error) {
      setStatus(error.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={openSettings}
        title="ตั้งค่าระบบ (สำหรับแอดมิน)"
        aria-label="เปิดการตั้งค่าระบบ"
        style={{ position: 'fixed', bottom: '56px', right: '16px', zIndex: 50, width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', background: 'rgba(11,17,32,0.9)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '17px' }}
      >
        ⚙
      </button>
    );
  }

  if (!isAuthorized) {
    return (
      <ModalFrame onClose={closeSettings}>
        <form onSubmit={handleAuthenticate} style={{ position: 'relative', width: '390px', maxWidth: '100%', borderRadius: '18px', background: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.55)', padding: '24px' }}>
          <button type="button" onClick={closeSettings} aria-label="ปิด" style={{ position: 'absolute', top: '12px', right: '14px', color: 'rgba(255,255,255,0.55)', background: 'transparent', border: 0, fontSize: '22px', cursor: 'pointer' }}>×</button>
          <div style={{ width: '38px', height: '38px', display: 'grid', placeItems: 'center', borderRadius: '10px', color: '#22d3ee', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', fontSize: '18px' }}>🔒</div>
          <h2 style={{ marginTop: '14px', color: 'white', fontSize: '16px', fontWeight: 700 }}>ยืนยันตัวตนแอดมิน</h2>
          <p style={{ marginTop: '5px', color: 'rgba(255,255,255,0.42)', fontSize: '11px', lineHeight: 1.6 }}>กรอกรหัสผ่านก่อนแก้ไข WebSocket URL, อัตราค่าไฟ และพิกัดตำแหน่งติดตั้ง</p>
          <label style={{ display: 'block', marginTop: '18px' }}>
            <span style={{ display: 'block', marginBottom: '6px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.48)' }}>รหัสผ่านแอดมิน</span>
            <input type="password" autoFocus autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} />
          </label>
          {status && <div style={{ marginTop: '10px', color: '#f87171', fontSize: '11px', fontWeight: 600 }}>{status}</div>}
          <button type="submit" disabled={isSaving || !password} style={{ width: '100%', height: '42px', marginTop: '18px', borderRadius: '10px', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', background: 'rgba(34,211,238,0.1)', fontWeight: 700, cursor: isSaving ? 'wait' : 'pointer' }}>
            {isSaving ? 'กำลังตรวจสอบ…' : 'ยืนยันและเข้าสู่การตั้งค่า'}
          </button>
        </form>
      </ModalFrame>
    );
  }

  return (
    <ModalFrame onClose={closeSettings}>
      <form onSubmit={handleSave} style={{ position: 'relative', width: '560px', maxWidth: '100%', maxHeight: '88vh', overflowY: 'auto', borderRadius: '18px', background: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.55)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>ตั้งค่าระบบและค่าไฟ</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '3px' }}>สิทธิ์แอดมินได้รับการยืนยันแล้ว</div>
          </div>
          <button type="button" onClick={closeSettings} aria-label="ปิด" style={{ color: 'rgba(255,255,255,0.55)', background: 'transparent', border: 0, fontSize: '22px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <section>
            <div style={{ color: '#22d3ee', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '10px' }}>การเชื่อมต่อ</div>
            <label>
              <span style={{ display: 'block', marginBottom: '6px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.48)' }}>WebSocket URL</span>
              <input type="url" value={wsUrl} onChange={(event) => setWsUrl(event.target.value)} placeholder="wss://xxxx.trycloudflare.com/ws" style={{ ...inputStyle, height: '40px', fontSize: '11px' }} />
            </label>
          </section>

          <section>
            <div style={{ color: '#a78bfa', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '10px' }}>ตำแหน่งติดตั้งสำหรับแผนที่</div>
            {!billingSettings && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>เชื่อมต่อ Backend ก่อนจึงจะบันทึกพิกัดได้</div>}
            {billingSettings && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                <Field label="Latitude" field="siteLatitude" value={form.siteLatitude} onChange={updateField} step="0.000001" min="-90" max="90" hint="เช่น 18.296143" />
                <Field label="Longitude" field="siteLongitude" value={form.siteLongitude} onChange={updateField} step="0.000001" min="-180" max="180" hint="เช่น 99.503111" />
              </div>
            )}
          </section>

          <section>
            <div style={{ color: '#fbbf24', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '10px' }}>อัตราค่าไฟ</div>
            {!billingSettings && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>กำลังรอข้อมูลการตั้งค่าจาก Backend…</div>}
            {billingSettings && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
                <Field label="Peak rate (บาท/kWh)" field="peakRate" value={form.peakRate} onChange={updateField} step="0.0001" />
                <Field label="Off-Peak rate (บาท/kWh)" field="offPeakRate" value={form.offPeakRate} onChange={updateField} step="0.0001" />
                <Field label="Demand rate (บาท/kW)" field="demandRate" value={form.demandRate} onChange={updateField} />
                <Field label="Ft rate (บาท/kWh)" field="ftRate" value={form.ftRate} onChange={updateField} step="0.0001" />
                <Field label="Service charge (บาท/เดือน)" field="serviceCharge" value={form.serviceCharge} onChange={updateField} />
                <Field label="VAT rate" field="vatRate" value={form.vatRate} onChange={updateField} step="0.01" hint="7% ให้ใส่ 0.07" />
              </div>
            )}
          </section>

          {status && <div style={{ color: status.includes('แล้ว') ? '#34d399' : '#f87171', fontSize: '11px', fontWeight: 600 }}>{status}</div>}
          <button type="submit" disabled={isSaving} style={{ height: '42px', borderRadius: '10px', border: '1px solid rgba(34,211,238,0.35)', color: '#22d3ee', background: 'rgba(34,211,238,0.1)', fontWeight: 700, cursor: isSaving ? 'wait' : 'pointer' }}>
            {isSaving ? 'กำลังบันทึก…' : 'บันทึกการตั้งค่า'}
          </button>
        </div>
      </form>
    </ModalFrame>
  );
}
