// Thailand provinces, districts, sub-districts, and postal codes
export interface District {
  name: string;
  postalCode: string;
  subDistricts: string[];
}

export interface Province {
  name: string;
  districts: District[];
}

export const thailandProvinces: Province[] = [
  {
    name: "กรุงเทพมหานคร",
    districts: [
      {
        name: "จตุจักร",
        postalCode: "10900",
        subDistricts: ["เสนานิคม", "ลาดยาว", "จตุจักร", "จอมพล", "บางซื่อ"],
      },
      {
        name: "บางรัก",
        postalCode: "10500",
        subDistricts: ["บางรัก", "สีลม", "สุริยวงศ์", "มหาพฤฒาราม", "สี่พระยา"],
      },
      {
        name: "ปทุมวัน",
        postalCode: "10330",
        subDistricts: ["ปทุมวัน", "รองเมือง", "วังใหม่", "ลุมพินี", "มหานาค"],
      },
      {
        name: "สาทร",
        postalCode: "10120",
        subDistricts: ["สาทรเหนือ", "สาทรใต้", "ทุ่งมหาเมฆ", "ยานนาวา", "ทุ่งวัดดอน"],
      },
      {
        name: "คลองสาน",
        postalCode: "10600",
        subDistricts: ["คลองสาน", "บางลำภูล่าง", "สมเด็จเจ้าพระยา", "คลองต้นไทร"],
      },
      {
        name: "บางกอกใหญ่",
        postalCode: "10600",
        subDistricts: ["วัดอรุณ", "วัดท่าพระ", "หิรัญรูจี", "บางยี่เรือ", "บางคอแหลม"],
      },
      {
        name: "บางกอกน้อย",
        postalCode: "10700",
        subDistricts: ["บางกอกน้อย", "ศิริราช", "บ้านช่างหล่อ", "บางขุนนนท์", "บางขุนศรี"],
      },
      {
        name: "บางพลัด",
        postalCode: "10700",
        subDistricts: ["บางพลัด", "บางอ้อ", "บางบำหรุ", "บางยี่ขัน", "ศิริราช"],
      },
      {
        name: "ดุสิต",
        postalCode: "10300",
        subDistricts: ["ดุสิต", "วชิรพยาบาล", "สวนจิตรลดา", "สี่แยกมหานาค", "ถนนนครไชยศรี"],
      },
      {
        name: "พญาไท",
        postalCode: "10400",
        subDistricts: ["สามเสนใน", "พญาไท", "ถนนเพชรบุรี", "ทุ่งพญาไท", "มักกะสัน"],
      },
    ],
  },
  {
    name: "เชียงใหม่",
    districts: [
      {
        name: "เมืองเชียงใหม่",
        postalCode: "50000",
        subDistricts: ["ศรีภูมิ", "พระสิงห์", "หายยา", "ช้างม่อย", "ช้างคลาน"],
      },
      {
        name: "จอมทอง",
        postalCode: "50160",
        subDistricts: ["จอมทอง", "บ้านหลวง", "แม่สอย", "ข่วงเปา", "สบเตี๊ยะ"],
      },
      {
        name: "แม่แจ่ม",
        postalCode: "50270",
        subDistricts: ["แม่แจ่ม", "กองแขก", "แม่ศึก", "แม่นาจร", "บ้านทับ"],
      },
    ],
  },
  {
    name: "นนทบุรี",
    districts: [
      {
        name: "เมืองนนทบุรี",
        postalCode: "11000",
        subDistricts: ["สวนใหญ่", "ตลาดขวัญ", "บางเขน", "บางกระสอ", "ท่าทราย"],
      },
      {
        name: "บางกรวย",
        postalCode: "11130",
        subDistricts: ["บางกรวย", "บางสีทอง", "บางขนุน", "บางขุนกอง", "บางคูเวียง"],
      },
      {
        name: "บางใหญ่",
        postalCode: "11140",
        subDistricts: ["บางใหญ่", "บางแม่นาง", "บางเลน", "เสาธงหิน", "บางบัวทอง"],
      },
    ],
  },
  {
    name: "ปทุมธานี",
    districts: [
      {
        name: "เมืองปทุมธานี",
        postalCode: "12000",
        subDistricts: ["บางพูน", "บางหลวง", "บางเดื่อ", "บางพูด", "บางพูน"],
      },
      {
        name: "คลองหลวง",
        postalCode: "12120",
        subDistricts: ["คลองหนึ่ง", "คลองสอง", "คลองสาม", "คลองสี่", "คลองห้า"],
      },
      {
        name: "ธัญบุรี",
        postalCode: "12110",
        subDistricts: ["ประชาธิปัตย์", "บึงยี่โถ", "รังสิต", "ลำผักกูด", "บึงสนั่น"],
      },
    ],
  },
  {
    name: "สมุทรปราการ",
    districts: [
      {
        name: "เมืองสมุทรปราการ",
        postalCode: "10270",
        subDistricts: ["ปากน้ำ", "สำโรงเหนือ", "บางเมือง", "ท้ายบ้าน", "บางปูใหม่"],
      },
      {
        name: "บางบ่อ",
        postalCode: "10560",
        subDistricts: ["บางบ่อ", "บ้านระกาศ", "บางพลีน้อย", "บางเพรียง", "คลองด่าน"],
      },
      {
        name: "บางพลี",
        postalCode: "10540",
        subDistricts: ["บางพลีใหญ่", "บางแก้ว", "บางปลา", "บางโฉลง", "ราชาเทวะ"],
      },
    ],
  },
  {
    name: "ชลบุรี",
    districts: [
      {
        name: "เมืองชลบุรี",
        postalCode: "20000",
        subDistricts: ["บางปลาสร้อย", "มะขามหย่ง", "บ้านโขด", "แสนสุข", "หนองมน"],
      },
      {
        name: "ศรีราชา",
        postalCode: "20110",
        subDistricts: ["ศรีราชา", "สุรศักดิ์", "ทุ่งสุขลา", "บึง", "หนองขาม"],
      },
      {
        name: "พัทยา",
        postalCode: "20150",
        subDistricts: ["นาเกลือ", "หนองปรือ", "บางเสร่", "พัทยาเหนือ", "พัทยาใต้"],
      },
    ],
  },
  {
    name: "ระยอง",
    districts: [
      {
        name: "เมืองระยอง",
        postalCode: "21000",
        subDistricts: ["ท่าประดู่", "เชิงเนิน", "ตะพง", "ปากน้ำ", "เพ"],
      },
      {
        name: "บ้านฉาง",
        postalCode: "21130",
        subDistricts: ["บ้านฉาง", "พลา", "บ้านเพ", "ตะพง", "มาบตาพุด"],
      },
    ],
  },
  {
    name: "ภูเก็ต",
    districts: [
      {
        name: "เมืองภูเก็ต",
        postalCode: "83000",
        subDistricts: ["ตลาดใหญ่", "ตลาดเหนือ", "เกาะแก้ว", "รัษฎา", "วิชิต"],
      },
      {
        name: "กะทู้",
        postalCode: "83120",
        subDistricts: ["กะทู้", "ป่าตอง", "กมลา", "ราไวย์", "ฉลอง"],
      },
    ],
  },
  {
    name: "สงขลา",
    districts: [
      {
        name: "เมืองสงขลา",
        postalCode: "90000",
        subDistricts: ["บ่อยาง", "เขารูปช้าง", "เกาะแต้ว", "พังลา", "ทุ่งหวัง"],
      },
      {
        name: "หาดใหญ่",
        postalCode: "90110",
        subDistricts: ["หาดใหญ่", "คอหงส์", "คูเต่า", "คลองแห", "ทุ่งใหญ่"],
      },
    ],
  },
  {
    name: "ขอนแก่น",
    districts: [
      {
        name: "เมืองขอนแก่น",
        postalCode: "40000",
        subDistricts: ["ในเมือง", "สำราญ", "โคกสี", "ท่าพระ", "บ้านทุ่ม"],
      },
      {
        name: "บ้านไผ่",
        postalCode: "40110",
        subDistricts: ["บ้านไผ่", "ในเมือง", "เมืองเพีย", "แคนเหนือ", "ภูเหล็ก"],
      },
    ],
  },
  {
    name: "อุดรธานี",
    districts: [
      {
        name: "เมืองอุดรธานี",
        postalCode: "41000",
        subDistricts: ["หมากแข้ง", "นิคมสงเคราะห์", "บ้านขาว", "หนองบัว", "หนองไผ่"],
      },
      {
        name: "กุมภวาปี",
        postalCode: "41110",
        subDistricts: ["กุมภวาปี", "ตูมใต้", "พันดอน", "เวียงคำ", "แชแล"],
      },
    ],
  },
  {
    name: "นครราชสีมา",
    districts: [
      {
        name: "เมืองนครราชสีมา",
        postalCode: "30000",
        subDistricts: ["ในเมือง", "โพธิ์กลาง", "หนองจะบก", "โคกสูง", "มะเริง"],
      },
      {
        name: "ปากช่อง",
        postalCode: "30130",
        subDistricts: ["ปากช่อง", "กลางดง", "จันทึก", "วังกะทะ", "หมูสี"],
      },
    ],
  },
  {
    name: "เชียงราย",
    districts: [
      {
        name: "เมืองเชียงราย",
        postalCode: "57000",
        subDistricts: ["เวียง", "รอบเวียง", "บ้านดู่", "นางแล", "แม่ข้าวต้ม"],
      },
      {
        name: "แม่สาย",
        postalCode: "57130",
        subDistricts: ["แม่สาย", "ศรีเมืองชุม", "เวียงพางคำ", "บ้านด้าย", "โป่งงาม"],
      },
    ],
  },
  {
    name: "ลำปาง",
    districts: [
      {
        name: "เมืองลำปาง",
        postalCode: "52000",
        subDistricts: ["หัวเวียง", "ท่าอิฐ", "ทุ่งปัง", "ปงแสนทอง", "พระบาท"],
      },
      {
        name: "เกาะคา",
        postalCode: "52130",
        subDistricts: ["เกาะคา", "ลำปางหลวง", "ท่าผา", "ใหม่พัฒนา", "บ่อแฮ้ว"],
      },
    ],
  },
  {
    name: "พิษณุโลก",
    districts: [
      {
        name: "เมืองพิษณุโลก",
        postalCode: "65000",
        subDistricts: ["ในเมือง", "วังทอง", "บ้านคลอง", "ท่าทอง", "ปากโทก"],
      },
      {
        name: "วังทอง",
        postalCode: "65130",
        subDistricts: ["วังทอง", "พันชาลี", "แม่ระกา", "บ้านกลาง", "วังพิกุล"],
      },
    ],
  },
  {
    name: "สุราษฎร์ธานี",
    districts: [
      {
        name: "เมืองสุราษฎร์ธานี",
        postalCode: "84000",
        subDistricts: ["ตลาด", "มะขามเตี้ย", "วัดประดู่", "ขุนทะเล", "บางใบไม้"],
      },
      {
        name: "เกาะสมุย",
        postalCode: "84140",
        subDistricts: ["ตลิ่งงาม", "บ่อผุด", "มะเร็ต", "อ่างทอง", "แม่น้ำ"],
      },
    ],
  },
  {
    name: "นครศรีธรรมราช",
    districts: [
      {
        name: "เมืองนครศรีธรรมราช",
        postalCode: "80000",
        subDistricts: ["ในเมือง", "ท่าวัง", "คลัง", "ท่าไร่", "ปากนคร"],
      },
      {
        name: "ทุ่งสง",
        postalCode: "80110",
        subDistricts: ["ทุ่งสง", "นาหลวงเสน", "ท่าแพ", "กะปาง", "เขาขาว"],
      },
    ],
  },
  {
    name: "อ่างทอง",
    districts: [
      {
        name: "เมืองอ่างทอง",
        postalCode: "14000",
        subDistricts: ["บางแก้ว", "โพสะ", "บางพลับ", "โพธิ์ทอง", "บางระกำ"],
      },
      {
        name: "ไชโย",
        postalCode: "14140",
        subDistricts: ["ไชโย", "หลักฟ้า", "ชะไว", "ตรีณรงค์", "บางไผ่"],
      },
    ],
  },
  {
    name: "ลพบุรี",
    districts: [
      {
        name: "เมืองลพบุรี",
        postalCode: "15000",
        subDistricts: ["ท่าหิน", "กกโก", "โก่งธนู", "เขาพระงาม", "ท่าแค"],
      },
      {
        name: "พัฒนานิคม",
        postalCode: "15140",
        subDistricts: ["พัฒนานิคม", "ช่องสาริกา", "มะนาวหวาน", "ลำนารายณ์", "หนองบัว"],
      },
    ],
  },
  {
    name: "สระบุรี",
    districts: [
      {
        name: "เมืองสระบุรี",
        postalCode: "18000",
        subDistricts: ["ปากเพรียว", "ดาวเรือง", "นาโฉง", "โคกสว่าง", "หนองโน"],
      },
      {
        name: "เสาไห้",
        postalCode: "18160",
        subDistricts: ["เสาไห้", "บ้านยาง", "พระพุทธบาท", "พุกร่าง", "หนองปลาไหล"],
      },
    ],
  },
  {
    name: "ราชบุรี",
    districts: [
      {
        name: "เมืองราชบุรี",
        postalCode: "70000",
        subDistricts: ["หน้าเมือง", "เจดีย์หัก", "ห้วยไผ่", "คุ้งน้ำวน", "ดอนทราย"],
      },
      {
        name: "จอมบึง",
        postalCode: "70150",
        subDistricts: ["จอมบึง", "ปากช่อง", "เบิกไพร", "ด่านทับตะโก", "แก้มอ้น"],
      },
    ],
  },
  {
    name: "กาญจนบุรี",
    districts: [
      {
        name: "เมืองกาญจนบุรี",
        postalCode: "71000",
        subDistricts: ["บ้านเหนือ", "บ้านใต้", "ปากแพรก", "ท่าม่วง", "วังด้ง"],
      },
      {
        name: "ไทรโยค",
        postalCode: "71150",
        subDistricts: ["ไทรโยค", "วังกระแจะ", "ศรีมงคล", "บ้องตี้", "ท่าเสา"],
      },
    ],
  },
  {
    name: "ประจวบคีรีขันธ์",
    districts: [
      {
        name: "เมืองประจวบคีรีขันธ์",
        postalCode: "77000",
        subDistricts: ["ประจวบคีรีขันธ์", "เกาะหลัก", "คลองวาฬ", "ห้วยทราย", "อ่าวน้อย"],
      },
      {
        name: "หัวหิน",
        postalCode: "77110",
        subDistricts: ["หัวหิน", "หนองแก", "หนองพลับ", "ทับใต้", "หินเหล็กไฟ"],
      },
    ],
  },
  {
    name: "เพชรบุรี",
    districts: [
      {
        name: "เมืองเพชรบุรี",
        postalCode: "76000",
        subDistricts: ["ท่าราบ", "คลองกระแชง", "บางจาน", "นาพันสาม", "ธงชัย"],
      },
      {
        name: "ชะอำ",
        postalCode: "76120",
        subDistricts: ["ชะอำ", "บางเก่า", "นายาง", "เขาใหญ่", "หนองศาลา"],
      },
    ],
  },
  {
    name: "นครปฐม",
    districts: [
      {
        name: "เมืองนครปฐม",
        postalCode: "73000",
        subDistricts: ["พระปฐมเจดีย์", "บางแขม", "พระประโทน", "ธรรมศาลา", "ตาก้อง"],
      },
      {
        name: "กำแพงแสน",
        postalCode: "73140",
        subDistricts: ["กำแพงแสน", "รางพิกุล", "หนองกระทุ่ม", "วังน้ำเขียว", "นครชัยศรี"],
      },
    ],
  },
  {
    name: "สมุทรสาคร",
    districts: [
      {
        name: "เมืองสมุทรสาคร",
        postalCode: "74000",
        subDistricts: ["มหาชัย", "ท่าฉลอม", "โกรกกราก", "บ้านบ่อ", "บางโทรัด"],
      },
      {
        name: "กระทุ่มแบน",
        postalCode: "74110",
        subDistricts: ["กระทุ่มแบน", "ท่าไม้", "สวนหลวง", "อ้อมน้อย", "บางยาง"],
      },
    ],
  },
  {
    name: "สมุทรสงคราม",
    districts: [
      {
        name: "เมืองสมุทรสงคราม",
        postalCode: "75000",
        subDistricts: ["แม่กลอง", "บางขันแตก", "ลาดใหญ่", "บ้านปรก", "บางแก้ว"],
      },
      {
        name: "บางคนที",
        postalCode: "75120",
        subDistricts: ["บางคนที", "กระดังงา", "บางสะแก", "บางยี่รงค์", "ราชคราม"],
      },
    ],
  },
  {
    name: "เพชรบูรณ์",
    districts: [
      {
        name: "เมืองเพชรบูรณ์",
        postalCode: "67000",
        subDistricts: ["ในเมือง", "ตะเบาะ", "บ้านโตก", "ป่าเลา", "น้ำหนาว"],
      },
      {
        name: "หล่มสัก",
        postalCode: "67110",
        subDistricts: ["หล่มสัก", "น้ำชุน", "ตาลเดี่ยว", "ฝายนาแซง", "หนองไขว่"],
      },
    ],
  },
  {
    name: "เลย",
    districts: [
      {
        name: "เมืองเลย",
        postalCode: "42000",
        subDistricts: ["กุดป่อง", "ในเมือง", "นาด้วง", "นาอาน", "ท่าศาลา"],
      },
      {
        name: "นาด้วง",
        postalCode: "42210",
        subDistricts: ["นาด้วง", "ท่าสะอาด", "ท่าสวรรค์", "ท่าลี่", "วังสะพุง"],
      },
    ],
  },
  {
    name: "หนองคาย",
    districts: [
      {
        name: "เมืองหนองคาย",
        postalCode: "43000",
        subDistricts: ["ในเมือง", "มีชัย", "โพธิ์ชัย", "กวนวัน", "เวียงคุก"],
      },
      {
        name: "ท่าบ่อ",
        postalCode: "43110",
        subDistricts: ["ท่าบ่อ", "น้ำโมง", "กองนาง", "โคกคอน", "ห้วยโพธิ์"],
      },
    ],
  },
  {
    name: "มหาสารคาม",
    districts: [
      {
        name: "เมืองมหาสารคาม",
        postalCode: "44000",
        subDistricts: ["ตลาด", "เขวา", "ท่าตูม", "แวงน่าง", "โคกก่อ"],
      },
      {
        name: "กันทรวิชัย",
        postalCode: "44150",
        subDistricts: ["กันทรวิชัย", "ท่าขอนยาง", "โนนราษี", "โนนแดง", "บรบือ"],
      },
    ],
  },
  {
    name: "ร้อยเอ็ด",
    districts: [
      {
        name: "เมืองร้อยเอ็ด",
        postalCode: "45000",
        subDistricts: ["ในเมือง", "รอบเมือง", "เหนือเมือง", "ขอนแก่น", "นาโพธิ์"],
      },
      {
        name: "เกษตรวิสัย",
        postalCode: "45150",
        subDistricts: ["เกษตรวิสัย", "เมืองบัว", "เหล่าหลวง", "สิงห์โคก", "ดงครั่งใหญ่"],
      },
    ],
  },
  {
    name: "กาฬสินธุ์",
    districts: [
      {
        name: "เมืองกาฬสินธุ์",
        postalCode: "46000",
        subDistricts: ["กาฬสินธุ์", "เหนือ", "หลุบ", "ไผ่", "ลำปาว"],
      },
      {
        name: "นามน",
        postalCode: "46230",
        subDistricts: ["นามน", "ยอดแกง", "สงเปลือย", "หนองบัว", "กุดโดน"],
      },
    ],
  },
  {
    name: "สกลนคร",
    districts: [
      {
        name: "เมืองสกลนคร",
        postalCode: "47000",
        subDistricts: ["ธาตุเชิงชุม", "ขมิ้น", "งิ้วด่อน", "โนนหอม", "เชียงเครือ"],
      },
      {
        name: "กุสุมาลย์",
        postalCode: "47210",
        subDistricts: ["กุสุมาลย์", "นาโพธิ์", "นาเพียง", "โพธิไพศาล", "อุ่มจาน"],
      },
    ],
  },
  {
    name: "นครพนม",
    districts: [
      {
        name: "เมืองนครพนม",
        postalCode: "48000",
        subDistricts: ["ในเมือง", "หนองแสง", "นาทราย", "นาราชควาย", "กุรุคุ"],
      },
      {
        name: "ธาตุพนม",
        postalCode: "48110",
        subDistricts: ["ธาตุพนม", "ฝั่งแดง", "โพนแพง", "พระกลางทุ่ง", "นาถ่อน"],
      },
    ],
  },
  {
    name: "มุกดาหาร",
    districts: [
      {
        name: "เมืองมุกดาหาร",
        postalCode: "49000",
        subDistricts: ["มุกดาหาร", "ศรีบุญเรือง", "บ้านโคก", "บางทรายใหญ่", "คำป่าหลาย"],
      },
      {
        name: "นิคมคำสร้อย",
        postalCode: "49130",
        subDistricts: ["นิคมคำสร้อย", "นากอก", "หนองแวง", "กกแดง", "นาอุดม"],
      },
    ],
  },
  {
    name: "ยโสธร",
    districts: [
      {
        name: "เมืองยโสธร",
        postalCode: "35000",
        subDistricts: ["ในเมือง", "คำเตย", "ส้มผ่อ", "คำไผ่", "หนองหิน"],
      },
      {
        name: "เลิงนกทา",
        postalCode: "35120",
        subDistricts: ["เลิงนกทา", "สามแยก", "กุดเชียงหมี", "นาแสวง", "ศรีแก้ว"],
      },
    ],
  },
  {
    name: "อำนาจเจริญ",
    districts: [
      {
        name: "เมืองอำนาจเจริญ",
        postalCode: "37000",
        subDistricts: ["อำนาจเจริญ", "นาจิก", "ปลาค้าว", "เหล่าพรวน", "สร้างนกทา"],
      },
      {
        name: "ชานุมาน",
        postalCode: "37210",
        subDistricts: ["ชานุมาน", "โคกสาร", "คำเขื่อนแก้ว", "หนองทุ่ม", "กุดเรือคำ"],
      },
    ],
  },
  {
    name: "หนองบัวลำภู",
    districts: [
      {
        name: "เมืองหนองบัวลำภู",
        postalCode: "39000",
        subDistricts: ["หนองบัว", "หนองภัยศูนย์", "โพธิ์ชัย", "หนองสวรรค์", "หัวนา"],
      },
      {
        name: "นากลาง",
        postalCode: "39170",
        subDistricts: ["นากลาง", "ด่านช้าง", "นาเหล่า", "นาแก", "กุดดินจี่"],
      },
    ],
  },
  {
    name: "บึงกาฬ",
    districts: [
      {
        name: "เมืองบึงกาฬ",
        postalCode: "38000",
        subDistricts: ["บึงกาฬ", "โนนสมบูรณ์", "หนองเข็ง", "หอคำ", "โซ่"],
      },
      {
        name: "เซกา",
        postalCode: "38150",
        subDistricts: ["เซกา", "ซาง", "ท่ากกแดง", "บ้านต้อง", "ป่งไฮ"],
      },
    ],
  },
  {
    name: "กำแพงเพชร",
    districts: [
      {
        name: "เมืองกำแพงเพชร",
        postalCode: "62000",
        subDistricts: ["ในเมือง", "ไตรตรึงษ์", "อ่างทอง", "บึงทับแรต", "เพชรชมภู"],
      },
      {
        name: "คลองลาน",
        postalCode: "62180",
        subDistricts: ["คลองลาน", "สักงาม", "วังชะพลู", "พรานกระต่าย", "ท่ามะเขือ"],
      },
    ],
  },
  {
    name: "ตาก",
    districts: [
      {
        name: "เมืองตาก",
        postalCode: "63000",
        subDistricts: ["หนองหลวง", "หนองบัว", "บ้านตาก", "พระบาท", "เชียงเงิน"],
      },
      {
        name: "แม่สอด",
        postalCode: "63110",
        subDistricts: ["แม่สอด", "แม่กุ", "พะวอ", "มหาวัน", "ด่านแม่ละเมา"],
      },
    ],
  },
  {
    name: "สุโขทัย",
    districts: [
      {
        name: "เมืองสุโขทัย",
        postalCode: "64000",
        subDistricts: ["ธานี", "บ้านสวน", "เมืองเก่า", "ปากแคว", "ยางซ้าย"],
      },
      {
        name: "บ้านด่านลานหอย",
        postalCode: "64140",
        subDistricts: ["บ้านด่าน", "ลานหอย", "ตาลเตี้ย", "วังลึก", "บ่อหลวง"],
      },
    ],
  },
  {
    name: "อุตรดิตถ์",
    districts: [
      {
        name: "เมืองอุตรดิตถ์",
        postalCode: "53000",
        subDistricts: ["ท่าอิฐ", "ท่าเสา", "บ้านเกาะ", "ป่าเซ่า", "คุ้งตะเภา"],
      },
      {
        name: "ตรอน",
        postalCode: "53140",
        subDistricts: ["วังแดง", "บ้านแก่ง", "หาดสองแคว", "น้ำอ่าง", "ทุ่งยั้ง"],
      },
    ],
  },
  {
    name: "แพร่",
    districts: [
      {
        name: "เมืองแพร่",
        postalCode: "54000",
        subDistricts: ["ในเวียง", "นาจักร", "น้ำชำ", "ป่าแดง", "ทุ่งโฮ้ง"],
      },
      {
        name: "ร้องกวาง",
        postalCode: "54140",
        subDistricts: ["ร้องกวาง", "ร้องเข็ม", "น้ำเลา", "บ้านเวียง", "ทุ่งศรี"],
      },
    ],
  },
  {
    name: "น่าน",
    districts: [
      {
        name: "เมืองน่าน",
        postalCode: "55000",
        subDistricts: ["ในเวียง", "บ่อ", "ผาสิงห์", "ไชยสถาน", "ถืมตอง"],
      },
      {
        name: "แม่จริม",
        postalCode: "55170",
        subDistricts: ["แม่จริม", "หนองแดง", "หมอเมือง", "น้ำปั้ว", "น้ำริน"],
      },
    ],
  },
  {
    name: "พะเยา",
    districts: [
      {
        name: "เมืองพะเยา",
        postalCode: "56000",
        subDistricts: ["ในเวียง", "บ้านต๋อม", "แม่ปืม", "บ้านสาง", "บ้านใหม่"],
      },
      {
        name: "จุน",
        postalCode: "56150",
        subDistricts: ["จุน", "ลอ", "หงส์หิน", "ทุ่งรวงทอง", "ห้วยยาง"],
      },
    ],
  },
  {
    name: "ลำพูน",
    districts: [
      {
        name: "เมืองลำพูน",
        postalCode: "51000",
        subDistricts: ["ในเมือง", "เหมืองง่า", "อุโมงค์", "ป่าสัก", "เวียงยอง"],
      },
      {
        name: "แม่ทา",
        postalCode: "51140",
        subDistricts: ["แม่ทา", "ทาเหนือ", "ท่าตุ้ม", "น้ำดิบ", "มะกอก"],
      },
    ],
  },
  {
    name: "แม่ฮ่องสอน",
    districts: [
      {
        name: "เมืองแม่ฮ่องสอน",
        postalCode: "58000",
        subDistricts: ["จองคำ", "ห้วยโป่ง", "ผาบ่อง", "ปางหมู", "หมอกจำแป่"],
      },
      {
        name: "ขุนยวม",
        postalCode: "58140",
        subDistricts: ["ขุนยวม", "เมืองปอน", "หนองประกาย", "แม่เงา", "แม่ลาน้อย"],
      },
    ],
  },
  {
    name: "อุบลราชธานี",
    districts: [
      {
        name: "เมืองอุบลราชธานี",
        postalCode: "34000",
        subDistricts: ["ในเมือง", "หัวเรือ", "หนองขอน", "ท่าศาลา", "ปทุม"],
      },
      {
        name: "วารินชำราบ",
        postalCode: "34190",
        subDistricts: ["วารินชำราบ", "ธาตุ", "ท่าลาด", "โนนโหนน", "คูเมือง"],
      },
    ],
  },
  {
    name: "ศรีสะเกษ",
    districts: [
      {
        name: "เมืองศรีสะเกษ",
        postalCode: "33000",
        subDistricts: ["เมืองเหนือ", "เมืองใต้", "คูซอด", "ซำ", "จาน"],
      },
      {
        name: "ยางชุมน้อย",
        postalCode: "33190",
        subDistricts: ["ยางชุมน้อย", "ลิ้นฟ้า", "หนองไฮ", "โคกจาน", "โนนแก้ว"],
      },
    ],
  },
  {
    name: "บุรีรัมย์",
    districts: [
      {
        name: "เมืองบุรีรัมย์",
        postalCode: "31000",
        subDistricts: ["ในเมือง", "อิสาณ", "สำราญ", "กระสัง", "บ้านบัว"],
      },
      {
        name: "คูเมือง",
        postalCode: "31190",
        subDistricts: ["คูเมือง", "ปะเคียบ", "บ้านแพ", "หนองขมาร", "ห้วยราช"],
      },
    ],
  },
  {
    name: "สุรินทร์",
    districts: [
      {
        name: "เมืองสุรินทร์",
        postalCode: "32000",
        subDistricts: ["ในเมือง", "นอกเมือง", "บ้านขวาง", "คอโค", "เฉนียง"],
      },
      {
        name: "ชุมพลบุรี",
        postalCode: "32190",
        subDistricts: ["ชุมพลบุรี", "นาหนองไผ่", "ไพรขลา", "ศรีณรงค์", "หนองเรือ"],
      },
    ],
  },
  {
    name: "นครสวรรค์",
    districts: [
      {
        name: "เมืองนครสวรรค์",
        postalCode: "60000",
        subDistricts: ["ปากน้ำโพ", "กลางแดด", "เกรียงไกร", "แควใหญ่", "ตะเคียนเลื่อน"],
      },
      {
        name: "โกรกพระ",
        postalCode: "60170",
        subDistricts: ["โกรกพระ", "บางประมุง", "บางมะฝ่อ", "หาดสูง", "เนินศาลา"],
      },
    ],
  },
  {
    name: "อุทัยธานี",
    districts: [
      {
        name: "เมืองอุทัยธานี",
        postalCode: "61000",
        subDistricts: ["อุทัยใหม่", "น้ำซึม", "สะแกกรัง", "ดอนขวาง", "หาดทนง"],
      },
      {
        name: "ทัพทัน",
        postalCode: "61120",
        subDistricts: ["ทัพทัน", "ทุ่งนาไทย", "เขาขี้ฝอย", "หนองหญ้าปล้อง", "หนองแก"],
      },
    ],
  },
  {
    name: "ชัยนาท",
    districts: [
      {
        name: "เมืองชัยนาท",
        postalCode: "17000",
        subDistricts: ["ในเมือง", "ท่าชัย", "ชัยนาท", "ห้วยกรด", "โพงาม"],
      },
      {
        name: "มโนรมย์",
        postalCode: "17110",
        subDistricts: ["มโนรมย์", "วัดโคก", "ศิลาดาน", "ท่าฉนวน", "หางน้ำสาคร"],
      },
    ],
  },
  {
    name: "สิงห์บุรี",
    districts: [
      {
        name: "เมืองสิงห์บุรี",
        postalCode: "16000",
        subDistricts: ["ในเมือง", "บางกระสอ", "โพกรวม", "ม่วงหมู่", "บางพุทรา"],
      },
      {
        name: "บางระจัน",
        postalCode: "16130",
        subDistricts: ["บางระจัน", "สิงห์", "ไม้ดัด", "เชิงกลัด", "โพชนไก่"],
      },
    ],
  },
  {
    name: "สุพรรณบุรี",
    districts: [
      {
        name: "เมืองสุพรรณบุรี",
        postalCode: "72000",
        subDistricts: ["รั้วใหญ่", "ทับตีเหล็ก", "ท่าระหัด", "ไผ่ขวาง", "โคกโคเฒ่า"],
      },
      {
        name: "เดิมบางนางบวช",
        postalCode: "72120",
        subDistricts: ["เดิมบาง", "นางบวช", "เขาดิน", "ปากน้ำ", "ท่ามะนาว"],
      },
    ],
  },
  {
    name: "ปราจีนบุรี",
    districts: [
      {
        name: "เมืองปราจีนบุรี",
        postalCode: "25000",
        subDistricts: ["หน้าเมือง", "หลังสวน", "วัดโบสถ์", "บางเดชะ", "เนินหอม"],
      },
      {
        name: "กบินทร์บุรี",
        postalCode: "25110",
        subDistricts: ["กบินทร์", "เมืองเก่า", "วังดาล", "นนทรี", "ย่านรี"],
      },
    ],
  },
  {
    name: "สระแก้ว",
    districts: [
      {
        name: "เมืองสระแก้ว",
        postalCode: "27000",
        subDistricts: ["สระแก้ว", "บ้านแก้ง", "ศาลาลำดวน", "ตาอุด", "ห้วยโจด"],
      },
      {
        name: "วัฒนานคร",
        postalCode: "27160",
        subDistricts: ["วัฒนานคร", "ท่าเกวียน", "ผักขะ", "โนนหมากเค็ง", "หนองน้ำใส"],
      },
    ],
  },
  {
    name: "ฉะเชิงเทรา",
    districts: [
      {
        name: "เมืองฉะเชิงเทรา",
        postalCode: "24000",
        subDistricts: ["หน้าเมือง", "ท่าไข่", "บ้านใหม่", "คลองนา", "บางตีนเป็ด"],
      },
      {
        name: "บางคล้า",
        postalCode: "24110",
        subDistricts: ["บางคล้า", "บางสวน", "บางกระเจ็ด", "ปากน้ำ", "สาวชะโงก"],
      },
    ],
  },
  {
    name: "สตูล",
    districts: [
      {
        name: "เมืองสตูล",
        postalCode: "91000",
        subDistricts: ["พิมาน", "คลองขุด", "ควนขัน", "ควนโพธิ์", "ควนกาหลง"],
      },
      {
        name: "ควนโดน",
        postalCode: "91160",
        subDistricts: ["ควนโดน", "ควนสตอ", "ย่านซื่อ", "ทุ่งนุ้ย", "วังประจัน"],
      },
    ],
  },
  {
    name: "ตรัง",
    districts: [
      {
        name: "เมืองตรัง",
        postalCode: "92000",
        subDistricts: ["ทับเที่ยง", "นาตาล่วง", "ควนปริง", "ทุ่งยาว", "บางรัก"],
      },
      {
        name: "กันตัง",
        postalCode: "92110",
        subDistricts: ["กันตัง", "ควนธานี", "บางหมาก", "บางเป้า", "วังวน"],
      },
    ],
  },
  {
    name: "พัทลุง",
    districts: [
      {
        name: "เมืองพัทลุง",
        postalCode: "93000",
        subDistricts: ["คูหาสวรรค์", "เขาเจียก", "ท่ามิหรำ", "โคกชะงาย", "นาท่อม"],
      },
      {
        name: "กงหรา",
        postalCode: "93180",
        subDistricts: ["กงหรา", "ชะรัด", "คลองเฉลิม", "คลองทรายขาว", "สมหวัง"],
      },
    ],
  },
  {
    name: "ปัตตานี",
    districts: [
      {
        name: "เมืองปัตตานี",
        postalCode: "94000",
        subDistricts: ["สะบารัง", "อาเนาะรู", "จะบังติกอ", "บานา", "ตานี"],
      },
      {
        name: "โคกโพธิ์",
        postalCode: "94120",
        subDistricts: ["โคกโพธิ์", "มะกรูด", "บางโกระ", "ป่าบอน", "ทรายขาว"],
      },
    ],
  },
  {
    name: "ยะลา",
    districts: [
      {
        name: "เมืองยะลา",
        postalCode: "95000",
        subDistricts: ["สะเตง", "บุดี", "ยะลา", "ตาเซะ", "บาโงยซิแน"],
      },
      {
        name: "เบตง",
        postalCode: "95110",
        subDistricts: ["เบตง", "ยะรม", "ตาเนาะแมเราะ", "อัยเยอร์เวง", "ธารน้ำทิพย์"],
      },
    ],
  },
  {
    name: "นราธิวาส",
    districts: [
      {
        name: "เมืองนราธิวาส",
        postalCode: "96000",
        subDistricts: ["บางนาค", "ลำภู", "มะนังตายอ", "บางปอ", "กะลุวอ"],
      },
      {
        name: "ตากใบ",
        postalCode: "96110",
        subDistricts: ["ตากใบ", "เจ๊ะเห", "ไอร์โกะ", "กาลูปัง", "บาลอ"],
      },
    ],
  },
];

