const HeroSection = () => {
  return (
    <div className="flex flex-col md:flex-row w-full bg-blue-100 px-5 md:px-16 lg:px-35 overflow-hidden">
      {/* LEFT: Text Content */}
      <div className="flex flex-col justify-center gap-5 pt-10 md:py-16 md:w-1/2">
        <h1 className="font-semibold font-prompt text-[40px] md:text-[50px] text-blue-700 leading-tight">
          เรื่องบ้าน...ให้เราช่วยดูแลคุณ
        </h1>
        <p className="font-prompt text-[24px] md:text-[30px] font-semibold text-black">
          "สะดวก ราคาคุ้มค่า เชื่อถือได้"
        </p>
        <p className="font-prompt text-[18px] md:text-[15px] font-semibold text-gray-700">
          ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน โดยพนักงานแม่บ้าน
          และช่างมืออาชีพ
        </p>
        <div>
          <button className="btn-primary px-10 cursor-pointer">เช็คราคาบริการ</button>
        </div>
      </div>
      {/* RIGHT: Image */}
      <div className="flex items-end justify-end md:justify-end md:w-1/2 mt-6 md:mt-0">
        <img
          src="/plumber.svg"
          alt="Plumber Image"
          className="block w-full md:max-w-full max-h-96 sm:max-h-96 md:max-h-105 h-auto object-contain object-bottom"
        />
      </div>
    </div>
  );
};

export default HeroSection;
