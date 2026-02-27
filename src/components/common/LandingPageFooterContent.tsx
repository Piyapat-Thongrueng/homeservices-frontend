/**
 * LandingPageFooterContent Component
 *
 * Promotional blue footer block used on the landing page to invite
 * technicians to join the platform, including descriptive copy and
 * a highlighted contact email.
 */
export default function LandingPageFooterContent() {
    return (
      // Outer container for full-width background
      <div className="w-full bg-blue-600 overflow-hidden">
        
        {/* Inner container to constrain max width on huge screens */}
        <div className="flex flex-col lg:flex-row w-full mx-auto">
          
          {/* Left Section - Image */}
          {/* Uses w-full on mobile, 39% width on desktop. min-h ensures it shows up on mobile */}
          <div className="relative w-full lg:w-[39%] ">
            <img
              src="/footer_image.svg"
              alt="Handyman with tools"
              className="w-full h-full object-cover object-center"
            />
            {/* Blue tint overlay to match the design */}
            <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
          </div>
  
          {/* Right Section - Content */}
          {/* flex-1 allows this section to fill the remaining space */}
          <div className="relative flex-1 bg-blue-600 px-6 py-10 lg:px-16 lg:py-0 flex flex-col justify-center">
            
            {/* Content Wrapper (z-10 to sit above the background icon) */}
            <div className="relative z-10 flex flex-col gap-4 lg:gap-8 text-utility-white">
              
              {/* Headline */}
              <h2 className="font-semibold text-3xl lg:text-4xl xl:text-5xl leading-tight font-prompt">
                มาร่วมเป็นพนักงานซ่อม<br />
                กับ HomeServices
              </h2>
  
              {/* Subtext */}
              <p className="headline-3 font-prompt max-w-lg">
                เข้ารับการฝึกอบรมที่ได้มาตรฐาน ฟรี! <br className="hidden lg:block" />
                และยังได้รับค่าตอบแทนที่มากขึ้นกว่าเดิม
              </p>
  
              {/* Email Section */}
              <div className="mt-2 font-prompt headline-1">
                <span>
                  ติดต่อมาที่อีเมล:{" "}
                </span>
                <a
                  href="mailto:job@homeservices.co"
                  className="hover:text-blue-200 transition-colors break-all cursor-pointer"
                >
                  job@homeservices.co
                </a>
              </div>
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