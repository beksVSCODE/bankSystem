import { ReactNode, useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
          className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-card shadow-lg border border-border lg:hidden"
        >
          {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile overlay */}
      {isMobile && isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 animate-slide-in">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main content */}
      <main className={`transition-all duration-300 ${isMobile ? 'ml-0' : 'ml-64'} min-h-screen`}>
        <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
