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
} from '@ant-design/icons';
import { Badge, Avatar, Tooltip, Popover, List } from 'antd';
import { useAuthStore } from '@/mock/authStore';
import { mockNotifications, mockUser } from '@/mock/data';
import { GlobalSearch } from './GlobalSearch';

const navItems = [
  { path: '/dashboard', label: 'Главная', icon: HomeOutlined },
  { path: '/accounts', label: 'Счета', icon: CreditCardOutlined },
  { path: '/transactions', label: 'Операции', icon: UnorderedListOutlined },
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
        className={`fixed ${isMobile ? 'right-0' : 'left-0'} top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 
          ${collapsed ? 'w-20' : 'w-64'} flex flex-col shadow-2xl overflow-y-auto backdrop-blur-sm`}
        style={{
          background: 'linear-gradient(180deg, rgba(0, 81, 168, 0.97) 0%, rgba(0, 81, 168, 1) 100%)',
        }}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Logo */}
        <div className="relative flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-lg">
              <span className="text-white font-bold text-base sm:text-lg">S</span>
            </div>
            {!collapsed && (
              <span className="font-semibold text-base sm:text-lg tracking-tight animate-fadeIn">SovcomBank</span>
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
              className={`nav-link w-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-sm sm:text-base transition-all duration-200 ${collapsed ? 'justify-center' : ''} backdrop-blur-sm border border-white/20`}
            >
              <SearchOutlined className="text-lg" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm sm:text-base">Поиск...</span>
                  <kbd className="px-1 sm:px-1.5 py-0.5 rounded bg-white/20 text-[10px] sm:text-xs shadow-sm">⌘K</kbd>
                </>
              )}
            </button>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 py-3 sm:py-4 px-2 sm:px-3 overflow-y-auto">
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
                      className={`nav-link text-sm sm:text-base group relative ${isActive ? 'active bg-white/20 shadow-md' : 'hover:bg-white/10 active:bg-white/20'} transition-all duration-200`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></span>
                      )}
                      <Icon className="text-base sm:text-lg transition-transform duration-200 group-hover:scale-110" />
                      {!collapsed && <span className="transition-transform duration-200">{item.label}</span>}
                    </NavLink>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="relative p-2 sm:p-3 border-t border-white/10 space-y-1.5 sm:space-y-2 shrink-0 backdrop-blur-sm">
          {/* Notifications */}
          <Popover content={notificationContent} title="Уведомления" trigger="click" placement="rightTop">
            <button className={`nav-link w-full text-sm sm:text-base hover:bg-white/10 active:bg-white/20 transition-all duration-200 ${collapsed ? 'justify-center' : ''}`}>
              <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                <BellOutlined className="text-base sm:text-lg text-sidebar-foreground" />
              </Badge>
              {!collapsed && <span>Уведомления</span>}
            </button>
          </Popover>

          {/* User */}
          {!collapsed && (
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Avatar size={32} className="bg-white/30 backdrop-blur-sm sm:w-9 sm:h-9 ring-2 ring-white/40">
                {mockUser.firstName[0]}{mockUser.lastName[0]}
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {mockUser.firstName} {mockUser.lastName}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {mockUser.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <Tooltip title={collapsed ? 'Выйти' : ''} placement="right">
            <button
              onClick={handleLogout}
              className={`nav-link w-full text-red-300 hover:text-red-200 hover:bg-red-500/20 ${collapsed ? 'justify-center' : ''}`}
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
