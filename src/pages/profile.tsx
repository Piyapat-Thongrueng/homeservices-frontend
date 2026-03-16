import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import OrderSidebar from '@/components/repairorder/OrderSidebar';
import OrderCard from '@/components/repairorder/OrderCard';
import UserProfileForm from '@/components/profile/UserProfileForm';
import { useAuth } from '@/contexts/AuthContext';

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
  
  if (s === 'completed' || s === 'done') {
    status = 'ดำเนินการสำเร็จ';
  } else if (s === 'in_progress' || s === 'processing') {
    status = 'กำลังดำเนินการ';
  } else if (s === 'cancelled' || s === 'canceled') {
    status = 'ยกเลิกคำสั่งซ่อม';
  }

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
  const { user, loading: authLoading } = useRequireAuth();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<'profile' | 'orders' | 'history'>('profile');
  const [orders, setOrders] = useState<OrderForCard[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  
  // 🛑 Address States (แยกย่อยตามดีไซน์ใหม่)
  const [addressDetail, setAddressDetail] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Avatar States
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.user_metadata?.name || user.user_metadata?.full_name || "");
      setUsername(user.user_metadata?.username || "");
      setPhone(user.user_metadata?.phone || "");
      
      // ดึงข้อมูลที่อยู่แยกส่วน
      setAddressDetail(user.user_metadata?.address_detail || "");
      setSubDistrict(user.user_metadata?.sub_district || "");
      setDistrict(user.user_metadata?.district || "");
      setProvince(user.user_metadata?.province || "");
      setPostalCode(user.user_metadata?.postal_code || "");
      
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading || !user) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
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

  const handleSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    if (!user || savingProfile) return;
    setSavingProfile(true);
    try {
      let finalAvatarUrl = avatarUrl;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars-picture")
          .upload(fileName, selectedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("avatars-picture")
          .getPublicUrl(fileName);

        finalAvatarUrl = data.publicUrl;
        setAvatarUrl(finalAvatarUrl);
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }

      // 🛑 บันทึกข้อมูลที่อยู่แยกฟิลด์กันให้เป็นระเบียบ
      const { error } = await supabase.auth.updateUser({
        data: { 
          name, 
          username, 
          phone, 
          address_detail: addressDetail,
          sub_district: subDistrict,
          district: district,
          province: province,
          postal_code: postalCode,
          avatar_url: finalAvatarUrl 
        }
      });
      if (error) throw error;
      
      alert("บันทึกข้อมูลส่วนตัวสำเร็จ ✅");
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center font-prompt text-gray-500">กำลังตรวจสอบสิทธิ์...</div>;
  if (!user) return null;

  const pendingOrders = orders.filter((o) => o.status === 'รอดำเนินการ' || o.status === 'กำลังดำเนินการ');
  const historyOrders = orders.filter((o) => o.status === 'ดำเนินการสำเร็จ' || o.status === 'ยกเลิกคำสั่งซ่อม');

  const displayAvatar = previewUrl || avatarUrl;

  const renderContent = () => {
    if (currentTab === 'profile') {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          
          {/* ================= โซนข้อมูลส่วนตัว ================= */}
          <h2 className="text-xl font-semibold mb-6 text-gray-800">ข้อมูลผู้ใช้งาน</h2>
          <div className="flex flex-col md:flex-row gap-10">
            {/* ฝั่งซ้าย: ข้อมูล Text */}
            <div className="flex-1 space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล (ไม่สามารถแก้ไขได้)</label>
                <input value={email} disabled className="w-full h-[44px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ระบุชื่อ-นามสกุลของคุณ" className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all " />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้งาน (Username)</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ระบุชื่อผู้ใช้งาน" className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all " />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08X-XXX-XXXX" maxLength={10} className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all " />
              </div>
            </div>

            {/* ฝั่งขวา: ส่วนอัปโหลดรูปโปรไฟล์ */}
            <div className="flex-1 flex flex-col items-center justify-start pt-4 border-t md:border-t-0 md:border-l border-gray-100 md:pl-10">
              <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center relative mb-4">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center">
                    <i className="fa-solid fa-image text-3xl mb-2"></i>
                    <span className="text-sm">ไม่มีรูปภาพ</span>
                  </div>
                )}
              </div>
              <label className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm transition-all flex items-center gap-2">
                <i className="fa-solid fa-cloud-arrow-up"></i>
                เลือกรูปภาพใหม่
                <input type="file" accept="image/*" onChange={handleSelectAvatar} className="hidden" />
              </label>
              <p className="text-xs text-gray-500 mt-3 text-center">
                * รูปภาพจะอัปเดตเมื่อคุณกดปุ่ม "บันทึกข้อมูล"
              </p>
            </div>
          </div>

          {/* ================= โซนข้อมูลที่อยู่ (เต็มความกว้าง) ================= */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">ข้อมูลที่อยู่</h2>
            </div>

            <div className="space-y-5">
              {/* แถว 1: รายละเอียดที่อยู่ (ยาวเต็ม) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                <input 
                  value={addressDetail} 
                  onChange={(e) => setAddressDetail(e.target.value)} 
                  placeholder="ระบุเลขที่, หมู่, ถนน, ซอย" 
                  className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
              </div>

              {/* แถว 2-3: Grid 2 คอลัมน์ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รหัสไปรษณีย์</label>
                  <input 
                    value={postalCode} 
                    onChange={(e) => setPostalCode(e.target.value)} 
                    placeholder="รหัสไปรษณีย์" 
                    maxLength={5}
                    className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ตำบล/แขวง</label>
                  <input 
                    value={subDistrict} 
                    onChange={(e) => setSubDistrict(e.target.value)} 
                    placeholder="ระบุตำบล/แขวง" 
                    className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">อำเภอ/เขต</label>
                  <input 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)} 
                    placeholder="ระบุอำเภอ/เขต" 
                    className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จังหวัด</label>
                  <input 
                    value={province} 
                    onChange={(e) => setProvince(e.target.value)} 
                    placeholder="ระบุจังหวัด" 
                    className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
              </div>
            </div>
          </div>
         
          {/* ================= โซนปุ่ม Action ================= */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 pt-6 border-t border-gray-100">
            <button 
              onClick={handleSaveProfile} 
              disabled={savingProfile}
              className="btn-primary w-full sm:w-auto px-10 py-2.5 rounded-lg font-medium shadow-sm transition-all hover:shadow-md"
            >
              {savingProfile ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>

            <button
              onClick={() => router.push('/reset-password')}
              className="w-full sm:w-auto px-10 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-lock text-sm"></i>
              เปลี่ยนรหัสผ่าน
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
      
      <div className="bg-blue-600 text-white text-center py-8 text-2xl md:text-3xl font-bold tracking-wide shadow-inner">
        {currentTab === 'history' ? 'ประวัติการซ่อม' : 
         currentTab === 'profile' ? 'ข้อมูลผู้ใช้งาน' : 'รายการคำสั่งซ่อม'}
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <OrderSidebar activeTab={currentTab} onTabChange={setCurrentTab} />
          </div>

          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}