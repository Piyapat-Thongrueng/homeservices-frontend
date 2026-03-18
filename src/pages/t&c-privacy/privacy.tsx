/**
 * Privacy Policy Page (นโยบายความเป็นส่วนตัว)
 *
 * Full page version of privacy policy for HomeServices.
 * Uses global CSS classes for consistent styling.
 */

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-utility-bg font-prompt flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <header className="w-full bg-green-600 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="headline-2 text-utility-white">
                นโยบายความเป็นส่วนตัว
              </h1>
              <p className="body-3 text-green-100">
                Privacy Policy - HomeServices
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 body-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>

        <div className="card-box bg-utility-white p-6 md:p-10 space-y-8">
          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4">
            <p className="body-2 text-green-700 font-medium">
              🔒 เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ
              ข้อมูลที่เก็บรวบรวมมีเพียงเท่าที่จำเป็นสำหรับการสาธิตระบบเท่านั้น
            </p>
          </div>

          {/* Last Updated */}
          <p className="body-4 text-gray-500">อัปเดตล่าสุด: 1 มกราคม 2568</p>

          {/* Section 1 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              1. ข้อมูลที่เก็บรวบรวม
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              เราเก็บรวบรวมข้อมูลต่อไปนี้เมื่อคุณลงทะเบียนและใช้งานแอปพลิเคชัน:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                "ชื่อ - นามสกุล",
                "อีเมลแอดเดรส",
                "เบอร์โทรศัพท์",
                "ที่อยู่สำหรับการบริการ",
                "ข้อมูลการจองบริการ",
                "ข้อมูลการชำระเงิน (เฉพาะข้อมูลที่จำเป็น)",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 body-2 text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              2. วัตถุประสงค์การใช้ข้อมูล
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              ข้อมูลที่เก็บรวบรวมใช้เพื่อวัตถุประสงค์ดังต่อไปนี้:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                "การสาธิตระบบการจองบริการ",
                "การทดสอบฟีเจอร์ต่างๆ ของแอปพลิเคชัน",
                "การพัฒนาและปรับปรุงประสบการณ์ผู้ใช้",
                "การติดต่อสื่อสารเกี่ยวกับบริการ",
                "การวิเคราะห์และปรับปรุงระบบ",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 body-2 text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              3. การเก็บรักษาข้อมูล
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              ข้อมูลของคุณถูกจัดเก็บบน Supabase
              ซึ่งมีมาตรการความปลอดภัยตามมาตรฐานสากล รวมถึง:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                "การเข้ารหัสข้อมูลระหว่างการส่ง (SSL/TLS)",
                "การเข้ารหัสข้อมูลที่จัดเก็บ",
                "การควบคุมการเข้าถึงข้อมูลอย่างเข้มงวด",
                "การสำรองข้อมูลอย่างสม่ำเสมอ",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 body-2 text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="body-2 text-gray-600 leading-relaxed mt-4">
              เราไม่มีการแชร์ ขาย
              หรือเปิดเผยข้อมูลของคุณให้บุคคลภายนอกโดยเด็ดขาด
              ยกเว้นกรณีที่กฎหมายกำหนด
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">4. สิทธิ์ของคุณ</h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
              คุณมีสิทธิ์ดังต่อไปนี้:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                "สิทธิ์ในการเข้าถึง - ขอดูข้อมูลส่วนตัวที่เราเก็บไว้",
                "สิทธิ์ในการแก้ไข - ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์",
                "สิทธิ์ในการลบ - ขอลบบัญชีและข้อมูลทั้งหมด",
                "สิทธิ์ในการโอนย้าย - ขอรับข้อมูลในรูปแบบที่อ่านได้",
                "สิทธิ์ในการคัดค้าน - คัดค้านการประมวลผลข้อมูลบางประเภท",
                "สิทธิ์ในการเพิกถอนความยินยอม - ถอนความยินยอมได้ทุกเมื่อ",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 body-2 text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              5. คุกกี้และ Local Storage
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              แอปพลิเคชันใช้เทคโนโลยีต่อไปนี้เพื่อการทำงานของระบบ:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                "Local Storage - เก็บ token สำหรับการยืนยันตัวตน",
                "Session Storage - เก็บข้อมูลชั่วคราวระหว่างการใช้งาน",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 body-2 text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="body-2 text-gray-600 leading-relaxed mt-4">
              ไม่มีการใช้คุกกี้เพื่อติดตามพฤติกรรมการใช้งานของคุณ
              หรือเพื่อวัตถุประสงค์ทางการตลาด
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              6. ระยะเวลาการเก็บรักษาข้อมูล
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณตราบเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่ระบุไว้
              หรือตามที่กฎหมายกำหนด เมื่อคุณลบบัญชี
              ข้อมูลของคุณจะถูกลบออกจากระบบภายใน 30 วัน
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              7. การเปลี่ยนแปลงนโยบาย
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
              การเปลี่ยนแปลงที่สำคัญจะแจ้งให้ทราบผ่านอีเมลหรือประกาศในแอปพลิเคชัน
              เราแนะนำให้คุณตรวจสอบหน้านี้เป็นระยะเพื่อติดตามการเปลี่ยนแปลง
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">8. ติดต่อเรา</h2>
            <p className="body-2 text-gray-600 leading-relaxed mb-4">
              หากต้องการใช้สิทธิ์ข้างต้นหรือมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว
              สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO)
              ได้ผ่านช่องทางต่อไปนี้:
            </p>
            <div className="bg-gray-50 rounded-xl p-5 space-y-2">
              <p className="body-2 text-gray-700">
                <span className="font-medium">บริษัท:</span> โฮมเซอร์วิสเซส
                จำกัด
              </p>
              <p className="body-2 text-gray-700">
                <span className="font-medium">ที่อยู่:</span> 452 ซอยสุขุมวิท 79
                แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
              </p>
              <p className="body-2 text-gray-700">
                <span className="font-medium">โทรศัพท์:</span>{" "}
                <a
                  href="tel:080-540-6357"
                  className="text-green-600 hover:text-green-700"
                >
                  080-540-6357
                </a>
              </p>
              <p className="body-2 text-gray-700">
                <span className="font-medium">อีเมล:</span>{" "}
                <a
                  href="mailto:privacy@homeservices.co"
                  className="text-green-600 hover:text-green-700"
                >
                  privacy@homeservices.co
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
