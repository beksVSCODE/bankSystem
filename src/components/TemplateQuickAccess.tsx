import { useState } from 'react';
import { Card, Button, Space, Segmented, Empty, Spin } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import { useTemplateStore, type AccountTemplate } from '@/mock/templateStore';

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
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat,
    })),
  ];

  return (
    <Card className="card-modern shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BgColorsOutlined className="text-purple-600" />
            Шаблоны операций
          </h3>
          <Button
            type="text"
            size="small"
            onClick={onManageTemplates}
            className="text-purple-600 hover:text-purple-700"
          >
            Управление →
          </Button>
        </div>

        {templates.length === 0 ? (
          <Empty description="Шаблонов нет" />
        ) : (
          <>
            <Segmented
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value as string)}
              options={categoryOptions}
              block
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onTemplateSelect(template)}
                  className="text-left p-3 rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 active:scale-95"
                >
                  <div className="font-medium text-sm text-foreground mb-1">
                    {template.name}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </div>
                  <div className="text-xs text-purple-600 mt-2 font-medium">
                    {template.actions.length} действий →
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
