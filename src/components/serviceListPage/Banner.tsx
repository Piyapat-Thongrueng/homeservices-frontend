const Banner = () => {
  return (
    <div>
      <section className="relative w-full h-42 overflow-hidden md:h-60">
        {/* Background Image */}
        <img
          src="./banner.jpg"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-95"
        />

        {/* Color Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#00195199" }}
        />

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="font-prompt text-[20px] font-bold mb-4 tracking-wide sm:text-[36px]">
            บริการของเรา
          </h1>
          <p className="font-prompt text-[14px] leading-relaxed max-w-2xl sm:text-[18px]">
            ซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน และอื่น ๆ อีกมากมาย
            <br />
            โดยพนักงานแม่บ้าน และช่างมืออาชีพ
          </p>
        </div>
      </section>
    </div>
  );
};

export default Banner;
