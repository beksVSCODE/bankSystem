import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  CreditCardOutlined,
  UnorderedListOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';

const navItems = [
  { path: '/dashboard', label: 'Главная', icon: HomeOutlined },
  { path: '/accounts', label: 'Счета', icon: CreditCardOutlined },
  { path: '/transactions', label: 'Операции', icon: UnorderedListOutlined },
  { path: '/analytics', label: 'Аналитика', icon: PieChartOutlined },
  { path: '/profile', label: 'Профиль', icon: UserOutlined },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 shadow-2xl">
      {/* Safe area padding for devices with notches/home indicators */}
      <div className="flex justify-around items-center px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <Icon className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs font-medium truncate max-w-full ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
