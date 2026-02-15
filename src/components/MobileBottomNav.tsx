import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  CreditCardOutlined,
  UnorderedListOutlined,
  PieChartOutlined,
  UserOutlined,
  SendOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const navItems = [
  { path: '/dashboard', label: 'Главная', icon: HomeOutlined },
  { path: '/payments', label: 'Платежи', icon: SendOutlined },
  { path: '/reports', label: 'Отчеты', icon: FileTextOutlined },
  { path: '/accounts', label: 'Счета', icon: CreditCardOutlined },
  { path: '/profile', label: 'Профиль', icon: UserOutlined },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
      {/* Safe area padding for devices with notches/home indicators */}
      <div className="flex justify-around items-center px-1 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs font-medium truncate max-w-full ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
