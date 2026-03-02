import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import OrderSidebar from '@/components/repairorder/OrderSidebar';
import OrderCard from '@/components/repairorder/OrderCard';
import { useRequireAuth } from '@/contexts/useRequireAuth';
import { supabase } from '@/lib/supabaseClient';

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
    date: String(o.date ?? ''),
    worker: String(o.worker ?? '-'),
    price: String(o.price ?? '0'),
    details,
  };
}

export default function RepairDashboard() {
  // 1. ระบบ Auth
  const { user, loading: authLoading } = useRequireAuth();

  // 2. Dashboard State
  const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'history'>('orders');
  const [orders, setOrders] = useState<OrderForCard[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // 3. Profile State (นำมาจาก profile.tsx)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // --- Effect 1: โหลดข้อมูล Profile ---
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.user_metadata?.name || user.user_metadata?.full_name || "");
      setUsername(user.user_metadata?.username || "");
    }
  }, [user]);

  // --- Effect 2: โหลดข้อมูล Orders ---
  useEffect(() => {
    if (authLoading || !user) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const API_URL = 'http://localhost:4000';
        console.log("👉 กำลังยิงไปที่ URL:", `${API_URL}/api/orders/my-orders/${user.id}`);
        const response = await axios.get(`${API_URL}/api/orders/my-orders/${user.id}`);
        setOrders(response.data.map(normalizeOrder));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user, authLoading]);

  // --- Logic การบันทึก Profile ---
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: name, username: username }
      });
      if (error) throw error;
      alert("บันทึกข้อมูลส่วนตัวสำเร็จ");
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Loading State ของหน้าเว็บ ---
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center font-prompt text-gray-500">กำลังตรวจสอบสิทธิ์...</div>;
  }
  if (!user) return null;

  const pendingOrders = orders.filter((o) => o.status !== 'ดำเนินการสำเร็จ');
  const historyOrders = orders.filter((o) => o.status === 'ดำเนินการสำเร็จ');

  // --- Render เนื้อหาตาม Tab ---
  const renderContent = () => {
    if (currentTab === 'profile') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">ข้อมูลผู้ใช้งาน</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล (ไม่สามารถแก้ไขได้)</label>
              <input value={email} disabled className="w-full h-[44px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้งาน (Username)</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>
            <button 
              onClick={handleSaveProfile} 
              disabled={savingProfile}
              className="mt-6 btn-primary w-full sm:w-auto px-8 py-2.5 rounded-lg font-medium"
            >
              {savingProfile ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </div>
      );
    }

    if (loadingOrders) return <div className="p-8 text-center text-gray-500">กำลังโหลดข้อมูลคำสั่งซ่อม...</div>;

    if (currentTab === 'orders') {
      if (pendingOrders.length === 0) return <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">ไม่มีรายการคำสั่งซ่อมที่กำลังดำเนินการ</div>;
      return <div className="space-y-4">{pendingOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div>;
    } 
    
    if (currentTab === 'history') {
      if (historyOrders.length === 0) return <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-gray-100">ไม่มีประวัติการซ่อม</div>;
      return <div className="space-y-4">{historyOrders.map((order) => <OrderCard key={order.id} order={order} />)}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-prompt">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-blue-600 text-white text-center py-8 text-2xl md:text-3xl font-bold tracking-wide shadow-inner">
        {currentTab === 'history' ? 'ประวัติการซ่อม' : 
         currentTab === 'profile' ? 'ข้อมูลผู้ใช้งาน' : 'รายการคำสั่งซ่อม'}
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <OrderSidebar activeTab={currentTab} onTabChange={setCurrentTab} />
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}