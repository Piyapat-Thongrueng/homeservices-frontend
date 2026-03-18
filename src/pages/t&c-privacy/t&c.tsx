/**
 * Terms and Conditions Page (เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์)
 *
 * Full page version of terms and conditions for HomeServices.
 * Uses global CSS classes for consistent styling.
 */

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-utility-bg font-prompt flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <header className="w-full bg-blue-600 py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="headline-2 text-utility-white">
                ข้อตกลงและเงื่อนไข
              </h1>
              <p className="body-3 text-blue-100">
                เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์ HomeServices
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
          className="inline-flex items-center gap-2 body-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าหลัก
        </Link>

        <div className="card-box bg-utility-white p-6 md:p-10 space-y-8">
          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
            <p className="body-2 text-amber-700 font-medium">
              ⚠️ แอปพลิเคชันนี้เป็นโปรเจกต์สาธิต (Demo)
              จัดทำเพื่อวัตถุประสงค์ทางการศึกษาเท่านั้น
              ไม่ใช่บริการเชิงพาณิชย์จริง
            </p>
          </div>

          {/* Last Updated */}
          <p className="body-4 text-gray-500">
            อัปเดตล่าสุด: 1 มกราคม 2568
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              1. การยอมรับข้อตกลง
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              การลงทะเบียนหรือใช้งาน HomeService Demo
              ถือว่าคุณยอมรับข้อตกลงและเงื่อนไขการใช้งานฉบับนี้ หากคุณไม่ยอมรับ
              กรุณาหยุดการใช้งานแอปพลิเคชัน
              ข้อตกลงนี้มีผลผูกพันทางกฎหมายระหว่างคุณและทีมพัฒนา
              HomeService
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              2. วัตถุประสงค์การใช้งาน
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              แอปพลิเคชันนี้จัดทำขึ้นเพื่อสาธิตระบบการจองบริการซ่อมแซมที่พักอาศัย
              ข้อมูลทั้งหมดที่แสดงในระบบเป็นข้อมูลสมมติ
              ไม่มีการให้บริการจริงเกิดขึ้น รวมถึง:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                "รายการบริการและราคาเป็นข้อมูลตัวอย่าง",
                "การจองบริการเป็นการจำลองเท่านั้น",
                "ไม่มีการเรียกเก็บเงินจริง",
                "ไม่มีช่างหรือผู้ให้บริการจริง",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 body-2 text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">3. บัญชีผู้ใช้</h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              คุณรับผิดชอบในการรักษาความปลอดภัยของบัญชีและรหัสผ่านของตนเอง
              กรุณาอย่าเปิดเผยข้อมูลการเข้าสู่ระบบให้ผู้อื่นทราบ
              ทีมพัฒนาขอสงวนสิทธิ์ในการระงับบัญชีที่มีพฤติกรรมไม่เหมาะสม
              รวมถึงการกระทำดังต่อไปนี้:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                "การพยายามเข้าถึงระบบโดยไม่ได้รับอนุญาต",
                "การใช้งานที่อาจก่อให้เกิดความเสียหายต่อระบบ",
                "การแอบอ้างเป็นบุคคลอื่น",
                "การใช้ข้อมูลเท็จในการลงทะเบียน",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 body-2 text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              4. ทรัพย์สินทางปัญญา
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              เนื้อหา การออกแบบ โลโก้ และส่วนประกอบทั้งหมดของแอปพลิเคชันนี้
              เป็นทรัพย์สินทางปัญญาของทีมพัฒนา HomeService
              ห้ามทำซ้ำ ดัดแปลง หรือนำไปใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาต
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              5. ข้อจำกัดความรับผิดชอบ
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              เนื่องจากเป็น Demo Application
              ทีมพัฒนาไม่รับประกันความต่อเนื่องของการให้บริการ
              และไม่รับผิดชอบต่อความเสียหายใดๆ
              ที่อาจเกิดขึ้นจากการใช้งานแอปพลิเคชันนี้ รวมถึง:
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {[
                "การสูญหายของข้อมูล",
                "การหยุดชะงักของบริการ",
                "ข้อผิดพลาดทางเทคนิค",
                "ความเสียหายทางอ้อมหรือความเสียหายพิเศษ",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 body-2 text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              6. การเปลี่ยนแปลงข้อตกลง
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              ทีมพัฒนาขอสงวนสิทธิ์ในการแก้ไขข้อตกลงและเงื่อนไขได้ทุกเมื่อโดยไม่ต้องแจ้งล่วงหน้า
              การใช้งานต่อเนื่องหลังจากมีการเปลี่ยนแปลงถือว่าคุณยอมรับข้อตกลงใหม่
              เราแนะนำให้คุณตรวจสอบหน้านี้เป็นระยะเพื่อติดตามการเปลี่ยนแปลง
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              7. กฎหมายที่ใช้บังคับ
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              ข้อตกลงนี้อยู่ภายใต้กฎหมายของราชอาณาจักรไทย
              ข้อพิพาทใดๆ ที่เกิดขึ้นจะอยู่ในเขตอำนาจศาลไทย
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">8. ติดต่อเรา</h2>
            <p className="body-2 text-gray-600 leading-relaxed mb-4">
              หากมีคำถามเกี่ยวกับข้อตกลงนี้
              สามารถติดต่อทีมพัฒนาได้ผ่านช่องทางต่อไปนี้:
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
                  className="text-blue-600 hover:text-blue-700"
                >
                  080-540-6357
                </a>
              </p>
              <p className="body-2 text-gray-700">
                <span className="font-medium">อีเมล:</span>{" "}
                <a
                  href="mailto:contact@homeservices.co"
                  className="text-blue-600 hover:text-blue-700"
                >
                  contact@homeservices.co
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
