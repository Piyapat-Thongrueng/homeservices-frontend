import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import OrderSidebar from '../components/repairorder/OrderSidebar';
import OrderCard from '../components/repairorder/OrderCard';

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
  const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'history'>('orders');
  
  // 1. สร้างตัวแปร State มารองรับข้อมูลที่จะดึงมาจาก Database
  const [orders, setOrders] = useState<OrderForCard[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. เรียกผ่าน API route ของ Next.js (proxy ไป backend) เพื่อหลีกเลี่ยง CORS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/orders/my-orders/1');
        const raw = response?.data;
        const list = Array.isArray(raw) ? raw : raw?.data ?? raw?.orders ?? [];
        setOrders(list.map(normalizeOrder));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 3. แยกข้อมูลเป็น "รอดำเนินการ" และ "ประวัติ (เสร็จแล้ว)"
  const pendingOrders = orders.filter((o) => o.status !== 'ดำเนินการสำเร็จ');
  const historyOrders = orders.filter((o) => o.status === 'ดำเนินการสำเร็จ');

  const renderContent = () => {
    if (loading) return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;

    if (currentTab === 'orders') {
      if (pendingOrders.length === 0) return <div>ไม่มีรายการคำสั่งซ่อม</div>;
      return pendingOrders.map((order) => <OrderCard key={order.id} order={order} />);
    } 
    if (currentTab === 'history') {
      if (historyOrders.length === 0) return <div>ไม่มีประวัติการซ่อม</div>;
      return historyOrders.map((order) => <OrderCard key={order.id} order={order} />);
    }
    if (currentTab === 'profile') {
      return <div className="p-6 bg-white rounded-xl shadow-sm">หน้าข้อมูลส่วนตัว (รอสร้าง)</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="bg-blue-600 text-white text-center py-6 text-3xl font-bold">
        {currentTab === 'history' ? 'ประวัติการซ่อม' : 
         currentTab === 'profile' ? 'ข้อมูลผู้ใช้งาน' : 'รายการคำสั่งซ่อม'}
      </div>
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col md:flex-row gap-8 mb-12">
        <OrderSidebar activeTab={currentTab} onTabChange={setCurrentTab} />
        <div className="flex-1 space-y-4">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}