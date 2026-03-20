import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'next-i18next';
import ProfileImageMockCarousel from '@/features/profile/ProfileImageMockCarousel';
import ImageCropModal from '@/features/profile/ImageCropModal';

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

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync text fields when server data changes — not on every new `user` object reference
  useEffect(() => {
    if (!user) return;
    setEmail(user.email || '');
    setName(user.full_name || '');
    setUsername(user.username || user.email?.split('@')[0] || '');
    setPhone(user.phone || '');
  }, [
    user?.id,
    user?.email,
    user?.full_name,
    user?.username,
    user?.phone,
  ]);

  // Server avatar only when there is no local preview blob (avoid clobbering mock/upload preview).
  useEffect(() => {
    if (!user) return;
    if (previewUrl) return;
    setAvatarUrl(user.profile_pic || null);
  }, [user?.id, user?.profile_pic, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsEditOpen(false);
    }
  };

  const handleRemovePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditOpen(false);
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

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await axios.post(
        `${API_URL}/api/users/${user.auth_user_id}/update-profile`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      const newPic = response.data?.profilePicUrl as string | undefined;
      if (newPic) {
        setAvatarUrl(`${newPic.split('?')[0]}?t=${Date.now()}`);
      }

      await fetchUser();
      showToast(t('profile.msg_save_success', 'บันทึกข้อมูลสำเร็จ'), 'success');

      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setIsEditOpen(false);
    } catch (error: any) {
      const serverError =
        error?.response?.data?.error ||
        error?.response?.data?.details ||
        error?.response?.data?.message;

      showToast(
        t('profile.msg_save_error', 'เกิดข้อผิดพลาด: ') + (serverError ?? error.message),
        'error',
      );
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {t('profile.title_profile', 'ข้อมูลผู้ใช้งาน')}
      </h2>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.email_label', 'อีเมล (ไม่สามารถแก้ไขได้)')}
            </label>
            <input
              value={email}
              readOnly
              className="w-full h-[44px] px-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.name_label', 'ชื่อ-นามสกุล')}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profile.name_placeholder', 'ระบุชื่อ-นามสกุลของคุณ')}
              className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.username_label', 'ชื่อผู้ใช้งาน (Username)')}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('profile.username_placeholder', 'ระบุชื่อผู้ใช้งาน')}
              className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.phone_label', 'เบอร์โทรศัพท์')}
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08X-XXX-XXXX"
              maxLength={10}
              className="w-full h-[44px] px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start pt-4 border-t md:border-t-0 md:border-l border-gray-100 md:pl-10">
          <ProfileImageMockCarousel
            avatarUrl={avatarUrl}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            setSelectedFile={setSelectedFile}
            isEditOpen={isEditOpen}
            onRequestOpenEditor={() => setIsEditOpen(true)}
            onRequestCloseEditor={() => setIsEditOpen(false)}
            onRemovePreview={handleRemovePreview}
          />

          {previewUrl && (
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="mb-3 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer text-sm font-medium"
            >
              แก้ไขรูปภาพ
            </button>
          )}

          <label className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2 cursor-pointer">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            {t('profile.btn_choose_image', 'เลือกรูปภาพใหม่')}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <p className="text-xs text-gray-500 mt-3 text-center">
            {t('profile.image_hint', '* รูปภาพจะอัปเดตเมื่อคุณกดปุ่ม "บันทึกข้อมูล"')}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
        <button
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="btn-primary bg-blue-600 text-white w-full sm:w-auto px-10 py-2.5 rounded-lg font-medium shadow-sm transition-all hover:bg-blue-700 hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {savingProfile
            ? t('profile.btn_saving', 'กำลังบันทึก...')
            : t('profile.btn_save', 'บันทึกข้อมูล')}
        </button>

        <button
          type="button"
          onClick={() => router.push('/reset-password')}
          className="w-full sm:w-auto px-10 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <i className="fa-solid fa-lock text-sm"></i>
          {t('profile.btn_change_password', 'เปลี่ยนรหัสผ่าน')}
        </button>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-white text-sm font-medium transition-all
          ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {isEditOpen && previewUrl && selectedFile && (
        <ImageCropModal
          previewUrl={previewUrl}
          selectedFile={selectedFile}
          onClose={() => setIsEditOpen(false)}
          onCropped={(croppedFile, newPreviewUrl) => {
            setSelectedFile(croppedFile);
            setPreviewUrl(newPreviewUrl);
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
}
