import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import LocationSelectors from '@/components/servicedetail/LocationSelectors';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'next-i18next';

// โหลด AddressMapPicker แบบ dynamic (ไม่ SSR เพราะ Leaflet ต้องการ browser)
const AddressMapPicker = dynamic(
  () => import('@/components/servicedetail/AddressMapPicker'),
  { ssr: false, loading: () => <div className="w-full h-[280px] rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">Loading map / กำลังโหลดแผนที่...</div> }
);

interface UserProfileFormProps {
  user: any;
}

type Toast = { message: string; type: 'success' | 'error' } | null;

export default function UserProfileForm({ user }: UserProfileFormProps) {
  const router = useRouter();
  const { fetchUser } = useAuth();
  const { t } = useTranslation('common');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [toast, setToast] = useState<Toast>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [addressDetail, setAddressDetail] = useState('');
  const [subDistrict, setSubDistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [geocoding, setGeocoding] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!user) return;
    const fetchProfileData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await axios.get(`${API_URL}/api/users/${user.auth_user_id}/address`);
        if (response.data) {
          setEmail(response.data.email || user.email || '');
          setName(response.data.name || '');
          setUsername(response.data.username || '');
          setPhone(response.data.phone || '');
          setAddressDetail(response.data.address_line || '');
          setSubDistrict(response.data.sub_district || '');
          setDistrict(response.data.district || '');
          setProvince(response.data.province || '');
          setPostalCode(response.data.postal_code || '');
          if (response.data.latitude) setLatitude(parseFloat(response.data.latitude));
          if (response.data.longitude) setLongitude(parseFloat(response.data.longitude));
          if (response.data.profile_pic) setAvatarUrl(response.data.profile_pic);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfileData();
  }, [user]);

  // Reverse geocoding — ลากหมุดแล้วเติมที่อยู่อัตโนมัติ
  const handlePositionChange = useCallback(async (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=th`,
        { headers: { 'User-Agent': 'HomeServices-App' } }
      );
      const data = await res.json();
      const addr = data.address || {};

      // เติมที่อยู่อัตโนมัติจาก Nominatim
      const road = [addr.house_number, addr.road, addr.neighbourhood].filter(Boolean).join(' ');
      if (road) setAddressDetail(road);

      // แปลงชื่อจังหวัด (ตัด "จังหวัด" นำหน้าออก)
      const prov = (addr.state || addr.province || '').replace(/^จังหวัด/, '').trim();
      const dist = (addr.city || addr.county || addr.suburb || '').replace(/^(อำเภอ|เขต)/, '').trim();
      const subDist = (addr.quarter || addr.suburb || addr.village || '').replace(/^(ตำบล|แขวง)/, '').trim();
      const postal = addr.postcode || '';

      if (prov) setProvince(prov);
      if (dist) setDistrict(dist);
      if (subDist) setSubDistrict(subDist);
      if (postal) setPostalCode(postal);
    } catch (e) {
      console.error('Reverse geocoding failed:', e);
    } finally {
      setGeocoding(false);
    }
  }, []);

  // Forward geocoding — เลือก dropdown แล้วขยับหมุดไปตำแหน่งนั้น
  const geocodeAddress = useCallback(async (prov: string, dist: string, subDist: string) => {
    const query = [subDist, dist, prov, 'ประเทศไทย'].filter(Boolean).join(' ');
    if (!query.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=th&countrycodes=th`,
        { headers: { 'User-Agent': 'HomeServices-App' } }
      );
      const data = await res.json();
      if (data[0]) {
        setLatitude(parseFloat(data[0].lat));
        setLongitude(parseFloat(data[0].lon));
      }
    } catch (e) {
      console.error('Forward geocoding failed:', e);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince);
    setDistrict('');
    setSubDistrict('');
    if (newProvince) geocodeAddress(newProvince, '', '');
  };

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    setSubDistrict('');
    if (newDistrict) geocodeAddress(province, newDistrict, '');
  };

  const handleSaveProfile = async () => {
    if (!user || savingProfile) return;
    setSavingProfile(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('profileImage', selectedFile);
      formData.append('name', name || '');
      formData.append('username', username || '');
      formData.append('phone', phone || '');
      formData.append('address_line', addressDetail || '');
      formData.append('sub_district', subDistrict || '');
      formData.append('district', district || '');
      formData.append('province', province || '');
      formData.append('postal_code', postalCode || '');
      if (latitude != null) formData.append('latitude', String(latitude));
      if (longitude != null) formData.append('longitude', String(longitude));

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await axios.post(
        `${API_URL}/api/users/${user.auth_user_id}/update-profile`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.profilePicUrl) setAvatarUrl(response.data.profilePicUrl);

      await fetchUser(); // re-sync Navbar ให้แสดงรูปใหม่ทันที
      showToast(t('profile.msg_save_success', 'บันทึกข้อมูลสำเร็จ'), 'success');

      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (error: any) {
      showToast(t('profile.msg_save_error', 'เกิดข้อผิดพลาด: ') + error.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">

      <h2 className="text-xl font-semibold mb-6 text-gray-800">{t('profile.title_profile', 'ข้อมูลผู้ใช้งาน')}</h2>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.email_label', 'อีเมล (ไม่สามารถแก้ไขได้)')}</label>
            <input value={email} readOnly className="w-full h-[44px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.name_label', 'ชื่อ-นามสกุล')}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('profile.name_placeholder', 'ระบุชื่อ-นามสกุลของคุณ')} className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.username_label', 'ชื่อผู้ใช้งาน (Username)')}</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t('profile.username_placeholder', 'ระบุชื่อผู้ใช้งาน')} className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.phone_label', 'เบอร์โทรศัพท์')}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08X-XXX-XXXX" maxLength={10} className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start pt-4 border-t md:border-t-0 md:border-l border-gray-100 md:pl-10">
          <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center relative mb-4">
            {previewUrl || avatarUrl ? (
              <img src={previewUrl || avatarUrl || undefined} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <i className="fa-solid fa-image text-3xl mb-2"></i>
                <span className="text-sm">{t('profile.no_image', 'ไม่มีรูปภาพ')}</span>
              </div>
            )}
          </div>
          <label className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            {t('profile.btn_choose_image', 'เลือกรูปภาพใหม่')}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <p className="text-xs text-gray-500 mt-3 text-center">{t('profile.image_hint', '* รูปภาพจะอัปเดตเมื่อคุณกดปุ่ม "บันทึกข้อมูล"')}</p>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">{t('profile.address_title', 'ข้อมูลที่อยู่')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('profile.address_hint', 'ลากหมุดบนแผนที่เพื่อระบุตำแหน่ง หรือกรอกข้อมูลด้วยตนเอง')}</p>
        </div>

        <div className="space-y-5">
          {/* แผนที่ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">{t('profile.map_label', 'ระบุตำแหน่งบนแผนที่')}</label>
              {geocoding && <span className="text-xs text-blue-500 animate-pulse">{t('profile.searching_address', 'กำลังค้นหาที่อยู่...')}</span>}
            </div>
            <AddressMapPicker
              latitude={latitude}
              longitude={longitude}
              onPositionChange={handlePositionChange}
            />
            {latitude && longitude && (
              <p className="text-xs text-gray-400 mt-1">
                {t('profile.coords_prefix', 'พิกัด:')} {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.address_detail_label', 'รายละเอียดที่อยู่')}</label>
            <input
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              placeholder={t('profile.address_detail_placeholder', 'ระบุเลขที่, หมู่, ถนน, ซอย')}
              className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.postal_code', 'รหัสไปรษณีย์')}</label>
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder={t('profile.postal_code', 'รหัสไปรษณีย์')}
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
                onSubDistrictChange={(val) => {
                  setSubDistrict(val);
                  if (val) geocodeAddress(province, district, val);
                }}
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
          {savingProfile ? t('profile.btn_saving', 'กำลังบันทึก...') : t('profile.btn_save', 'บันทึกข้อมูล')}
        </button>

        <button
          onClick={() => router.push('/reset-password')}
          className="w-full sm:w-auto px-10 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-lock text-sm"></i>{t('profile.btn_change_password', 'เปลี่ยนรหัสผ่าน')}
        </button>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white text-sm font-medium transition-all
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}