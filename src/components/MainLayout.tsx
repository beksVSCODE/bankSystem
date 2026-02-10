import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { AIChatBot } from './AIChatBot';
import { MenuOutlined, CloseOutlined, RobotOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-3 right-3 z-[60] p-2.5 rounded-xl bg-card shadow-lg border border-border lg:hidden transition-all duration-200 active:scale-95 hover:shadow-xl"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <CloseOutlined className="text-lg" /> : <MenuOutlined className="text-lg" />}
        </button>
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar onCollapsedChange={setSidebarCollapsed} />
      </div>

      {/* Sidebar - Mobile overlay */}
      {isMobile && isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 animate-slideInFromRight">
            <Sidebar onCollapsedChange={setSidebarCollapsed} />
          </div>
        </>
      )}

      {/* Main content */}
      <main className={`transition-all duration-300 ease-in-out ${isMobile ? 'ml-0 pt-14' : sidebarCollapsed ? 'ml-20' : 'ml-64'} min-h-screen`}>
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="animate-fadeIn">
            {children}
          </div>
        </div>
      </main>

      {/* AI ChatBot Floating Button */}
      {!chatBotOpen && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<RobotOutlined className="text-xl" />}
          onClick={() => setChatBotOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 shadow-2xl z-40 flex items-center justify-center hover:scale-110 transition-transform"
          title="AI Ассистент"
        />
      )}

      {/* AI ChatBot Component */}
      <AIChatBot open={chatBotOpen} onClose={() => setChatBotOpen(false)} />
    </div>
  );
};
