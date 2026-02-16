import { Card, List, Button, Tag, Space, Empty } from 'antd';
import { CreditCardOutlined, PlusOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

interface CardItem {
  id: string;
  number: string;
  type: 'debit' | 'credit';
  status: 'active' | 'blocked';
  balance: number;
  expiry: string;
}

export const CardsList = ({ accountId }: { accountId: string }) => {
  const cards: CardItem[] = [
    {
      id: '1',
      number: '•••• 4532',
      type: 'debit',
      status: 'active',
      balance: 125450,
      expiry: '12/26',
    },
    {
      id: '2',
      number: '•••• 8901',
      type: 'debit',
      status: 'active',
      balance: 34500,
      expiry: '08/27',
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title="Банковские карты"
        className="shadow-sm"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Заказать новую карту
          </Button>
        }
      >
        {cards.length === 0 ? (
          <Empty description="У вас пока нет карт к этому счету">
            <Button type="primary" icon={<PlusOutlined />}>
              Заказать карту
            </Button>
          </Empty>
        ) : (
          <List
            dataSource={cards}
            renderItem={(card) => (
              <List.Item
                actions={[
                  <Button
                    key="toggle"
                    type="link"
                    icon={card.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
                  >
                    {card.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
                  </Button>,
                  <Button key="settings" type="link">
                    Настройки
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <CreditCardOutlined className="text-white text-2xl" />
                    </div>
                  }
                  title={
                    <Space>
                      <span className="font-mono font-bold">{card.number}</span>
                      <Tag color={card.type === 'debit' ? 'blue' : 'orange'}>
                        {card.type === 'debit' ? 'Дебетовая' : 'Кредитная'}
                      </Tag>
                      <Tag color={card.status === 'active' ? 'success' : 'error'}>
                        {card.status === 'active' ? 'Активна' : 'Заблокирована'}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <span className="text-lg font-semibold">
                        {card.balance.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="text-sm text-gray-500">
                        Действительна до: {card.expiry}
                      </span>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Card title="Доступные продукты" className="shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card hoverable className="border-2 border-dashed">
            <div className="text-center">
              <CreditCardOutlined className="text-4xl text-blue-500 mb-2" />
              <h3 className="font-semibold mb-1">Дебетовая карта</h3>
              <p className="text-sm text-gray-500 mb-3">
                Бесплатное обслуживание, кэшбэк до 5%
              </p>
              <Button type="primary">Заказать</Button>
            </div>
          </Card>

          <Card hoverable className="border-2 border-dashed">
            <div className="text-center">
              <CreditCardOutlined className="text-4xl text-orange-500 mb-2" />
              <h3 className="font-semibold mb-1">Кредитная карта</h3>
              <p className="text-sm text-gray-500 mb-3">
                До 300 000 ₽, льготный период 120 дней
              </p>
              <Button type="primary">Заказать</Button>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};
