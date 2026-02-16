import { Button, Card, Menu, Space, Typography } from 'antd';
import type { AccountMenuGroup, AccountMenuItem } from '@/mock/accountsFeature';

interface AccountTabsMenuProps {
  primaryTabs: AccountMenuItem[];
  activePrimary: string;
  onPrimaryChange: (value: string) => void;
  groups?: AccountMenuGroup[];
  activeSecondary?: string;
  onSecondaryChange?: (value: string) => void;
}

export const AccountTabsMenu = ({
  primaryTabs,
  activePrimary,
  onPrimaryChange,
  groups,
  activeSecondary,
  onSecondaryChange,
}: AccountTabsMenuProps) => {
  const { Text } = Typography;
  const secondaryItems = (groups || []).map((group) => ({
    key: group.key,
    label: group.label,
    children: group.items.map((item) => ({ key: item.key, label: item.label })),
  }));

  return (
    <Card className="border-0 shadow-card sticky top-6" bordered={false}>
      <Space direction="vertical" size={12} className="w-full">
        <div>
          <div className="text-sm font-semibold">Действия по счету</div>
          <Text type="secondary" className="text-xs">Выберите раздел и поддействие</Text>
        </div>

        <Space direction="vertical" className="w-full">
          {primaryTabs.map((tab) => (
            <Button
              key={tab.key}
              type={activePrimary === tab.key ? 'primary' : 'default'}
              className="w-full text-left justify-start"
              onClick={() => onPrimaryChange(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </Space>

        {groups && onSecondaryChange && (
          <div className="pt-2 border-t border-border/60">
            <Menu
              mode="inline"
              selectedKeys={activeSecondary ? [activeSecondary] : []}
              items={secondaryItems}
              onSelect={(item) => onSecondaryChange(item.key)}
              style={{ borderRadius: 12 }}
            />
          </div>
        )}
      </Space>
    </Card>
  );
};
