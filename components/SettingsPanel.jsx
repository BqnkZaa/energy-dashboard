'use client';

import { useEffect, useState } from 'react';

const LS_KEY_URL = 'energy_ws_url';
const EMPTY_SETTINGS = {
  peakRate: '', offPeakRate: '', demandRate: '', ftRate: '', serviceCharge: '', vatRate: '',
};

function Field({ label, field, value, onChange, step = '0.01', hint }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', marginBottom: '6px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.48)' }}>{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', fontFamily: 'monospace' }}
      />
      {hint && <span style={{ display: 'block', marginTop: '3px', fontSize: '9px', color: 'rgba(255,255,255,0.28)' }}>{hint}</span>}
    </label>
  );
}

export default function SettingsPanel({ onUrlChanged, billingSettings, onBillingSettingsSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [wsUrl, setWsUrl] = useState('');
  const [form, setForm] = useState(EMPTY_SETTINGS);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setWsUrl(localStorage.getItem(LS_KEY_URL) || '');
    setStatus('');
  }, [isOpen]);

  useEffect(() => {
    if (!billingSettings) return;
    setForm({
      peakRate: billingSettings.peakRate ?? '',
      offPeakRate: billingSettings.offPeakRate ?? '',
      demandRate: billingSettings.demandRate ?? '',
      ftRate: billingSettings.ftRate ?? '',
      serviceCharge: billingSettings.serviceCharge ?? '',
      vatRate: billingSettings.vatRate ?? '',
    });
  }, [billingSettings]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
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
        });
      }

      const previousUrl = localStorage.getItem(LS_KEY_URL) || '';
      const trimmedUrl = wsUrl.trim();
      if (trimmedUrl) localStorage.setItem(LS_KEY_URL, trimmedUrl);
      else localStorage.removeItem(LS_KEY_URL);
      if (trimmedUrl !== previousUrl) onUrlChanged?.(trimmedUrl);
      setStatus(billingSettings ? 'บันทึกการตั้งค่าแล้ว' : 'บันทึก URL แล้ว — รอเชื่อมต่อ Backend');
    } catch (error) {
      setStatus(error.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="ตั้งค่าระบบ"
        style={{ position: 'fixed', bottom: '56px', right: '16px', zIndex: 50, width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', background: 'rgba(11,17,32,0.9)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '17px' }}
      >
        ⚙
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={() => setIsOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
      <form onSubmit={handleSave} style={{ position: 'relative', width: '560px', maxWidth: '100%', maxHeight: '88vh', overflowY: 'auto', borderRadius: '18px', background: '#0b1120', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.55)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>ตั้งค่าระบบและค่าไฟ</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', marginTop: '3px' }}>บันทึกและใช้งานทันที</div>
          </div>
          <button type="button" onClick={() => setIsOpen(false)} style={{ color: 'rgba(255,255,255,0.55)', background: 'transparent', border: 0, fontSize: '22px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <section>
            <div style={{ color: '#22d3ee', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '10px' }}>การเชื่อมต่อ</div>
            <label>
              <span style={{ display: 'block', marginBottom: '6px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.48)' }}>WebSocket URL</span>
              <input type="url" value={wsUrl} onChange={(event) => setWsUrl(event.target.value)} placeholder="wss://xxxx.trycloudflare.com/ws" style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '8px', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', fontFamily: 'monospace', fontSize: '11px' }} />
            </label>
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
    </div>
  );
}
