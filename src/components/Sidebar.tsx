import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  CreditCardOutlined,
  UnorderedListOutlined,
  PieChartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  SendOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Badge, Avatar, Tooltip, Popover, List } from 'antd';
import { useAuthStore } from '@/mock/authStore';
import { mockNotifications, mockUser } from '@/mock/data';
import { GlobalSearch } from './GlobalSearch';

const navItems = [
  { path: '/dashboard', label: 'Главная', icon: HomeOutlined },
  { path: '/accounts', label: 'Счета', icon: CreditCardOutlined },
  { path: '/transactions', label: 'Операции', icon: UnorderedListOutlined },
  { path: '/payments', label: 'Платежи и переводы', icon: SendOutlined },
  { path: '/reports', label: 'Отчеты', icon: FileTextOutlined },
  { path: '/analytics', label: 'Аналитика', icon: PieChartOutlined },
  { path: '/profile', label: 'Профиль', icon: UserOutlined },
];

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export const Sidebar = ({ onCollapsedChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  // Notify parent about collapsed state changes
  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const notificationContent = (
    <List
      className="w-72"
      dataSource={mockNotifications}
      renderItem={item => (
        <List.Item className={`${!item.read ? 'bg-accent/30' : ''} px-3 py-2`}>
          <List.Item.Meta
            title={<span className="text-sm font-medium">{item.title}</span>}
            description={<span className="text-xs text-muted-foreground">{item.message}</span>}
          />
        </List.Item>
      )}
    />
  );

  return (
    <>
      <aside 
        className={`fixed ${isMobile ? 'right-0' : 'left-0'} top-0 h-full text-white transition-all duration-300 z-50 
          ${collapsed ? 'w-20' : 'w-64'} flex flex-col shadow-2xl overflow-y-auto`}
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          boxShadow: '4px 0 24px rgba(99, 102, 241, 0.15)',
        }}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/10 pointer-events-none"></div>
        
        {/* Logo */}
        <div className="relative flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center ring-2 ring-purple-400/30 shadow-lg">
              <span className="text-white font-bold text-base sm:text-lg">F</span>
            </div>
            {!collapsed && (
              <span className="font-semibold text-base sm:text-lg tracking-tight animate-fadeIn">FinSim</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-all duration-200 hidden lg:block"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Search Button */}
        <div className="relative px-2 sm:px-3 pt-3 sm:pt-4 shrink-0">
          <Tooltip title={collapsed ? 'Поиск (⌘K)' : ''} placement="right">
            <button
              onClick={() => setSearchOpen(true)}
              className={`nav-link w-full bg-white/5 hover:bg-white/10 active:bg-white/15 text-sm sm:text-base transition-all duration-200 ${collapsed ? 'justify-center' : ''} backdrop-blur-sm border border-white/10 hover:border-purple-400/30`}
            >
              <SearchOutlined className="text-lg" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm sm:text-base">Поиск...</span>
                  <kbd className="px-1 sm:px-1.5 py-0.5 rounded bg-white/10 text-[10px] sm:text-xs shadow-sm border border-white/10">⌘K</kbd>
                </>
              )}
            </button>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 py-3 sm:py-4 px-2 sm:px-3 overflow-y-auto modern-scrollbar">
          <ul className="space-y-0.5 sm:space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li 
                  key={item.path}
                  style={{
                    animation: 'slideIn 0.3s ease-out',
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <Tooltip title={collapsed ? item.label : ''} placement="right">
                    <NavLink
                      to={item.path}
                      className={`nav-link text-sm sm:text-base group relative ${
                        isActive 
                          ? 'active bg-gradient-to-r from-purple-500/20 to-indigo-500/20 shadow-md border-l-4 border-purple-400' 
                          : 'hover:bg-white/5 active:bg-white/10 border-l-4 border-transparent'
                      } transition-all duration-200`}
                    >
                      <Icon className="text-base sm:text-lg transition-transform duration-200 group-hover:scale-110" />
                      {!collapsed && <span className="transition-transform duration-200">{item.label}</span>}
                      {isActive && !collapsed && (
                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-glow"></div>
                      )}
                    </NavLink>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="relative p-2 sm:p-3 border-t border-white/10 space-y-1.5 sm:space-y-2 shrink-0 backdrop-blur-sm bg-white/5">
          {/* Notifications */}
          <Popover content={notificationContent} title="Уведомления" trigger="click" placement="rightTop">
            <button className={`nav-link w-full text-sm sm:text-base hover:bg-white/10 active:bg-white/20 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}>
              <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                <BellOutlined className="text-base sm:text-lg" />
              </Badge>
              {!collapsed && <span>Уведомления</span>}
            </button>
          </Popover>

          {/* User */}
          {!collapsed && (
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-lg backdrop-blur-sm ring-1 ring-white/10 hover:ring-purple-400/30 transition-all duration-200">
              <Avatar size={32} className="bg-gradient-to-br from-purple-500 to-indigo-600 sm:w-9 sm:h-9 ring-2 ring-white/20">
                {mockUser.firstName[0]}{mockUser.lastName[0]}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {mockUser.firstName} {mockUser.lastName}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {mockUser.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <Tooltip title={collapsed ? 'Выйти' : ''} placement="right">
            <button
              onClick={handleLogout}
              className={`nav-link w-full text-red-300 hover:text-red-200 hover:bg-red-500/20 active:bg-red-500/30 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}
            >
              <LogoutOutlined className="text-lg" />
              {!collapsed && <span>Выйти</span>}
            </button>
          </Tooltip>
        </div>
      </aside>

      {/* Global Search Modal */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
