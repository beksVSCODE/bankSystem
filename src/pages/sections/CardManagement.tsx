import { Card, List, Button, Switch, Empty, Tag } from 'antd';
import { LockOutlined, UnlockOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';

const CardManagement = () => {
  const [cards, setCards] = useState([
    { id: '1', number: '**** 1234', type: 'МастерКард', status: 'active', isBlocked: false },
    { id: '2', number: '**** 5678', type: 'Виза', status: 'active', isBlocked: false },
  ]);

  const handleToggleBlock = (id: string) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, isBlocked: !card.isBlocked, status: !card.isBlocked ? 'blocked' : 'active' } : card
      )
    );
  };

  return (
    <Card className="border border-border shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Мои карты</h3>
      {cards.length === 0 ? (
        <Empty description="Карт нет" />
      ) : (
        <List
          dataSource={cards}
          renderItem={(card) => (
            <List.Item>
              <List.Item.Meta
                avatar={<EyeOutlined className="text-xl" />}
                title={
                  <div className="flex items-center gap-2">
                    {card.type} {card.number}
                    <Tag color={card.isBlocked ? 'red' : 'green'}>{card.isBlocked ? 'Заблокирована' : 'Активна'}</Tag>
                  </div>
                }
              />
              <Switch
                checked={!card.isBlocked}
                onChange={() => handleToggleBlock(card.id)}
                checkedChildren={<UnlockOutlined />}
                unCheckedChildren={<LockOutlined />}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CardManagement;
