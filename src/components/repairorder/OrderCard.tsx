import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, UserCircle, MapPin, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

import ChatBadge from '@/components/chat/ChatBadge';
import { useAuth } from '@/contexts/AuthContext';

interface OrderType {
  id: number;
  display_id?: string;
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'ดำเนินการสำเร็จ' | 'ยกเลิกคำสั่งซ่อม' | 'paid';
  date: string;
  worker: string;
  price: number;
  details: string[];
}

interface OrderDetail {
  id: number;
  status: string;
  created_at: string;
  total_price: number;
  net_price: number;
  services: string[];
  appointment_date: string | null;
  appointment_time: string | null;
  address_line: string | null;
  district: string | null;
  province: string | null;
  postal_code: string | null;
  technician_name: string | null;
  technician_phone: string | null;
}

function OrderDetailModal({ orderId, onClose }: { orderId: number; onClose: () => void }) {
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchDetail = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await axios.get(`${API_URL}/api/orders/${orderId}`);
        setDetail(res.data);
      } catch {
        setError('ไม่สามารถโหลดรายละเอียดได้');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [orderId]);

  const statusColor = () => {
    if (!detail) return 'bg-gray-100 text-gray-600';
    const s = detail.status;
    if (s === 'pending' || s === 'รอดำเนินการ') return 'bg-gray-100 text-gray-700';
    if (s === 'in_progress' || s === 'กำลังดำเนินการ') return 'bg-yellow-100 text-yellow-700';
    if (s === 'completed' || s === 'ดำเนินการสำเร็จ') return 'bg-teal-100 text-teal-700';
    if (s === 'cancelled' || s === 'ยกเลิกคำสั่งซ่อม') return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };

  const thaiStatus = (s: string) => {
    if (s === 'pending') return 'รอดำเนินการ';
    if (s === 'in_progress') return 'กำลังดำเนินการ';
    if (s === 'completed') return 'ดำเนินการสำเร็จ';
    if (s === 'cancelled') return 'ยกเลิกคำสั่งซ่อม';
    return s;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">รายละเอียดคำสั่งซ่อม</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          )}

          {error && <p className="text-center text-red-500 py-8">{error}</p>}

          {detail && (
            <div className="space-y-5">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-400">รหัสคำสั่งซ่อม</p>
                  <p className="text-xl font-bold">AD{String(detail.id).padStart(8, '0')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${statusColor()}`}>
                  {thaiStatus(detail.status)}
                </span>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex gap-3">
                <Calendar size={16} />
                <div>
                  <p className="text-sm">{formatDate(detail.created_at)}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <UserCircle size={16} />
                <div>
                  <p>{detail.technician_name || 'ยังไม่ระบุช่าง'}</p>
                </div>
              </div>

              {(detail.address_line || detail.province) && (
                <div className="flex gap-3">
                  <MapPin size={16} />
                  <p>
                    {[detail.address_line, detail.district, detail.province, detail.postal_code]
                      .filter(Boolean)
                      .join(' ')}
                  </p>
                </div>
              )}

              <div className="h-px bg-gray-100" />

              <ul>
                {(detail.services || []).map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>

              <div className="flex justify-between">
                <span>ราคารวม</span>
                <span>{(detail.net_price ?? detail.total_price ?? 0).toLocaleString()} ฿</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t">
          <button onClick={onClose} className="w-full py-2 border rounded-lg">
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderCard({ order }: { order: OrderType }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const { state } = useAuth();
  const userId = state.user?.id?.toString() || "";

  const isChatAvailable = order.status === 'paid';
  const isCompleted = order.status === 'ดำเนินการสำเร็จ';

  let statusColor = 'bg-gray-200 text-gray-700';

  if (order.status === 'กำลังดำเนินการ') {
    statusColor = 'bg-yellow-100 text-yellow-700';
  }
  if (isCompleted) {
    statusColor = 'bg-teal-100 text-teal-700';
  }
  if (order.status === 'ยกเลิกคำสั่งซ่อม') {
    statusColor = 'bg-red-100 text-red-600';
  }
  if (order.status === 'paid') {
    statusColor = 'bg-green-100 text-green-700';
  }

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-sm border p-6 flex justify-between">
        <div>
          <h3 className="font-bold">คำสั่งการซ่อมรหัส : {order.id}</h3>
          <p>{order.date}</p>
          <p>{order.worker}</p>

          <ul>
            {order.details.map((d, i) => (
              <li key={i}>• {d}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start lg:items-end justify-between min-w-[200px]">
          <div className="flex items-center gap-2 w-full justify-between lg:justify-end mb-4 lg:mb-0">
            <span className="text-sm text-gray-500">สถานะ:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {order.status}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full justify-between lg:justify-end mt-2 lg:mt-0">
            <span className="text-sm text-gray-500">ราคารวม:</span>
            <span className="text-lg font-bold text-gray-900">
              {order.price.toLocaleString('th-TH')} ฿
            </span>
          </div>

          {!isCompleted && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              ดูรายละเอียด
            </button>
          )}
        </div>

        {/* CHAT */}
        {userId && isChatAvailable && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => router.push(`/chat/${order.id}`)}
              className="relative w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
            >
              💬
              <div className="absolute -top-1 -right-1">
              <ChatBadge orderId={order.id.toString()} userId={userId} />

              </div>
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <OrderDetailModal
          orderId={order.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}