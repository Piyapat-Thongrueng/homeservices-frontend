import { X, ShieldCheck } from "lucide-react";

interface PrivacyModalProps {
  onClose: () => void;
}

export default function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-green-600" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-gray-900">
                นโยบายความเป็นส่วนตัว
              </h2>
              <p className="text-[12px] text-gray-400">
                HomeService Demo Application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 text-[13px] text-gray-600 leading-relaxed font-prompt">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-[12px] text-green-700 font-medium">
              🔒 เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ
              ข้อมูลที่เก็บรวบรวมมีเพียงเท่าที่จำเป็นสำหรับการสาธิตระบบเท่านั้น
            </p>
          </div>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              1. ข้อมูลที่เก็บรวบรวม
            </h3>
            <p>เราเก็บรวบรวมข้อมูลต่อไปนี้เมื่อคุณลงทะเบียนและใช้งานแอปพลิเคชัน:</p>
            <ul className="mt-2 space-y-1 pl-4">
              {[
                "ชื่อ - นามสกุล",
                "อีเมลแอดเดรส",
                "เบอร์โทรศัพท์",
                "ที่อยู่สำหรับการบริการ",
                "ข้อมูลการจองบริการ",
                "ข้อมูลการชำระเงิน (เฉพาะข้อมูลที่จำเป็น)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              2. วัตถุประสงค์การใช้ข้อมูล
            </h3>
            <p>ข้อมูลที่เก็บรวบรวมใช้เพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
            <ul className="mt-2 space-y-1 pl-4">
              {[
                "การสาธิตระบบการจองบริการ",
                "การทดสอบฟีเจอร์ต่างๆ ของแอปพลิเคชัน",
                "การพัฒนาและปรับปรุงประสบการณ์ผู้ใช้",
                "การติดต่อสื่อสารเกี่ยวกับบริการ",
                "การวิเคราะห์และปรับปรุงระบบ",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              3. การเก็บรักษาข้อมูล
            </h3>
            <p>
              ข้อมูลของคุณถูกจัดเก็บบน Supabase
              ซึ่งมีมาตรการความปลอดภัยตามมาตรฐานสากล รวมถึง:
            </p>
            <ul className="mt-2 space-y-1 pl-4">
              {[
                "การเข้ารหัสข้อมูลระหว่างการส่ง (SSL/TLS)",
                "การเข้ารหัสข้อมูลที่จัดเก็บ",
                "การควบคุมการเข้าถึงข้อมูลอย่างเข้มงวด",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-2">
              เราไม่มีการแชร์ ขาย หรือเปิดเผยข้อมูลของคุณให้บุคคลภายนอกโดยเด็ดขาด
              ยกเว้นกรณีที่กฎหมายกำหนด
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              4. สิทธิ์ของคุณ
            </h3>
            <p>ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) คุณมีสิทธิ์ดังต่อไปนี้:</p>
            <ul className="mt-2 space-y-1 pl-4">
              {[
                "สิทธิ์ในการเข้าถึง - ขอดูข้อมูลส่วนตัวที่เราเก็บไว้",
                "สิทธิ์ในการแก้ไข - ขอแก้ไขข้อมูลที่ไม่ถูกต้อง",
                "สิทธิ์ในการลบ - ขอลบบัญชีและข้อมูลทั้งหมด",
                "สิทธิ์ในการโอนย้าย - ขอรับข้อมูลในรูปแบบที่อ่านได้",
                "สิทธิ์ในการเพิกถอนความยินยอม - ถอนความยินยอมได้ทุกเมื่อ",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              5. คุกกี้และ Local Storage
            </h3>
            <p>
              แอปพลิเคชันใช้ Local Storage เพื่อเก็บ token สำหรับการยืนยันตัวตน
              และ Session Storage สำหรับข้อมูลชั่วคราวระหว่างการใช้งาน
              ไม่มีการใช้คุกกี้เพื่อติดตามพฤติกรรมการใช้งานของคุณ
              หรือเพื่อวัตถุประสงค์ทางการตลาด
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              6. ระยะเวลาการเก็บรักษาข้อมูล
            </h3>
            <p>
              เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณตราบเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่ระบุไว้
              หรือตามที่กฎหมายกำหนด เมื่อคุณลบบัญชี
              ข้อมูลของคุณจะถูกลบออกจากระบบภายใน 30 วัน
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              7. การเปลี่ยนแปลงนโยบาย
            </h3>
            <p>
              เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
              การเปลี่ยนแปลงที่สำคัญจะแจ้งให้ทราบผ่านอีเมลหรือประกาศในแอปพลิเคชัน
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              8. ติดต่อเรา
            </h3>
            <p>
              หากต้องการใช้สิทธิ์ข้างต้นหรือมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว
              สามารถติดต่อได้ที่ privacy@homeservices.co หรือโทร 080-540-6357
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full h-10 bg-green-600 hover:bg-green-700 text-white text-[13px] font-semibold rounded-xl transition-colors cursor-pointer"
          >
            รับทราบและปิด
          </button>
        </div>
      </div>
    </div>
  );
}
