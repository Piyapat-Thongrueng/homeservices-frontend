import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationSelectors from '@/components/servicedetail/LocationSelectors';

interface UserProfileFormProps {
  user: any; // รับข้อมูล user มาจากไฟล์หลัก
}

export default function UserProfileForm({ user }: UserProfileFormProps) {
  // State จัดการรูปภาพ
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // State จัดการที่อยู่
  const [addressDetail, setAddressDetail] = useState('');
  const [subDistrict, setSubDistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // 1. ดึงข้อมูลตอนเปิดหน้าเว็บ
  useEffect(() => {
    if (!user) return;
    const fetchProfileData = async () => {
      try {
        const API_URL = "http://localhost:4000";
        const response = await axios.get(`${API_URL}/api/users/${user.id}/address`);
        if (response.data) {
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

  // 2. จัดการเมื่อเลือกไฟล์รูปใหม่
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 3. ฟังก์ชันบันทึกข้อมูล
  const handleSaveProfile = async () => {
    if (!user || savingProfile) return;
    setSavingProfile(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append("profileImage", selectedFile); 
      formData.append("address_line", addressDetail);
      formData.append("sub_district", subDistrict);
      formData.append("district", district);
      formData.append("province", province);
      formData.append("postal_code", postalCode);

      const API_URL = 'http://localhost:4000';
      const response = await axios.post(`${API_URL}/api/users/${user.id}/update-profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.profilePicUrl) {
        setAvatarUrl(response.data.profilePicUrl);
      }
      
      alert("บันทึกข้อมูลและรูปโปรไฟล์สำเร็จ ✅");
      
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (error: any) {
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">ข้อมูลส่วนตัว</h2>
      
      {/* ส่วนรูปภาพโปรไฟล์ */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-gray-300">
          <img 
            src={previewUrl || avatarUrl || "/images/default-avatar.png"} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "/images/default-avatar.png"; }}
          />
        </div>
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <label className="text-sm font-medium text-gray-700">รูปภาพโปรไฟล์</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-400">ขนาดรูปภาพที่แนะนำ: 200x200px (รองรับ .jpg, .png)</p>
        </div>
      </div>

      {/* ส่วนที่อยู่ */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">ที่อยู่ปัจจุบัน</h3>
        <LocationSelectors 
          province={province} setProvince={setProvince}
          district={district} setDistrict={setDistrict}
          subDistrict={subDistrict} setSubDistrict={setSubDistrict}
          postalCode={postalCode} setPostalCode={setPostalCode}
        />
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดที่อยู่ (บ้านเลขที่, ซอย, ถนน)</label>
          <textarea 
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            rows={3}
            placeholder="กรอกรายละเอียดที่อยู่..."
          />
        </div>
      </div>

      {/* ปุ่มบันทึก */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all shadow-sm ${
            savingProfile ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
          }`}
        >
          {savingProfile ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
        </button>
      </div>
    </div>
  );
}