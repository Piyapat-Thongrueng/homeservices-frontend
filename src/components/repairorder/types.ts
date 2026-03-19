export interface OrderType {
  id: number;
  display_id?: string;
  status: 'รอดำเนินการ' | 'กำลังดำเนินการ' | 'ดำเนินการสำเร็จ' | 'ยกเลิกคำสั่งซ่อม' | 'paid';
  date: string;
  worker: string;
  price: number;
  details: string[];

}