// Helper functions
export const getProvinces = () => {
  return thailandProvinces
    .map((p) => p.name)
    .sort((a, b) => a.localeCompare(b, "th"));
};

export const getDistrictsByProvince = (provinceName: string) => {
  const province = thailandProvinces.find((p) => p.name === provinceName);
  if (!province) return [];
  return province.districts
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, "th"));
};

export const getSubDistrictsByDistrict = (
  provinceName: string,
  districtName: string
) => {
  const province = thailandProvinces.find((p) => p.name === provinceName);
  if (!province) return [];
  const district = province.districts.find((d) => d.name === districtName);
  if (!district) return [];
  return district.subDistricts.sort((a, b) => a.localeCompare(b, "th"));
};

/**
 * Postal code data and lookup by (province, district).
 * The raw list below is district-level postal codes, mostly one per district.
 */
interface DistrictPostalCodeEntry {
  province: string;
  district: string;
  postal_code: string;
}

// Build a (province|district) -> postal code map from the province/district data above.
const postalCodeByProvinceDistrict: Record<string, string> =
  thailandProvinces.reduce((acc, province) => {
    province.districts.forEach((district) => {
      const key = `${province.name}|${district.name}`;
      if (!acc[key]) acc[key] = district.postalCode;
    });
    return acc;
  }, {} as Record<string, string>);

export const getPostalCodeForLocation = (
  provinceName: string,
  districtName: string,
  subDistrictName: string
): string | null => {
  if (!provinceName || !districtName) return null;
  const key = `${provinceName}|${districtName}`;
  return postalCodeByProvinceDistrict[key] ?? null;
};
