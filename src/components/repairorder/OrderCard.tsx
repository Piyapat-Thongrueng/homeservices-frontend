import React, { useState } from 'react';
import { Calendar, UserCircle, MapPin, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { getOrderDetail, type OrderDetailResponse } from '@/services/paymentApi';

interface OrderType {
  id: number;
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'ดำเนินการสำเร็จ' | 'ยกเลิกคำสั่งซ่อม';
  date: string;
  worker: string;
  price: number;
  details: string[];
}

function OrderDetailModal({ orderId, onClose }: { orderId: number; onClose: () => void }) {
  const { t } = useTranslation('common');
  const [detail, setDetail] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getOrderDetail(orderId);
        setDetail(data);
      } catch {
        setError(t('order.error_load', 'ไม่สามารถโหลดรายละเอียดได้'));
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

  const translatedStatus = (s: string) => {
    if (s === 'pending' || s === 'รอดำเนินการ') return t('order.status_pending', 'รอดำเนินการ');
    if (s === 'in_progress' || s === 'กำลังดำเนินการ') return t('order.status_in_progress', 'กำลังดำเนินการ');
    if (s === 'completed' || s === 'ดำเนินการสำเร็จ') return t('order.status_completed', 'ดำเนินการสำเร็จ');
    if (s === 'cancelled' || s === 'ยกเลิกคำสั่งซ่อม') return t('order.status_cancelled', 'ยกเลิกคำสั่งซ่อม');
    return s;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const formatAppointmentDateTime = (appointmentDate: string, appointmentTime: string | null) => {
    const datePart = appointmentDate.split('T')[0];
    if (appointmentTime) {
      const hhmm = appointmentTime.slice(0, 5);
      return formatDate(`${datePart}T${hhmm}:00`);
    }
    return formatDate(appointmentDate);
  };

  const formatServiceAddress = (
    addressLine: string | null,
    subdistrict: string | null,
    district: string | null,
    province: string | null,
    postalCode: string | null,
  ) => {
    const base = (addressLine ?? '').trim();
    const baseCompact = base.replace(/\s+/g, ' ').trim();
    const extras = [subdistrict, district, province, postalCode]
      .map((part) => (part ?? '').trim())
      .filter(Boolean)
      .filter((part) => !baseCompact.includes(part));

    return [baseCompact, ...extras].filter(Boolean).join(' ').trim();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {t('order.modal_title', 'รายละเอียดคำสั่งซ่อม')}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          )}
          {error && (
            <p className="text-center text-red-500 py-8">{error}</p>
          )}
          {detail && (
            <div className="space-y-5">
              {/* รหัสและสถานะ */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">{t('order.order_id', 'รหัสคำสั่งซ่อม')}</p>
                  <p className="text-xl font-bold text-gray-900">
                    AD{String(detail.id).padStart(8, '0')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium mt-1 ${statusColor()}`}>
                  {translatedStatus(detail.status)}
                </span>
              </div>

              <div className="h-px bg-gray-100" />

              {/* วันที่ */}
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t('order.order_date', 'วันที่สั่งซ่อม')}</p>
                  <p className="text-sm text-gray-800">{formatDate(detail.created_at)}</p>
                  {detail.appointment_date && (
                    <p className="text-sm text-blue-600 mt-1">
                      {t('order.appointment', 'นัดหมาย:')} {formatAppointmentDateTime(detail.appointment_date, detail.appointment_time)}
                    </p>
                  )}
                </div>
              </div>

              {/* ช่าง */}
              <div className="flex items-start gap-3">
                <UserCircle size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t('order.technician', 'ช่างผู้รับงาน')}</p>
                  <p className="text-sm text-gray-800">
                    {detail.technician_name || t('order.tech_unassigned', 'ยังไม่ระบุช่าง')}
                  </p>
                  {detail.technician_phone && (
                    <p className="text-sm text-gray-500">{detail.technician_phone}</p>
                  )}
                </div>
              </div>

              {/* ที่อยู่ */}
              {(detail.address_line || detail.province) && (
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{t('order.service_address', 'ที่อยู่นัดซ่อม')}</p>
                    <p className="text-sm text-gray-800">
                      {formatServiceAddress(
                        detail.address_line,
                        detail.subdistrict,
                        detail.district,
                        detail.province,
                        detail.postal_code,
                      )}
                    </p>
                  </div>
                </div>
              )}

              {detail.remark && (
                <div className="flex items-start gap-3">
                  <div className="w-4 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{t('payment_confirm.note', 'หมายเหตุ')}</p>
                    <p className="text-sm text-gray-800">{detail.remark}</p>
                  </div>
                </div>
              )}

              <div className="h-px bg-gray-100" />

              {/* รายการบริการ */}
              <div>
                <p className="text-xs text-gray-400 mb-2">{t('order.service_items', 'รายการบริการ')}</p>
                <ul className="space-y-2">
                  {(detail.items || []).length > 0
                    ? detail.items.map((item, i) => (
                        <li key={`${item.serviceId}-${item.serviceItemId ?? 'base'}-${i}`} className="flex items-center justify-between text-sm gap-3">
                          <span className="text-gray-800">
                            • {item.name} ({item.quantity}{item.unit ? ` ${item.unit}` : ''})
                          </span>
                          <span className="text-gray-600 shrink-0">
                            {(item.price * item.quantity).toLocaleString('th-TH')} ฿
                          </span>
                        </li>
                      ))
                    : (detail.services || []).map((s, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="text-gray-800">• {s}</span>
                        </li>
                      ))}
                  {detail.promotion_code && detail.discount_amount > 0 && (
                    <li className="flex items-center justify-between text-sm gap-3">
                      <span className="text-red-600">
                        • Promotion Code: {detail.promotion_code}
                      </span>
                      <span className="text-red-600 shrink-0">
                        - {detail.discount_amount.toFixed(2)} ฿
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="h-px bg-gray-100" />

              {/* ราคา */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{t('order.total_price', 'ราคารวมทั้งหมด')}</span>
                <span className="text-xl font-bold text-gray-900">
                  {(detail.net_price ?? detail.total_price ?? 0).toLocaleString('th-TH')} ฿
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {t('order.btn_close', 'ปิด')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderCard({ order }: { order: OrderType }) {
  const { t } = useTranslation('common');
  const [showModal, setShowModal] = useState(false);
  const isCompleted = order.status === 'ดำเนินการสำเร็จ';

  let statusColor = 'bg-gray-200 text-gray-700';
  if (order.status === 'กำลังดำเนินการ') statusColor = 'bg-yellow-100 text-yellow-700';
  if (isCompleted) statusColor = 'bg-teal-100 text-teal-700';
  if (order.status === 'ยกเลิกคำสั่งซ่อม') statusColor = 'bg-red-100 text-red-600';

  const translatedStatus = (s: string) => {
    if (s === 'pending' || s === 'รอดำเนินการ') return t('order.status_pending', 'รอดำเนินการ');
    if (s === 'in_progress' || s === 'กำลังดำเนินการ') return t('order.status_in_progress', 'กำลังดำเนินการ');
    if (s === 'completed' || s === 'ดำเนินการสำเร็จ') return t('order.status_completed', 'ดำเนินการสำเร็จ');
    if (s === 'cancelled' || s === 'ยกเลิกคำสั่งซ่อม') return t('order.status_cancelled', 'ยกเลิกคำสั่งซ่อม');
    return s;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col lg:flex-row justify-between gap-6">
        <div className="space-y-3 flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {t('order.order_id_prefix', 'คำสั่งการซ่อมรหัส :')} AD{String(order.id).padStart(8, '0')}
          </h3>
          <div className="text-sm text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{isCompleted ? t('order.completed_datetime', 'วันเวลาดำเนินการสำเร็จ:') : t('order.service_datetime', 'วันเวลาดำเนินการ:')} {order.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCircle size={16} />
              <span>{t('order.staff', 'พนักงาน:')} {order.worker}</span>
            </div>
          </div>
          <div className="pt-2">
            <p className="text-sm text-gray-500 mb-1">{t('order.items_label', 'รายการ:')}</p>
            <ul className="text-sm text-gray-800">
              {order.details.map((detail, index) => (
                <li key={index}>• {detail}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start lg:items-end justify-between min-w-[200px]">
          <div className="flex items-center gap-2 w-full justify-between lg:justify-end mb-4 lg:mb-0">
            <span className="text-sm text-gray-500">{t('order.status_label', 'สถานะ:')}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {translatedStatus(order.status)}
            </span>
          </div>
          <div className="flex items-center gap-2 w-full justify-between lg:justify-end mt-2 lg:mt-0">
            <span className="text-sm text-gray-500">{t('order.total_label', 'ราคารวม:')}</span>
            <span className="text-lg font-bold text-gray-900">
              {order.price.toLocaleString('th-TH')} ฿
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t('order.btn_view_details', 'ดูรายละเอียด')}
          </button>
        </div>
      </div>

      {showModal && (
        <OrderDetailModal orderId={order.id} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}