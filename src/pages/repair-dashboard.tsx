import React, { useState } from 'react';
import Navbar from '../components/common/Navbar'; 
import Footer from '../components/common/Footer'; 
import OrderSidebar from '../components/repairorder/OrderSidebar';
import OrderCard from '../components/repairorder/OrderCard';

// ข้อมูลงานที่ยังไม่เสร็จ
const mockOrders: any[] = [
  { id: 'AD04071205', status: 'รอดำเนินการ', date: '25/04/2563 เวลา 13.00 น.', worker: 'สมาน เยี่ยมยอด', price: '1,550.00', details: ['ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง'] },
  
];

// ข้อมูลประวัติงานที่เสร็จแล้ว
const mockHistory: any[] = [
  { id: 'AD04071206', status: 'ดำเนินการสำเร็จ', date: '25/04/2563 เวลา 16.00 น.', worker: 'สมาน เยี่ยมยอด', price: '1,550.00', details: ['ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง'] },
];

export default function RepairDashboard() {
  // สร้าง State เพื่อจำว่าตอนนี้อยู่เมนูไหน (ค่าเริ่มต้นให้เป็น 'orders')
  const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'history'>('orders');

  // ฟังก์ชันสำหรับสลับข้อมูลที่จะแสดงผล
  const renderContent = () => {
    if (currentTab === 'orders') {
      return mockOrders.map((order) => <OrderCard key={order.id} order={order} />);
    } 
    if (currentTab === 'history') {
      return mockHistory.map((order) => <OrderCard key={order.id} order={order} />);
    }
    if (currentTab === 'profile') {
      return <div className="p-6 bg-white rounded-xl shadow-sm">หน้าข้อมูลส่วนตัว (รอสร้าง)</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* เปลี่ยนชื่อแถบสีฟ้าตาม Tab ที่เลือก */}
      <div className="bg-blue-600 text-white text-center py-6 text-3xl font-bold">
        {currentTab === 'history' ? 'ประวัติการซ่อม' : 
         currentTab === 'profile' ? 'ข้อมูลผู้ใช้งาน' : 'รายการคำสั่งซ่อม'}
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col md:flex-row gap-8 mb-12">
        {/* ส่ง currentTab และฟังก์ชัน setCurrentTab ไปให้ Sidebar */}
        <OrderSidebar 
          activeTab={currentTab} 
          onTabChange={setCurrentTab} 
        />
        
        {/* บริเวณนี้จะเปลี่ยนเนื้อหาไปมาตามเมนูที่กด */}
        <div className="flex-1 space-y-4">
          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}