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
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

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
        className={`fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 
          ${collapsed ? 'w-20' : 'w-64'} flex flex-col shadow-xl overflow-y-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">S</span>
            </div>
            {!collapsed && (
              <span className="font-semibold text-base sm:text-lg tracking-tight">SovcomBank</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-sidebar-accent transition-colors hidden lg:block"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Search Button */}
        <div className="px-2 sm:px-3 pt-3 sm:pt-4 shrink-0">
          <Tooltip title={collapsed ? 'Поиск (⌘K)' : ''} placement="right">
            <button
              onClick={() => setSearchOpen(true)}
              className={`nav-link w-full bg-white/5 hover:bg-white/10 text-sm sm:text-base ${collapsed ? 'justify-center' : ''}`}
            >
              <SearchOutlined className="text-lg" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm sm:text-base">Поиск...</span>
                  <kbd className="px-1 sm:px-1.5 py-0.5 rounded bg-white/10 text-[10px] sm:text-xs">⌘K</kbd>
                </>
              )}
            </button>
          </Tooltip>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 sm:py-4 px-2 sm:px-3 overflow-y-auto">
          <ul className="space-y-0.5 sm:space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Tooltip title={collapsed ? item.label : ''} placement="right">
                    <NavLink
                      to={item.path}
                      className={`nav-link text-sm sm:text-base ${isActive ? 'active' : ''}`}
                    >
                      <Icon className="text-base sm:text-lg" />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-2 sm:p-3 border-t border-sidebar-border space-y-1.5 sm:space-y-2 shrink-0">
          {/* Notifications */}
          <Popover content={notificationContent} title="Уведомления" trigger="click" placement="rightTop">
            <button className={`nav-link w-full text-sm sm:text-base ${collapsed ? 'justify-center' : ''}`}>
              <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                <BellOutlined className="text-base sm:text-lg text-sidebar-foreground" />
              </Badge>
              {!collapsed && <span>Уведомления</span>}
            </button>
          </Popover>

          {/* User */}
          {!collapsed && (
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2">
              <Avatar size={32} className="bg-white/20 sm:w-9 sm:h-9">
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
