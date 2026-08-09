# Energy Monitor Dashboard — Frontend

> Real-Time 3-Phase Energy Monitoring Dashboard  
> **Next.js 16 · Tailwind CSS v4 · Recharts · WebSocket**  
> ออกแบบสำหรับจอทีวี 32 นิ้ว Full-Screen Dark Mode

---

## 🖥️ Layout Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  ⚡ ชื่อระบบ         │   ค่าไฟสะสม (GOLD BIG)   │  🕐 นาฬิกา  ONLINE │
├──────────────────────────────────────────────────────────────────────┤
│  ⚡ Total kW         │ ≈ Total A  │ ≈ Hz     │ Total kWh             │
├───────────┬───────────┬───────────┬───────────────────────────────────┤
│  L1 Card  │  L2 Card  │  L3 Card  │                                   │
│  V=220.5  │  V=221.0  │  V=219.8  │     REAL-TIME AREA CHART          │
│  A=5.12   │  A=4.85   │  A=5.20   │   (Total + L1 + L2 + L3 Watts)   │
│  kW=1.128 │  kW=1.071 │  kW=1.142 │                                   │
│  PF=0.95  │  PF=0.94  │  PF=0.96  │                                   │
├──────────────────────────────────────────────────────────────────────┤
│  Peak (฿xxx)  │  Off-Peak (฿xxx)  │  ค่าบริการ (฿312)  │  รวม (฿xxx) │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📁 โครงสร้างโฟลเดอร์

```
energy-dashboard/
├── app/
│   ├── layout.jsx              ← Root Layout (Thai font, metadata)
│   ├── page.jsx                ← Main Dashboard Page
│   └── globals.css             ← Dark Theme, No-Scroll, Animations
├── components/
│   ├── Header.jsx              ← ชื่อระบบ + นาฬิกา + ค่าไฟรวม + Status
│   ├── MainMetrics.jsx         ← 4 Cards: kW, A, Hz, kWh
│   ├── PhaseCard.jsx           ← Phase Card (L1/L2/L3) V,A,W,PF,Hz
│   ├── PhaseGrid.jsx           ← Phase Grid Container
│   ├── RealtimeChart.jsx       ← Chart Wrapper (dynamic SSR-safe)
│   ├── RealtimeChartInner.jsx  ← Recharts AreaChart Real-Time
│   └── DailySummary.jsx        ← Monthly Cost Summary (Peak/Off-Peak)
├── hooks/
│   ├── useWebSocket.js         ← WS Hook + Auto-Reconnect
│   └── useChartData.js         ← Rolling 60-Point Chart Buffer
├── utils/
│   └── formatters.js           ← Number/Currency Formatters
├── .env.local                  ← WS_URL Config (ตั้งค่า IP Backend)
└── package.json
```

---

## 🚀 ขั้นตอนการรัน

### 1. ตั้งค่า IP Raspberry Pi ใน .env.local

```bash
NEXT_PUBLIC_WS_URL=ws://192.168.1.100:8000/ws
#                        ↑ เปลี่ยนเป็น IP จริงของ Raspberry Pi
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. รัน Development Mode (ทดสอบบน PC)

```bash
npm run dev
# เปิด http://localhost:3000
# กด F11 เพื่อ Full-Screen
```

### 4. Build + Deploy บน Raspberry Pi

```bash
npm run build
npm start

# PM2 Auto-Restart
npm install -g pm2
pm2 start "npm start" --name energy-dashboard
pm2 startup && pm2 save
```

---

## 📺 Kiosk Mode บนทีวีผ่าน Raspberry Pi

```bash
# เพิ่มใน /etc/xdg/lxsession/LXDE-pi/autostart
@chromium-browser --kiosk --noerrdialogs --disable-infobars \
  --no-first-run http://localhost:3000
```

---

## 📡 WebSocket Flow

```
ESP32 → POST /api/energy-data → Backend → WebSocket Broadcast
                                                    ↓
                                         useWebSocket() Hook
                                                    ↓
                              Dashboard Auto-Updates ทุก 2 วินาที
```

---

## 🎨 Color Theme

| Element | สี | ธีม |
|---------|-----|-----|
| Background | `#080c17` | Deep Space |
| L1 Phase | `#f59e0b` | Amber |
| L2 Phase | `#06b6d4` | Cyan |
| L3 Phase | `#10b981` | Emerald |
| Total Cost | `#fbbf24` | Gold |
| Peak TOU | `#f97316` | Orange |
| Off-Peak TOU | `#818cf8` | Violet |

---

## ⚙️ สถานะ Connection

| สัญลักษณ์ | ความหมาย |
|-----------|----------|
| 🟢 **ONLINE** | เชื่อมต่อปกติ ข้อมูลไหลเข้า Real-Time |
| 🟡 **กำลังเชื่อมต่อ** | กำลัง Reconnect (ทุก 3 วินาที) |
| 🔴 **OFFLINE** | ไม่มีสัญญาณ (ข้อมูลค้างบนหน้าจอ) |
