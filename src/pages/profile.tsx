import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import OrderSidebar from '@/components/repairorder/OrderSidebar';
import OrderCard from '@/components/repairorder/OrderCard';
import { useAuth } from '@/contexts/AuthContext';

// 🌟 1. นำเข้า Component ใหม่ที่เราเพิ่งสร้าง
import UserProfileForm from '@/components/profile/UserProfileForm';

// ฟังก์ชันจัดรูปแบบสถานะคำสั่งซ่อม (คงไว้เหมือนเดิม)
type OrderForCard = {
  id: string;
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'ดำเนินการสำเร็จ' | 'ยกเลิกคำสั่งซ่อม';
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
  else if (s === 'cancelled' || s === 'canceled') status = 'ยกเลิกคำสั่งซ่อม';

  const rawDetails = o.details ?? o.items ?? o.description ?? [];
  let details: string[] = [];
  if (Array.isArray(rawDetails)) details = rawDetails.map(String);
  else if (typeof rawDetails === 'string') details = [rawDetails];

  return {
    id: String(o.id ?? o.order_id ?? ''),
    status,
    date: String(o.date ?? o.created_at ?? ''),
    worker: String(o.worker ?? o.technician_name ?? 'ยังไม่ระบุช่าง'),
    price: String(o.price ?? o.total_price ?? '0.00'),
    details,
  };
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // State สำหรับจัดการ Tab และ Orders
  const [currentTab, setCurrentTab] = useState('profile');
  const [pendingOrders, setPendingOrders] = useState<OrderForCard[]>([]);
  const [historyOrders, setHistoryOrders] = useState<OrderForCard[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // ตรวจสอบสิทธิ์การเข้าถึง
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // ดึงข้อมูลคำสั่งซ่อม (Orders)
  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const API_URL = "http://localhost:4000";
        const response = await axios.get(`${API_URL}/api/orders/user/${user.id}`);
        const ordersData = Array.isArray(response.data) ? response.data : [];
        
        const normalized = ordersData.map(normalizeOrder);
        const pending = normalized.filter(o => o.status === 'รอดำเนินการ' || o.status === 'กำลังดำเนินการ');
        const history = normalized.filter(o => o.status === 'ดำเนินการสำเร็จ' || o.status === 'ยกเลิกคำสั่งซ่อม');
        
        setPendingOrders(pending);
        setHistoryOrders(history);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (authLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>;
  }

  // 🌟 2. ฟังก์ชันเลือกแสดงหน้าจอตาม Tab ที่กด
  const renderContent = () => {
    if (currentTab === 'profile') {
      // เรียกใช้ไฟล์ UserProfileForm ที่เราแยกไว้!
      return <UserProfileForm user={user} />;
    } 
    
    if (currentTab === 'orders') {
      if (loadingOrders) return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>;
      if (pendingOrders.length === 0) return <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">ไม่มีรายการคำสั่งซ่อมที่กำลังดำเนินการ</div>;
      return <div className="space-y-4">{pendingOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div>;
    } 
    
    if (currentTab === 'history') {
      if (loadingOrders) return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>;
      if (historyOrders.length === 0) return <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">ไม่มีประวัติการซ่อม</div>;
      return <div className="space-y-4">{historyOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-prompt">
      <Navbar />
      
      <div className="bg-blue-600 text-white text-center py-8 text-2xl md:text-3xl font-bold tracking-wide shadow-inner">
        {currentTab === 'history' ? 'ประวัติการซ่อม' : 
         currentTab === 'profile' ? 'ข้อมูลผู้ใช้งาน' : 'รายการคำสั่งซ่อม'}
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <OrderSidebar activeTab={currentTab} onTabChange={setCurrentTab} />
        </div>
        
        <div className="md:w-3/4">
          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}