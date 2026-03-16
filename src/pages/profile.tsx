import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import OrderSidebar from '@/components/repairorder/OrderSidebar';
import OrderCard from '@/components/repairorder/OrderCard';
import UserProfileForm from '@/components/profile/UserProfileForm';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { state, isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'history'>('profile');

  useEffect(() => {
    // รอให้ AuthContext โหลดเสร็จก่อน แล้วค่อยเช็ค
    if (!state.getUserLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [state.getUserLoading, isAuthenticated]);

  if (state.getUserLoading) return <div className="min-h-screen flex items-center justify-center font-prompt">กำลังโหลด...</div>;
  if (!isAuthenticated || !state.user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-prompt">
      <Navbar />
      <div className="bg-blue-600 text-white text-center py-8 text-2xl font-bold shadow-inner">
        {currentTab === 'profile' ? 'ข้อมูลผู้ใช้งาน' : 'รายการคำสั่งซ่อม'}
      </div>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <OrderSidebar activeTab={currentTab} onTabChange={setCurrentTab} />
        </div>
        <div className="md:w-3/4">
          {currentTab === 'profile' ? <UserProfileForm user={state.user} /> : <div className="text-center py-10">หน้าประวัติคำสั่งซ่อม</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}