'use client';
import { useState, useEffect, useRef } from 'react';

const MAX_POINTS = 60; // จัดเก็บ 60 จุดข้อมูล

/**
 * Custom Hook: useChartData
 * จัดการ Rolling Buffer ของกิโลวัตต์-ชั่วโมงสะสม (kWh)
 * @param {object} liveData - ข้อมูลล่าสุดจาก useWebSocket
 * @returns {Array} chartPoints
 */
export function useChartData(liveData) {
  const [chartPoints, setChartPoints] = useState([]);
  const prevKwh = useRef(null);

  useEffect(() => {
    if (!liveData) return;

    // ดึงค่าพลังงานไฟฟ้ารวมสะสม (kWh)
    const kwhVal = parseFloat(liveData.total?.kwh) || parseFloat(liveData.monthly_cost?.total_kwh) || 0;
    if (kwhVal === 0) return;

    // ป้องกันจุดซ้ำซ้อนถ้าค่าไม่เปลี่ยน
    if (prevKwh.current === kwhVal && chartPoints.length > 0) return;
    prevKwh.current = kwhVal;

    const now = new Date();
    const timeLabel = now.toLocaleTimeString('th-TH', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const newPoint = {
      time: timeLabel,
      kwh:  parseFloat(kwhVal.toFixed(3)), // เก็บจุดทศนิยม 3 ตำแหน่งตามสเปคมิเตอร์
    };

    setChartPoints((prev) => {
      const next = [...prev, newPoint];
      return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
    });
  }, [liveData]);

  return chartPoints;
}
