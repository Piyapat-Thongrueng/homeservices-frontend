import React from 'react';
import { User, ClipboardList, History } from 'lucide-react';

interface SidebarProps {
  activeTab: 'profile' | 'orders' | 'history';
 
  onTabChange?: (tab: 'profile' | 'orders' | 'history') => void; 
}

export default function OrderSidebar({ activeTab, onTabChange }: SidebarProps) {
  
  // ฟังก์ชันเช็กเงื่อนไขก่อนเปลี่ยนหน้า
  const handleClick = (tab: 'profile' | 'orders' | 'history') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit shrink-0">
      <h2 className="text-gray-500 font-semibold mb-4 border-b border-gray-100 pb-2">บัญชีผู้ใช้</h2>
      <nav className="flex flex-col space-y-2">
        
        <button 
          onClick={() => handleClick('profile')}
          className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User size={20} />
          <span>ข้อมูลผู้ใช้งาน</span>
        </button>
        
        <button 
          onClick={() => handleClick('orders')}
          className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'orders' ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ClipboardList size={20} />
          <span>รายการคำสั่งซ่อม</span>
        </button>

        <button 
          onClick={() => handleClick('history')}
          className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'history' ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <History size={20} />
          <span>ประวัติการซ่อม</span>
        </button>
        
      </nav>
    </aside>
  );
}