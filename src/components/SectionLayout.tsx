import React from 'react';
import { Input, Segmented } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SectionLayoutProps {
  title: string;
  sidebarItems: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number | string;
  }>;
  selectedId: string;
  onSelectItem: (id: string) => void;
  children: React.ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: React.ReactNode;
  headerActions?: React.ReactNode;
  viewMode?: 'sidebar' | 'tabs';
}

export const SectionLayout: React.FC<SectionLayoutProps> = ({
  title,
  sidebarItems,
  selectedId,
  onSelectItem,
  children,
  searchPlaceholder = 'Поиск...',
  searchValue = '',
  onSearchChange,
  filters,
  headerActions,
  viewMode = 'sidebar',
}) => {
  const isMobile = window.innerWidth < 768;
  const effectiveViewMode = isMobile ? 'tabs' : viewMode;

  if (effectiveViewMode === 'tabs') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {searchValue !== undefined && (
            <div className="flex gap-2 flex-col sm:flex-row sm:items-center">
              <Input
                placeholder={searchPlaceholder}
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="flex-1"
              />
              {filters && <div className="flex gap-2">{filters}</div>}
            </div>
          )}
        </div>

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Segmented
            value={selectedId}
            onChange={(value) => onSelectItem(value as string)}
            options={sidebarItems.map((item) => ({
              label: item.label,
              value: item.id,
            }))}
            block
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          {headerActions && <div className="flex gap-2 flex-wrap">{headerActions}</div>}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {headerActions && <div className="flex gap-2 flex-wrap">{headerActions}</div>}
      </div>

      {searchValue !== undefined && (
        <div className="flex gap-2 flex-col sm:flex-row">
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="flex-1"
          />
          {filters && <div className="flex gap-2">{filters}</div>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden sticky top-4">
            <div className="divide-y divide-border">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectItem(item.id)}
                  className={`w-full text-left px-4 py-3 transition-colors duration-200 flex items-center gap-2 ${
                    selectedId === item.id
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  {item.icon && <span className="text-lg">{item.icon}</span>}
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
