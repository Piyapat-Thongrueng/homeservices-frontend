import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import OrderSidebar from '@/components/repairorder/OrderSidebar';
import OrderCardOrders from '@/components/repairorder/OrderCardOrders';
import OrderCardHistory from '@/components/repairorder/OrderCardHistory';
import type { OrderType } from '@/components/repairorder/types';
import UserProfileForm from '@/components/profile/UserProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


export default function ProfilePage() {
  const router = useRouter();
  const { state, isAuthenticated } = useAuth();
  const { t } = useTranslation('common');
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
  const [visibleOrdersCount, setVisibleOrdersCount] = useState<number>(3);

  console.log('state.user full object:', JSON.stringify(state.user, null, 2));

  useEffect(() => {
    // รอให้ AuthContext โหลดเสร็จก่อน แล้วค่อยเช็ค
    if (!state.getUserLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [state.getUserLoading, isAuthenticated, router]);

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

  if (state.getUserLoading) return <div className="min-h-screen flex items-center justify-center font-prompt">{t('profile.loading', 'กำลังโหลด...')}</div>;
  if (!isAuthenticated || !state.user) return null;

  // 🌟 กรองข้อมูลตามสถานะแท็บ
  // - หน้า "รายการคำสั่งซ่อม" (orders): โชว์แค่ที่ยังไม่เสร็จ (รอดำเนินการ, กำลังดำเนินการ)
  // - หน้า "ประวัติการซ่อม" (history): โชว์ที่เสร็จแล้วหรือยกเลิก
  const filteredOrders = orders.filter(order => {
    if (currentTab === 'orders') {
      return order.status === 'รอดำเนินการ' || order.status === 'กำลังดำเนินการ';
    } else if (currentTab === 'history') {
      return order.status === 'ดำเนินการสำเร็จ' || order.status === 'ยกเลิกคำสั่งซ่อม';
    }
    return true;
  });

  const displayOrders =
    currentTab === 'history'
      ? [...filteredOrders].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
      : filteredOrders;

  useEffect(() => {
    setVisibleOrdersCount(displayOrders.length > 3 ? 3 : displayOrders.length);
  }, [displayOrders.length, currentTab]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-prompt">
      <Navbar />
      <div className="bg-blue-600 text-white text-center py-8 text-2xl font-bold shadow-inner">
        {currentTab === 'profile' ? t('profile.title_profile', 'ข้อมูลผู้ใช้งาน') : 
         currentTab === 'orders' ? t('profile.title_orders', 'รายการคำสั่งซ่อม') : t('profile.title_history', 'ประวัติการซ่อม')}
      </div>
      <main className="grow max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
        
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
                <div className="text-center py-10 text-gray-500">{t('profile.loading_items', 'กำลังโหลดรายการ...')}</div>
              ) : displayOrders.length > 0 ? (
                <>
                  {displayOrders.slice(0, visibleOrdersCount).map(order =>
                    currentTab === 'history' ? (
                      <OrderCardHistory key={order.id} order={order} />
                    ) : (
                      <OrderCardOrders key={order.id} order={order} />
                    ),
                  )}
                  {visibleOrdersCount < displayOrders.length && (
                    <div className="flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleOrdersCount((prev) =>
                            Math.min(prev + 3, displayOrders.length),
                          )
                        }
                        className="btn-secondary px-6 py-2 w-full cursor-pointer"
                      >
                        {t('cart.btn_load_more', 'ดูเพิ่มเติม')}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                  <i className="fa-regular fa-clipboard text-4xl text-gray-300 mb-3 block"></i>
                  <p className="text-gray-500">{t('profile.no_history', 'ไม่มีประวัติคำสั่งซ่อม')}</p>
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}