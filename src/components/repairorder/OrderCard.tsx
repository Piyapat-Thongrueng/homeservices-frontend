import React from 'react';
import { Calendar, UserCircle } from 'lucide-react';
import { useRouter } from 'next/router';

import ChatBadge from '@/components/chat/ChatBadge';
import { useAuth } from '@/contexts/AuthContext';

interface OrderType {
  id: string; // ✅ UUID จริง (ใช้กับ backend)
  display_id?: string; // ✅ เอาไว้โชว์ ADxxxx
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'ดำเนินการสำเร็จ' | 'ยกเลิกคำสั่งซ่อม' | 'paid';
  date: string;
  worker: string;
  price: string;
  details: string[];
}

export default function OrderCard({ order }: { order: OrderType }) {

  const router = useRouter();

  const { state } = useAuth();
  const userId = state.user?.id?.toString() || "";

  // ✅ ใช้ display_id ถ้ามี ไม่งั้น fallback id
  const displayId = order.display_id || order.id;

  // ✅ เปิด chat เมื่อ paid (สำคัญ)
  const isChatAvailable = order.status === 'paid';

  const isCompleted = order.status === 'ดำเนินการสำเร็จ';

  let statusColor = 'bg-gray-200 text-gray-700';
  if (order.status === 'กำลังดำเนินการ') statusColor = 'bg-yellow-100 text-yellow-700';
  if (isCompleted) statusColor = 'bg-teal-100 text-teal-700';
  if (order.status === 'paid') statusColor = 'bg-green-100 text-green-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row justify-between gap-6">

      {/* LEFT */}
      <div className="space-y-3 flex-1">

        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          คำสั่งการซ่อมรหัส : {displayId}

          {/* ✅ แสดง badge เฉพาะตอน chat ใช้ได้ */}
          {userId && isChatAvailable && (
            <ChatBadge
              orderId={order.id} // ✅ UUID จริง
              userId={userId}
            />
          )}
        </h3>

        <div className="text-sm text-gray-500 space-y-1">

          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>
              {isCompleted
                ? 'วันเวลาดำเนินการสำเร็จ:'
                : 'วันเวลาดำเนินการ:'} {order.date}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <UserCircle size={16} />
            <span>พนักงาน: {order.worker}</span>
          </div>

        </div>
        
        <div className="pt-2">
          <p className="text-sm text-gray-500 mb-1">รายการ:</p>
          <ul className="text-sm text-gray-800">
            {order.details.map((detail, index) => (
              <li key={index}>• {detail}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-start lg:items-end justify-between min-w-[200px]">

        <div className="flex items-center gap-2 w-full justify-between lg:justify-end mb-4 lg:mb-0">
          <span className="text-sm text-gray-500">สถานะ:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {order.status}
          </span>
        </div>
        
        <div className="flex items-center gap-2 w-full justify-between lg:justify-end mt-2 lg:mt-0">
          <span className="text-sm text-gray-500">ราคารวม:</span>
          <span className="text-lg font-bold text-gray-900">{order.price} ฿</span>
        </div>

        {/* ✅ ปุ่มดูรายละเอียด + chat */}
        {!isCompleted && (
          <button
            onClick={() => router.push(`/orders/${order.id}?role=user`)}
            className="mt-4 w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            ดูรายละเอียด
          </button>
        )}

      </div>
    </div>
  );
}