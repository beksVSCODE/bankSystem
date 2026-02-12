import { useState } from 'react';
import { SearchOutlined, BellOutlined } from '@ant-design/icons';
import { Badge, List, Popover } from 'antd';
import { mockNotifications } from '@/mock/data';
import { GlobalSearch } from './GlobalSearch';

export const MobileHeader = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const notificationContent = (
    <List
      className="w-72 max-h-96 overflow-y-auto"
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
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-sidebar z-50 shadow-lg">
        <div 
          className="relative"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 81, 168, 0.98) 0%, rgba(0, 81, 168, 1) 100%)',
          }}
        >
          {/* Solid background base for mobile */}
          <div className="absolute inset-0 bg-blue-700/10 pointer-events-none"></div>
          
          {/* Top row: Logo and Bell */}
          <div className="relative flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                <span className="text-white font-bold text-base">S</span>
              </div>
              <span className="font-semibold text-base tracking-tight text-white">SovcomBank</span>
            </div>

            {/* Bell Icon with Badge */}
            <Popover
              content={notificationContent}
              title={<span className="text-sm font-medium">Уведомления</span>}
              trigger="click"
              placement="bottomRight"
              open={notificationsOpen}
              onOpenChange={setNotificationsOpen}
              overlayClassName="mobile-notifications-popover"
            >
              <button className="p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-all duration-200">
                <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                  <BellOutlined className="text-lg text-white" />
                </Badge>
              </button>
            </Popover>
          </div>

          {/* Search Bar */}
          <div className="relative px-4 pb-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-sm transition-all duration-200 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 flex items-center gap-2"
            >
              <SearchOutlined className="text-base text-white/70" />
              <span className="flex-1 text-left text-sm text-white/70">Поиск...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-xs text-white/60 shadow-sm">⌘K</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
