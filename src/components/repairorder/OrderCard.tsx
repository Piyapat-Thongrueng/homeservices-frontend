import React from 'react';
import { Calendar, UserCircle } from 'lucide-react';

interface OrderType {
  id: number;
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'ดำเนินการสำเร็จ' | 'ยกเลิกคำสั่งซ่อม';
  date: string;
  worker: string;
  price: number;
  details: string[];
}

export default function OrderCard({ order }: { order: OrderType }) {
  const isCompleted = order.status === 'ดำเนินการสำเร็จ';

  // กำหนดสีของป้ายสถานะ
  let statusColor = 'bg-gray-200 text-gray-700'; // รอดำเนินการ
  if (order.status === 'กำลังดำเนินการ') statusColor = 'bg-yellow-100 text-yellow-700';
  if (isCompleted) statusColor = 'bg-teal-100 text-teal-700';
  if (order.status === 'ยกเลิกคำสั่งซ่อม') statusColor = 'bg-red-100 text-red-600';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row justify-between gap-6">
      {/* รายละเอียด */}
      <div className="space-y-3 flex-1">
        <h3 className="text-lg font-bold text-gray-900">คำสั่งการซ่อมรหัส : AD{String(order.id).padStart(8, '0')}</h3>
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {/* เปลี่ยนคำตามสถานะ */}
            <span>{isCompleted ? 'วันเวลาดำเนินการสำเร็จ:' : 'วันเวลาดำเนินการ:'} {order.date}</span>
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

      {/* สถานะ และ ราคา */}
      <div className="flex flex-col items-start lg:items-end justify-between min-w-[200px]">
        <div className="flex items-center gap-2 w-full justify-between lg:justify-end mb-4 lg:mb-0">
          <span className="text-sm text-gray-500">สถานะ:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {order.status}
          </span>
        </div>
        
        <div className="flex items-center gap-2 w-full justify-between lg:justify-end mt-2 lg:mt-0">
           <span className="text-sm text-gray-500">ราคารวม:</span>
           <span className="text-lg font-bold text-gray-900">{order.price.toLocaleString('th-TH')} ฿</span>
        </div>

        {/* ซ่อนปุ่มถ้าซ่อมเสร็จแล้ว */}
        {!isCompleted && (
          <button className="mt-4 w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            ดูรายละเอียด
          </button>
        )}
      </div>
    </div>
  );
}