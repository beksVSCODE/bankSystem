import { useState } from 'react';
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
} from '@ant-design/icons';
import { Badge, Avatar, Tooltip, Popover, List } from 'antd';
import { useAuthStore } from '@/mock/authStore';
import { mockNotifications, mockUser } from '@/mock/data';

const navItems = [
  { path: '/dashboard', label: 'Главная', icon: HomeOutlined },
  { path: '/accounts', label: 'Счета', icon: CreditCardOutlined },
  { path: '/transactions', label: 'Операции', icon: UnorderedListOutlined },
  { path: '/analytics', label: 'Аналитика', icon: PieChartOutlined },
  { path: '/profile', label: 'Профиль', icon: UserOutlined },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = mockNotifications.filter(n => !n.read).length;

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
    <aside 
      className={`fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 
        ${collapsed ? 'w-20' : 'w-64'} flex flex-col shadow-xl`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-lg tracking-tight">SovcomBank</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Tooltip title={collapsed ? item.label : ''} placement="right">
                  <NavLink
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="text-lg" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {/* Notifications */}
        <Popover content={notificationContent} title="Уведомления" trigger="click" placement="rightTop">
          <button className={`nav-link w-full ${collapsed ? 'justify-center' : ''}`}>
            <Badge count={unreadCount} size="small" offset={[-2, 2]}>
              <BellOutlined className="text-lg text-sidebar-foreground" />
            </Badge>
            {!collapsed && <span>Уведомления</span>}
          </button>
        </Popover>

        {/* User */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-4 py-2">
            <Avatar size={36} className="bg-white/20">
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
  );
};
