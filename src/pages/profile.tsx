import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import OrderSidebar from '@/components/repairorder/OrderSidebar';
import OrderCard from '@/components/repairorder/OrderCard';
import UserProfileForm from '@/components/profile/UserProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

// กำหนดประเภทข้อมูลให้ตรงกับที่ OrderCard ต้องการ
interface OrderType {
  id: number;
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'ดำเนินการสำเร็จ' | 'ยกเลิกคำสั่งซ่อม';
  date: string;
  worker: string;
  price: number;
  details: string[];
}


export default function ProfilePage() {
  const router = useRouter();
  const { state, isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'history'>('profile');

  // รับ tab จาก query string เช่น /profile?tab=orders
  useEffect(() => {
    const { tab } = router.query;
    if (tab === 'orders' || tab === 'history') {
      setCurrentTab(tab);
    }
  }, [router.query]);
  
  // 🌟 เพิ่ม State สำหรับเก็บข้อมูลรายการซ่อม และสถานะการโหลด
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

  console.log('state.user full object:', JSON.stringify(state.user, null, 2));

  useEffect(() => {
    // รอให้ AuthContext โหลดเสร็จก่อน แล้วค่อยเช็ค
    if (!state.getUserLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [state.getUserLoading, isAuthenticated]);

  // 🌟 เพิ่ม useEffect สำหรับดึงข้อมูลออเดอร์เมื่อเปลี่ยน Tab
  useEffect(() => {
    const fetchOrders = async () => {
      // ดึงข้อมูลเฉพาะตอนที่เปิดหน้า orders หรือ history
      if (state.getUserLoading || !state.user || currentTab === 'profile') return;

      setLoadingOrders(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        // ดึงออเดอร์ทั้งหมดของ User คนนี้มา
        const response = await axios.get(`${API_URL}/api/orders/my-orders/${state.user.id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [currentTab, state.user, state.getUserLoading]);

  if (state.getUserLoading) return <div className="min-h-screen flex items-center justify-center font-prompt">กำลังโหลด...</div>;
  if (!isAuthenticated || !state.user) return null;

  // 🌟 กรองข้อมูลตามสถานะแท็บ
  // - หน้า "รายการคำสั่งซ่อม" (orders): โชว์แค่ที่ยังไม่เสร็จ (รอดำเนินการ, กำลังดำเนินการ)
  // - หน้า "ประวัติการซ่อม" (history): โชว์ที่เสร็จแล้วหรือยกเลิก
  const displayOrders = orders.filter(order => {
    if (currentTab === 'orders') {
      return order.status === 'รอดำเนินการ' || order.status === 'กำลังดำเนินการ';
    } else if (currentTab === 'history') {
      return order.status === 'ดำเนินการสำเร็จ' || order.status === 'ยกเลิกคำสั่งซ่อม';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-prompt">
      <Navbar />
      <div className="bg-blue-600 text-white text-center py-8 text-2xl font-bold shadow-inner">
        {currentTab === 'profile' ? 'ข้อมูลผู้ใช้งาน' : 
         currentTab === 'orders' ? 'รายการคำสั่งซ่อม' : 'ประวัติการซ่อม'}
      </div>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* แถบเมนูด้านซ้าย */}
        <div className="md:w-1/4">
          <OrderSidebar activeTab={currentTab} onTabChange={setCurrentTab} />
        </div>
        
        {/* พื้นที่แสดงผลด้านขวา */}
        <div className="md:w-3/4">
          {currentTab === 'profile' ? (
            <UserProfileForm user={state.user} />
          ) : (
            // 🌟 ส่วนแสดงรายการซ่อม
            <div className="flex flex-col gap-4">
              {loadingOrders ? (
                <div className="text-center py-10 text-gray-500">กำลังโหลดรายการ...</div>
              ) : displayOrders.length > 0 ? (
                displayOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))
              ) : (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                  <i className="fa-regular fa-clipboard text-4xl text-gray-300 mb-3 block"></i>
                  <p className="text-gray-500">ไม่มีประวัติคำสั่งซ่อม</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}