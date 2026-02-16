import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { AIChatBot } from './AIChatBot';
import { RobotOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatBotOpen, setChatBotOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      {/* Mobile Header - only on mobile */}
      {isMobile && <MobileHeader />}

      {/* Sidebar - Desktop only */}
      <div className="hidden lg:block">
        <Sidebar onCollapsedChange={setSidebarCollapsed} />
      </div>

      {/* Main content */}
      <main className={`transition-all duration-300 ease-in-out ${
        isMobile 
          ? 'ml-0 pb-[80px]' // Mobile: padding for bottom nav only (header is sticky now)
          : sidebarCollapsed 
            ? 'ml-20' 
            : 'ml-64'
      } min-h-screen`}>
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="animate-fadeIn">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation - only on mobile */}
      {isMobile && <MobileBottomNav />}

      {/* AI ChatBot Floating Button - Modern gradient */}
      {!chatBotOpen && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<RobotOutlined className="text-xl" />}
          onClick={() => setChatBotOpen(true)}
          className={`fixed right-6 w-14 h-14 shadow-2xl z-40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-purple-500/50 ${
            isMobile ? 'bottom-24' : 'bottom-6'
          }`}
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            border: 'none',
          }}
          title="AI Ассистент"
        />
      )}

      {/* AI ChatBot Component */}
      <AIChatBot open={chatBotOpen} onClose={() => setChatBotOpen(false)} />
    </div>
  );
};
