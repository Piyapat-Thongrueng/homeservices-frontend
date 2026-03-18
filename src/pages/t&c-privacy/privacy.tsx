/**
 * Privacy Policy Page (นโยบายความเป็นส่วนตัว)
 *
 * Full page version of privacy policy for HomeServices.
 * Uses global CSS classes for consistent styling.
 */

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PrivacyPolicy() {
  const { locale } = useRouter();
  const isEn = locale === "en";

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
                {isEn ? "Privacy Policy" : "นโยบายความเป็นส่วนตัว"}
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
          {isEn ? "Back to Home" : "กลับหน้าหลัก"}
        </Link>

        <div className="card-box bg-utility-white p-6 md:p-10 space-y-8">
          {/* Privacy Notice */}
          <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4">
            <p className="body-2 text-green-700 font-medium">
              {isEn 
                ? "🔒 We value your privacy. The information collected is only what is necessary for the system demonstration."
                : "🔒 เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ ข้อมูลที่เก็บรวบรวมมีเพียงเท่าที่จำเป็นสำหรับการสาธิตระบบเท่านั้น"}
            </p>
          </div>

          {/* Last Updated */}
          <p className="body-4 text-gray-500">
            {isEn ? "Last Updated: January 1, 2024" : "อัปเดตล่าสุด: 1 มกราคม 2568"}
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              {isEn ? "1. Information Collected" : "1. ข้อมูลที่เก็บรวบรวม"}
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              {isEn 
                ? "We collect the following information when you register and use the application:"
                : "เราเก็บรวบรวมข้อมูลต่อไปนี้เมื่อคุณลงทะเบียนและใช้งานแอปพลิเคชัน:"}
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {(isEn ? [
                "Full Name",
                "Email Address",
                "Phone Number",
                "Service Address",
                "Service Booking Information",
                "Payment Information (only required data)",
              ] : [
                "ชื่อ - นามสกุล",
                "อีเมลแอดเดรส",
                "เบอร์โทรศัพท์",
                "ที่อยู่สำหรับการบริการ",
                "ข้อมูลการจองบริการ",
                "ข้อมูลการชำระเงิน (เฉพาะข้อมูลที่จำเป็น)",
              ]).map((item) => (
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
              {isEn ? "2. Purposes of Using Information" : "2. วัตถุประสงค์การใช้ข้อมูล"}
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              {isEn 
                ? "The collected information is used for the following purposes:"
                : "ข้อมูลที่เก็บรวบรวมใช้เพื่อวัตถุประสงค์ดังต่อไปนี้:"}
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {(isEn ? [
                "Demonstrating the service booking system",
                "Testing various features of the application",
                "Developing and improving user experience",
                "Communicating regarding services",
                "Analyzing and improving the system",
              ] : [
                "การสาธิตระบบการจองบริการ",
                "การทดสอบฟีเจอร์ต่างๆ ของแอปพลิเคชัน",
                "การพัฒนาและปรับปรุงประสบการณ์ผู้ใช้",
                "การติดต่อสื่อสารเกี่ยวกับบริการ",
                "การวิเคราะห์และปรับปรุงระบบ",
              ]).map((item) => (
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
              {isEn ? "3. Data Retention" : "3. การเก็บรักษาข้อมูล"}
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              {isEn 
                ? "Your data is stored on Supabase, which has international standard security measures including:"
                : "ข้อมูลของคุณถูกจัดเก็บบน Supabase ซึ่งมีมาตรการความปลอดภัยตามมาตรฐานสากล รวมถึง:"}
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {(isEn ? [
                "Data encryption during transmission (SSL/TLS)",
                "Encryption of stored data",
                "Strict data access control",
                "Regular data backups",
              ] : [
                "การเข้ารหัสข้อมูลระหว่างการส่ง (SSL/TLS)",
                "การเข้ารหัสข้อมูลที่จัดเก็บ",
                "การควบคุมการเข้าถึงข้อมูลอย่างเข้มงวด",
                "การสำรองข้อมูลอย่างสม่ำเสมอ",
              ]).map((item) => (
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
              {isEn 
                ? "We strictly do not share, sell, or disclose your information to any third parties except as required by law."
                : "เราไม่มีการแชร์ ขาย หรือเปิดเผยข้อมูลของคุณให้บุคคลภายนอกโดยเด็ดขาด ยกเว้นกรณีที่กฎหมายกำหนด"}
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              {isEn ? "4. Your Rights" : "4. สิทธิ์ของคุณ"}
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              {isEn 
                ? "Under the Personal Data Protection Act (PDPA), you have the following rights:"
                : "ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) คุณมีสิทธิ์ดังต่อไปนี้:"}
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {(isEn ? [
                "Right to Access - Request to see personal data we hold",
                "Right to Rectification - Request correction of inaccurate or incomplete data",
                "Right to Erasure - Request deletion of account and all data",
                "Right to Data Portability - Request to receive data in a readable format",
                "Right to Object - Object to certain types of data processing",
                "Right to Withdraw Consent - Withdraw consent at any time",
              ] : [
                "สิทธิ์ในการเข้าถึง - ขอดูข้อมูลส่วนตัวที่เราเก็บไว้",
                "สิทธิ์ในการแก้ไข - ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์",
                "สิทธิ์ในการลบ - ขอลบบัญชีและข้อมูลทั้งหมด",
                "สิทธิ์ในการโอนย้าย - ขอรับข้อมูลในรูปแบบที่อ่านได้",
                "สิทธิ์ในการคัดค้าน - คัดค้านการประมวลผลข้อมูลบางประเภท",
                "สิทธิ์ในการเพิกถอนความยินยอม - ถอนความยินยอมได้ทุกเมื่อ",
              ]).map((item) => (
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
              {isEn ? "5. Cookies and Local Storage" : "5. คุกกี้และ Local Storage"}
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              {isEn 
                ? "The application uses the following technologies for system functionality:"
                : "แอปพลิเคชันใช้เทคโนโลยีต่อไปนี้เพื่อการทำงานของระบบ:"}
            </p>
            <ul className="mt-3 space-y-2 pl-4">
              {(isEn ? [
                "Local Storage - Stores tokens for authentication",
                "Session Storage - Stores temporary data during usage",
              ] : [
                "Local Storage - เก็บ token สำหรับการยืนยันตัวตน",
                "Session Storage - เก็บข้อมูลชั่วคราวระหว่างการใช้งาน",
              ]).map((item) => (
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
              {isEn 
                ? "No cookies are used to track your browsing behaviors or for marketing purposes."
                : "ไม่มีการใช้คุกกี้เพื่อติดตามพฤติกรรมการใช้งานของคุณ หรือเพื่อวัตถุประสงค์ทางการตลาด"}
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              {isEn ? "6. Data Retention Period" : "6. ระยะเวลาการเก็บรักษาข้อมูล"}
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              {isEn 
                ? "We will retain your personal information as long as necessary for the stated purposes or as required by law. When you delete your account, your data will be removed from the system within 30 days."
                : "เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณตราบเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่ระบุไว้ หรือตามที่กฎหมายกำหนด เมื่อคุณลบบัญชี ข้อมูลของคุณจะถูกลบออกจากระบบภายใน 30 วัน"}
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              {isEn ? "7. Policy Changes" : "7. การเปลี่ยนแปลงนโยบาย"}
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed">
              {isEn 
                ? "We may update this privacy policy from time to time. Significant changes will be explicitly notified via email or within the application. We recommend checking this page periodically to follow changes."
                : "เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว การเปลี่ยนแปลงที่สำคัญจะแจ้งให้ทราบผ่านอีเมลหรือประกาศในแอปพลิเคชัน เราแนะนำให้คุณตรวจสอบหน้านี้เป็นระยะเพื่อติดตามการเปลี่ยนแปลง"}
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="headline-4 text-gray-900 mb-3">
              {isEn ? "8. Contact Us" : "8. ติดต่อเรา"}
            </h2>
            <p className="body-2 text-gray-600 leading-relaxed mb-4">
              {isEn 
                ? "If you want to exercise the rights above or have questions regarding the privacy policy, you can contact our Data Protection Officer (DPO) via the following channels:"
                : "หากต้องการใช้สิทธิ์ข้างต้นหรือมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ได้ผ่านช่องทางต่อไปนี้:"}
            </p>
            <div className="bg-gray-50 rounded-xl p-5 space-y-2">
              <p className="body-2 text-gray-700">
                <span className="font-medium">{isEn ? "Company:" : "บริษัท:"}</span> HomeServices Co., Ltd.
              </p>
              <p className="body-2 text-gray-700">
                <span className="font-medium">{isEn ? "Address:" : "ที่อยู่:"}</span> 452 Sukhumvit 79, Phra Khanong Nuea, Watthana, Bangkok 10260
              </p>
              <p className="body-2 text-gray-700">
                <span className="font-medium">{isEn ? "Phone:" : "โทรศัพท์:"}</span>{" "}
                <a
                  href="tel:080-540-6357"
                  className="text-green-600 hover:text-green-700"
                >
                  080-540-6357
                </a>
              </p>
              <p className="body-2 text-gray-700">
                <span className="font-medium">{isEn ? "Email:" : "อีเมล:"}</span>{" "}
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
