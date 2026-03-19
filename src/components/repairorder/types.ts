export interface OrderType {
  id: number;
  status: "รอดำเนินการ" | "กำลังดำเนินการ" | "ดำเนินการสำเร็จ" | "ยกเลิกคำสั่งซ่อม";
  date: string;
  worker: string;
  price: number;
  details: string[];
}
