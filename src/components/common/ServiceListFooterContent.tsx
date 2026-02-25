export default function ServiceListFooterContent() {
    return (
      // Outer container for full-width background
      <div className="w-full bg-blue-600 overflow-hidden">
        
        {/* Inner container to constrain max width on huge screens */}
        <div className="flex flex-col lg:flex-row w-full mx-auto ">
          
          {/* Content Section - Centered */}
          <div className="relative flex-1 bg-blue-600 px-6 py-10 lg:px-16 lg:py-0 h-71 flex flex-col justify-center items-center text-center overflow-hidden">
            
            {/* Content Wrapper (z-10 to sit above the background icon) */}
            <div className="relative z-10 flex flex-col gap-4 lg:gap-6 text-utility-white max-w-4xl">  
              
              {/* Main Text Content */}
              <p className="headline-3 text-center">
                เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ 1 แบบครบวงจร โดยทีมช่างมืออาชีพมากกว่า 100 ทีม<br />
                สามารถตอบโจทย์ด้านการบริการเรื่องบ้านของคุณ และสร้าง<br />
                ความสะดวกสบายในการติดต่อกับทีมช่าง ได้ทุกที่ ทุกเวลา ตลอด 24 ชม.<br />
                มั่นใจ ช่างไม่ทิ้งงาน พร้อมรับประกันคุณภาพงาน
              </p>
            </div>

            {/* House Icon Background Graphic */}
            {/* Positioned absolute relative to the blue content area */}
            <div 
              className="absolute right-0 bottom-0 pointer-events-none opacity-60 z-0"
              style={{
                height: '130%',
                aspectRatio: '1/1',
                transform: 'translate(30%, 15%)' // Shift it slightly off-screen like the design
              }}
            >
              <img
                src="/footer_house_logo.svg"
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
