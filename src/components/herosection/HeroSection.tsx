const HeroSection = () => {


  return (
    <div className="w-full bg-blue-100 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-6 md:px-16 lg:px-24 flex flex-col md:flex-row">
        {/* LEFT: Text Content */}
        <div className="flex flex-col justify-center gap-5 pt-15 md:py-16 md:w-1/2">
          <h1 className="font-semibold font-prompt text-[45px] md:text-[55px] text-blue-700 leading-tight">
            เรื่องบ้าน...ให้เราช่วยดูแลคุณ
          </h1>
          <p className="font-prompt pb-5 text-[24px] md:text-[40px] font-semibold text-black">
            "สะดวก ราคาคุ้มค่า เชื่อถือได้"
          </p>
          <p className="font-prompt font-base text-[22px] md:text-[28px] text-gray-700">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน โดยพนักงานแม่บ้าน
            และช่างมืออาชีพ
          </p>
          <div>
            <button
              className="btn-primary font-medium py-4 text-2xl px-10 cursor-pointer"
            >
              เช็คราคาบริการ
            </button>
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="flex items-end justify-end md:w-1/2 mt-6 md:mt-0">
          <img
            src="/plumber.svg"
            alt="Plumber Image"
            className="block w-full md:max-w-full max-h-125 md:max-h-150 h-auto object-contain object-bottom"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
