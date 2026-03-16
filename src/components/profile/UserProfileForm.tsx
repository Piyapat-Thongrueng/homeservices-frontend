import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LocationSelectors from '@/components/servicedetail/LocationSelectors';

interface UserProfileFormProps {
  user: any; 
}

export default function UserProfileForm({ user }: UserProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [addressDetail, setAddressDetail] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfileData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${API_URL}/api/users/${user.id}/address`);
        
        if (response.data) {
          setEmail(response.data.email || user.email || "");
          setName(response.data.name || "");
          setUsername(response.data.username || "");
          setPhone(response.data.phone || "");
          
          setAddressDetail(response.data.address_line || '');
          setSubDistrict(response.data.sub_district || '');
          setDistrict(response.data.district || '');
          setProvince(response.data.province || '');
          setPostalCode(response.data.postal_code || '');
          
          if (response.data.profile_pic) {
            setAvatarUrl(response.data.profile_pic);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfileData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince);
    setDistrict("");
    setSubDistrict("");
  };

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    setSubDistrict("");
  };

  const handleSaveProfile = async () => {
    if (!user || savingProfile) return;
    setSavingProfile(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append("profileImage", selectedFile); 
      
      // 🌟 บังคับแพ็คข้อมูลส่งให้ชัวร์ 100%
      formData.append("name", name || "");
      formData.append("username", username || "");
      formData.append("phone", phone || "");

      formData.append("address_line", addressDetail || "");
      formData.append("sub_district", subDistrict || "");
      formData.append("district", district || "");
      formData.append("province", province || "");
      formData.append("postal_code", postalCode || "");

      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${API_URL}/api/users/${user.id}/update-profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.profilePicUrl) {
        setAvatarUrl(response.data.profilePicUrl);
      }
      
      showToast("บันทึกข้อมูลสำเร็จ", "success");
      
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (error: any) {
      showToast("เกิดข้อผิดพลาด: " + error.message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      
      <h2 className="text-xl font-semibold mb-6 text-gray-800">ข้อมูลผู้ใช้งาน</h2>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล (ไม่สามารถแก้ไขได้)</label>
            <input value={email} readOnly className="w-full h-[44px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 outline-none" />
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

        <div className="flex-1 flex flex-col items-center justify-start pt-4 border-t md:border-t-0 md:border-l border-gray-100 md:pl-10">
          <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center relative mb-4">
            {previewUrl || avatarUrl ? (
              <img src={previewUrl || avatarUrl || undefined} alt="Profile" className="w-full h-full object-cover" />
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
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <p className="text-xs text-gray-500 mt-3 text-center">
            * รูปภาพจะอัปเดตเมื่อคุณกดปุ่ม "บันทึกข้อมูล"
          </p>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">ข้อมูลที่อยู่</h2>
          <p className="text-sm text-gray-500 mt-1">เพื่อให้เราสามารถส่งของ และเอกสารให้คุณได้</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดที่อยู่</label>
            <input 
              value={addressDetail} 
              onChange={(e) => setAddressDetail(e.target.value)} 
              placeholder="ระบุเลขที่, หมู่, ถนน, ซอย" 
              className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
            />
          </div>

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

            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
              <LocationSelectors 
                province={province}
                district={district}
                subDistrict={subDistrict}
                onProvinceChange={handleProvinceChange}
                onDistrictChange={handleDistrictChange}
                onSubDistrictChange={(val) => setSubDistrict(val)}
              />
            </div>
          
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 pt-6 border-t border-gray-100">
        <button 
          onClick={handleSaveProfile} 
          disabled={savingProfile}
          className="btn-primary bg-blue-600 text-white w-full sm:w-auto px-10 py-2.5 rounded-lg font-medium shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {savingProfile ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>

        <button
          onClick={() => router.push('/reset-password')}
          className="w-full sm:w-auto px-10 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-lock text-sm"></i>เปลี่ยนรหัสผ่าน
        </button>
      </div>
      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white text-sm font-medium transition-all animate-fade-in
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}  