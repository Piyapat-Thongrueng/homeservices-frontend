import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import OrderSidebar from '../components/repairorder/OrderSidebar';
import OrderCard from '../components/repairorder/OrderCard';

import { useRequireAuth } from '@/contexts/useRequireAuth';

type OrderForCard = {
  id: string;
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'ดำเนินการสำเร็จ';
  date: string;
  worker: string;
  price: string;
  details: string[];
};

function normalizeOrder(o: Record<string, unknown>): OrderForCard {
  const s = String(o.status ?? '').toLowerCase();
  let status: OrderForCard['status'] = 'รอดำเนินการ';
  if (s === 'completed' || s === 'done') status = 'ดำเนินการสำเร็จ';
  else if (s === 'in_progress' || s === 'processing') status = 'กำลังดำเนินการ';

  const rawDetails = o.details ?? o.items ?? o.description ?? o.repair_items;
  const details = Array.isArray(rawDetails)
    ? rawDetails.map((d: unknown) => (typeof d === 'string' ? d : String(d)))
    : rawDetails != null && typeof rawDetails === 'string'
      ? [rawDetails]
      : [];

  return {
    id: o.id != null ? String(o.id) : '',
    status,
    date: String(o.date ?? o.created_at ?? o.createdAt ?? o.scheduled_at ?? '-'),
    worker: String(o.worker ?? o.worker_name ?? o.technician ?? '-'),
    price: String(o.price ?? o.total_price ?? o.total ?? o.amount ?? '0'),
    details,
  };
}

export default function RepairDashboard() {
  // 2. เรียกใช้งาน Auth Hook (จะทำการ Redirect ไปหน้า Login ให้อัตโนมัติหากยังไม่ล็อกอิน)
  const { user, loading: authLoading } = useRequireAuth(); 

  const [orders, setOrders] = useState<OrderForCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'history'>('orders');

  useEffect(() => {
    // 3. ป้องกันการดึงข้อมูลหากยังโหลด Auth ไม่เสร็จ หรือยังไม่มี User
    if (authLoading || !user) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        
        // 4. ส่ง user.id ไปดึงข้อมูลจาก Backend (/my-orders/:userId)
        const response = await axios.get(`${API_URL}/api/orders/my-orders/${user.id}`);
        
        // แปลงข้อมูลให้อยู่ในรูปแบบที่การ์ดต้องการ
        const normalized = response.data.map(normalizeOrder);
        setOrders(normalized);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]); // ใส่ dependency เพื่อให้ทำงานเมื่อ user หรือ authLoading เปลี่ยน

  // 5. แสดงหน้าโหลดระหว่างเช็คสถานะล็อกอิน
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-prompt">
        <p className="text-gray-500 text-lg">กำลังตรวจสอบสิทธิ์เข้าใช้งาน...</p>
      </div>
    );
  }

  // หากไม่มี user ระบบของ useRequireAuth จะสั่ง router.replace('/auth/login') ไปแล้ว 
  // เราแค่ return null เพื่อไม่ให้มัน render หน้า dashboard ที่ว่างเปล่าออกมา
  if (!user) return null;

  // ... (โค้ดส่วนฟังก์ชัน renderContent และ return UI ตามปกติ) ...

  const pendingOrders = orders.filter((o) => o.status !== 'ดำเนินการสำเร็จ');
  const historyOrders = orders.filter((o) => o.status === 'ดำเนินการสำเร็จ');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar จะแสดงสถานะ Login อัตโนมัติ เพราะมันดึงข้อมูลจาก Context เดียวกัน */}
      <Navbar />
      
      {/* ... โค้ด UI เดิม ... */}
    </div>
  );
}