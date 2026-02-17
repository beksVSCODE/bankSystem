import { useState } from 'react';
import { Card, Button, Space, Segmented, Empty, Spin } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import { useTemplateStore, type AccountTemplate } from '@/mock/templateStore';

const categoryLabels: Record<string, string> = {
  reports: 'Отчёты',
  payments: 'Платежи',
  analytics: 'Аналитика',
  cards: 'Карты',
  settings: 'Настройки',
};

interface TemplateQuickAccessProps {
  accountId: string;
  onTemplateSelect: (template: AccountTemplate) => void;
  onManageTemplates: () => void;
}

export const TemplateQuickAccess = ({
  accountId,
  onTemplateSelect,
  onManageTemplates,
}: TemplateQuickAccessProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const templates = useTemplateStore((state) => state.getAllTemplates());

  const categories = Array.from(new Set(templates.map((t) => t.category)));
  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const categoryOptions = [
    { label: 'Все', value: 'all' },
    ...categories.map((cat) => ({
      label: categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat,
    })),
  ];

  return (
    <Card className="card-modern shadow-sm hover:shadow-md transition-all duration-300 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <BgColorsOutlined className="text-purple-600 text-lg" />
            <span className="hidden sm:inline">Шаблоны операций</span>
            <span className="sm:hidden">Шаблоны</span>
          </h3>
          <Button
            type="text"
            size="small"
            onClick={onManageTemplates}
            className="text-purple-600 hover:text-purple-700 text-xs"
          >
            <span className="hidden sm:inline">Управление →</span>
            <span className="sm:hidden">Все →</span>
          </Button>
        </div>

        {templates.length === 0 ? (
          <Empty 
            description={<span className="text-xs">Шаблонов нет</span>} 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="py-2"
          />
        ) : (
          <>
            {categoryOptions.length > 1 && (
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-2 flex-nowrap w-min">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedCategory(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === opt.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {filteredTemplates.slice(0, 8).map((template) => (
                <button
                  key={template.id}
                  onClick={() => onTemplateSelect(template)}
                  className="text-left p-2 sm:p-3 rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 active:scale-95"
                >
                  <div className="font-medium text-xs sm:text-sm text-foreground mb-1 truncate">
                    {template.name}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                    {template.description}
                  </div>
                  <div className="text-xs text-purple-600 mt-1 font-medium">
                    {template.actions.length} →
                  </div>
                </button>
              ))}
            </div>
            
            {filteredTemplates.length > 8 && (
              <div className="text-center">
                <Button 
                  type="link" 
                  size="small"
                  onClick={onManageTemplates}
                  className="text-xs text-purple-600"
                >
                  Показать все ({filteredTemplates.length})
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
