import { Card, List, Avatar, Tag, Button, Input, message, Space, Badge, Empty } from 'antd';
import { SendOutlined, FileOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { mockBankMessages } from '@/mock/paymentsAndReports';
import type { BankMessage } from '@/mock/types';

const BankMessages = () => {
  const [messages, setMessages] = useState<BankMessage[]>(mockBankMessages);
  const [selectedMessage, setSelectedMessage] = useState<BankMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) {
      message.warning('Введите текст сообщения');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setMessages(
      messages.map((msg) =>
        msg.id === selectedMessage?.id ? { ...msg, isRead: true } : msg
      )
    );
    message.success('Сообщение отправлено');
    setReplyText('');
    setIsLoading(false);
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (selectedMessage) {
    return (
      <div className="space-y-4">
        <Button onClick={() => setSelectedMessage(null)}>← Назад</Button>
        <Card className="border border-border shadow-sm rounded-lg">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedMessage.sender} • {new Date(selectedMessage.date).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p>{selectedMessage.message}</p>
            </div>
            {selectedMessage.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm">Вложения:</p>
                {selectedMessage.attachments.map((file) => (
                  <div key={file} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <FileOutlined />
                    <span className="text-sm">{file}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Ответить:</p>
              <Input.TextArea
                rows={3}
                placeholder="Введите ваше сообщение..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleReply}
                loading={isLoading}
                className="mt-2"
              >
                Отправить
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border border-border shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Переписка с банком {unreadCount > 0 && <Badge count={unreadCount} />}
      </h3>
      {messages.length === 0 ? (
        <Empty description="Сообщений нет" />
      ) : (
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer hover:bg-muted p-3 rounded transition ${
                !item.isRead ? 'bg-accent/10' : ''
              }`}
              onClick={() => setSelectedMessage(item)}
            >
              <List.Item.Meta
                avatar={<Avatar>{item.sender[0]}</Avatar>}
                title={
                  <div className="flex items-center gap-2">
                    <span>{item.subject}</span>
                    {!item.isRead && <Tag color="blue">Новое</Tag>}
                  </div>
                }
                description={
                  <div>
                    <p className="text-sm text-muted-foreground">{item.sender}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default BankMessages;
