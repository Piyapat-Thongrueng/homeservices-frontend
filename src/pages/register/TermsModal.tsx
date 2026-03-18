import { X, FileText } from "lucide-react";
import { useRouter } from "next/router";

interface TermsModalProps {
  onClose: () => void;
}

export default function TermsModal({ onClose }: TermsModalProps) {
  const { locale } = useRouter();
  const isEn = locale === "en";

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
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-gray-900">
                {isEn ? "Terms and Conditions" : "ข้อตกลงและเงื่อนไข"}
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
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-[12px] text-amber-700 font-medium">
              {isEn 
                ? "⚠️ This application is a Demo project built for educational purposes only. It is not a real commercial service."
                : "⚠️ แอปพลิเคชันนี้เป็นโปรเจกต์สาธิต (Demo) จัดทำเพื่อวัตถุประสงค์ทางการศึกษาเท่านั้น ไม่ใช่บริการเชิงพาณิชย์จริง"}
            </p>
          </div>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              {isEn ? "1. Acceptance of Terms" : "1. การยอมรับข้อตกลง"}
            </h3>
            <p>
              {isEn 
                ? "By registering or using the HomeService Demo, you agree to these terms and conditions. If you do not agree, please stop using the application. This agreement is legally binding between you and the HomeService development team."
                : "การลงทะเบียนหรือใช้งาน HomeService Demo ถือว่าคุณยอมรับข้อตกลงและเงื่อนไขการใช้งานฉบับนี้ หากคุณไม่ยอมรับ กรุณาหยุดการใช้งานแอปพลิเคชัน ข้อตกลงนี้มีผลผูกพันทางกฎหมายระหว่างคุณและทีมพัฒนา HomeService"}
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              {isEn ? "2. Purpose of Use" : "2. วัตถุประสงค์การใช้งาน"}
            </h3>
            <p>
              {isEn 
                ? "This application is created to demonstrate a home repair booking system. All information shown is fictitious. No actual services will be provided, including:"
                : "แอปพลิเคชันนี้จัดทำขึ้นเพื่อสาธิตระบบการจองบริการซ่อมแซมที่พักอาศัย ข้อมูลทั้งหมดที่แสดงในระบบเป็นข้อมูลสมมติ ไม่มีการให้บริการจริงเกิดขึ้น รวมถึง:"}
            </p>
            <ul className="mt-2 space-y-1 pl-4">
              {(isEn ? [
                "Service lists and prices are sample data",
                "Service booking is entirely simulated",
                "No actual charges will be made",
                "There are no real technicians or service providers",
              ] : [
                "รายการบริการและราคาเป็นข้อมูลตัวอย่าง",
                "การจองบริการเป็นการจำลองเท่านั้น",
                "ไม่มีการเรียกเก็บเงินจริง",
                "ไม่มีช่างหรือผู้ให้บริการจริง",
              ]).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              {isEn ? "3. User Accounts" : "3. บัญชีผู้ใช้"}
            </h3>
            <p>
              {isEn 
                ? "You are responsible for the security of your account and password. Please do not disclose your login information to others. The development team reserves the right to suspend accounts that behave inappropriately, including the following actions:"
                : "คุณรับผิดชอบในการรักษาความปลอดภัยของบัญชีและรหัสผ่านของตนเอง กรุณาอย่าเปิดเผยข้อมูลการเข้าสู่ระบบให้ผู้อื่นทราบ ทีมพัฒนาขอสงวนสิทธิ์ในการระงับบัญชีที่มีพฤติกรรมไม่เหมาะสม รวมถึงการกระทำดังต่อไปนี้:"}
            </p>
            <ul className="mt-2 space-y-1 pl-4">
              {(isEn ? [
                "Attempting to access the system without authorization",
                "Use that may cause damage to the system",
                "Impersonating another person",
                "Using false information during registration",
              ] : [
                "การพยายามเข้าถึงระบบโดยไม่ได้รับอนุญาต",
                "การใช้งานที่อาจก่อให้เกิดความเสียหายต่อระบบ",
                "การแอบอ้างเป็นบุคคลอื่น",
                "การใช้ข้อมูลเท็จในการลงทะเบียน",
              ]).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              {isEn ? "4. Intellectual Property" : "4. ทรัพย์สินทางปัญญา"}
            </h3>
            <p>
              {isEn 
                ? "All content, designs, logos, and components of this application are the intellectual property of the HomeService development team. Do not copy, modify, or use for commercial purposes without permission."
                : "เนื้อหา การออกแบบ โลโก้ และส่วนประกอบทั้งหมดของแอปพลิเคชันนี้ เป็นทรัพย์สินทางปัญญาของทีมพัฒนา HomeService ห้ามทำซ้ำ ดัดแปลง หรือนำไปใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาต"}
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              {isEn ? "5. Disclaimer of Liability" : "5. ข้อจำกัดความรับผิดชอบ"}
            </h3>
            <p>
              {isEn 
                ? "Since it is a Demo Application, the development team does not guarantee continuous service availability and is not liable for any damages that may arise from using this application, including:"
                : "เนื่องจากเป็น Demo Application ทีมพัฒนาไม่รับประกันความต่อเนื่องของการให้บริการ และไม่รับผิดชอบต่อความเสียหายใดๆ ที่อาจเกิดขึ้นจากการใช้งานแอปพลิเคชันนี้ รวมถึง:"}
            </p>
            <ul className="mt-2 space-y-1 pl-4">
              {(isEn ? [
                "Loss of data",
                "Service interruption",
                "Technical errors",
                "Indirect or special damages",
              ] : [
                "การสูญหายของข้อมูล",
                "การหยุดชะงักของบริการ",
                "ข้อผิดพลาดทางเทคนิค",
                "ความเสียหายทางอ้อมหรือความเสียหายพิเศษ",
              ]).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              {isEn ? "6. Modifications to This Agreement" : "6. การเปลี่ยนแปลงข้อตกลง"}
            </h3>
            <p>
              {isEn 
                ? "The development team reserves the right to amend the terms and conditions at any time without prior notice. Continued use after changes implies your acceptance of the new agreement. We recommend checking this page periodically."
                : "ทีมพัฒนาขอสงวนสิทธิ์ในการแก้ไขข้อตกลงและเงื่อนไขได้ทุกเมื่อโดยไม่ต้องแจ้งล่วงหน้า การใช้งานต่อเนื่องหลังจากมีการเปลี่ยนแปลงถือว่าคุณยอมรับข้อตกลงใหม่ เราแนะนำให้คุณตรวจสอบหน้านี้เป็นระยะเพื่อติดตามการเปลี่ยนแปลง"}
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              {isEn ? "7. Governing Law" : "7. กฎหมายที่ใช้บังคับ"}
            </h3>
            <p>
              {isEn 
                ? "This agreement is governed by the laws of the Kingdom of Thailand. Any disputes arising shall be under the jurisdiction of Thai courts."
                : "ข้อตกลงนี้อยู่ภายใต้กฎหมายของราชอาณาจักรไทย ข้อพิพาทใดๆ ที่เกิดขึ้นจะอยู่ในเขตอำนาจศาลไทย"}
            </p>
          </section>

          <section>
            <h3 className="text-[14px] font-semibold text-gray-800 mb-2">
              {isEn ? "8. Contact Us" : "8. ติดต่อเรา"}
            </h3>
            <p>
              {isEn 
                ? "If you have questions about this agreement, you can contact the development team at contact@homeservices.co or call 080-540-6357"
                : "หากมีคำถามเกี่ยวกับข้อตกลงนี้ สามารถติดต่อทีมพัฒนาได้ที่ contact@homeservices.co หรือโทร 080-540-6357"}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {isEn ? "Acknowledge and Close" : "รับทราบและปิด"}
          </button>
        </div>
      </div>
    </div>
  );
}
