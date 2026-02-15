import { Button, Card, Form, Input, InputNumber, List, Modal, Select, Space, Switch, message } from 'antd';
import { useState } from 'react';
import type { AccountRecord, AccountSettingsRecord } from '@/mock/accountsFeature';

interface AccountSettingsSectionProps {
  account: AccountRecord;
  settings?: AccountSettingsRecord;
  onRename: (name: string) => void;
  onSettingsUpdate: (patch: Partial<AccountSettingsRecord>) => void;
}

const mockUsers = [
  { id: 'usr-1', name: 'Иван Петров', role: 'Владелец' },
  { id: 'usr-2', name: 'Мария Климова', role: 'Оператор' },
  { id: 'usr-3', name: 'Даниил Орлов', role: 'Просмотр' },
];

export const AccountSettingsSection = ({
  account,
  settings,
  onRename,
  onSettingsUpdate,
}: AccountSettingsSectionProps) => {
  const [form] = Form.useForm();
  const [stateMode, setStateMode] = useState<'loading' | 'ready' | 'empty' | 'error'>('ready');
  const [activeSection, setActiveSection] = useState<'main' | 'security' | 'access' | 'tariff'>('main');

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-card" bordered={false}>
        <Space>
          <Button onClick={() => setStateMode((prev) => (prev === 'loading' ? 'ready' : 'loading'))}>Loading</Button>
          <Button onClick={() => setStateMode('empty')}>Empty</Button>
          <Button danger onClick={() => setStateMode('error')}>Error</Button>
        </Space>
      </Card>
      {stateMode === 'loading' && <Card className="border-0 shadow-card" bordered={false}>Загрузка настроек...</Card>}
      {stateMode === 'error' && <Card className="border-0 shadow-card" bordered={false}>Ошибка загрузки настроек.</Card>}
      {stateMode === 'empty' && <Card className="border-0 shadow-card" bordered={false}>Нет данных по настройкам.</Card>}
      {stateMode === 'ready' && (
        <>
          <Card className="border-0 shadow-card" bordered={false}>
            <Space wrap>
              <Button type={activeSection === 'main' ? 'primary' : 'default'} onClick={() => setActiveSection('main')}>Основные</Button>
              <Button type={activeSection === 'security' ? 'primary' : 'default'} onClick={() => setActiveSection('security')}>Безопасность</Button>
              <Button type={activeSection === 'access' ? 'primary' : 'default'} onClick={() => setActiveSection('access')}>Доступы</Button>
              <Button type={activeSection === 'tariff' ? 'primary' : 'default'} onClick={() => setActiveSection('tariff')}>Тариф</Button>
            </Space>
          </Card>

          {activeSection === 'main' && (
            <>
              <Card title="Основные параметры" className="border-0 shadow-card" bordered={false}>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    name: account.name,
                    visible: settings?.visible ?? true,
                    notificationsEmail: settings?.notificationsEmail ?? true,
                    notificationsSms: settings?.notificationsSms ?? true,
                    notificationsPush: settings?.notificationsPush ?? false,
                    dayLimit: settings?.dayLimit ?? 1000000,
                    monthLimit: settings?.monthLimit ?? 8000000,
                    confirmationMethod: settings?.confirmationMethod ?? 'sms',
                  }}
                  onFinish={(values) => {
                    onRename(values.name);
                    onSettingsUpdate(values);
                    message.success('Настройки сохранены');
                  }}
                >
                  <Form.Item label="Название счета" name="name"><Input /></Form.Item>
                  <Form.Item label="Отображать в списке" name="visible" valuePropName="checked"><Switch /></Form.Item>
                  <Form.Item label="Email уведомления" name="notificationsEmail" valuePropName="checked"><Switch /></Form.Item>
                  <Form.Item label="SMS уведомления" name="notificationsSms" valuePropName="checked"><Switch /></Form.Item>
                  <Form.Item label="Push уведомления" name="notificationsPush" valuePropName="checked"><Switch /></Form.Item>
                  <Form.Item label="Лимит в день" name="dayLimit"><InputNumber className="w-full" /></Form.Item>
                  <Form.Item label="Лимит в месяц" name="monthLimit"><InputNumber className="w-full" /></Form.Item>
                  <Form.Item label="Подтверждение операций" name="confirmationMethod">
                    <Select options={[{ label: 'SMS', value: 'sms' }, { label: '2FA', value: '2fa' }]} />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">Сохранить</Button>
                </Form>
              </Card>
              <Card title="Закрытие / архивация счета" className="border-0 shadow-card" bordered={false}>
                <Space>
                  <Button
                    onClick={() =>
                      Modal.confirm({
                        title: 'Архивировать счет?',
                        content: 'Счет останется в истории, но будет скрыт из активных.',
                        onOk: () => message.warning('Счет архивирован (mock)'),
                      })
                    }
                  >
                    Архивировать
                  </Button>
                  <Button
                    danger
                    onClick={() =>
                      Modal.confirm({
                        title: 'Закрыть счет?',
                        content: 'Операция необратима (mock).',
                        onOk: () => message.warning('Счет закрывается (mock)'),
                      })
                    }
                  >
                    Закрыть счет
                  </Button>
                </Space>
              </Card>
            </>
          )}

          {activeSection === 'security' && (
            <Card title="Безопасность" className="border-0 shadow-card" bordered={false}>
              <Space direction="vertical">
                <div className="flex items-center justify-between gap-8"><span>Двухфакторная авторизация</span><Switch /></div>
                <div className="flex items-center justify-between gap-8"><span>Подпись документов (ЭЦП)</span><Switch /></div>
                <div className="flex items-center justify-between gap-8"><span>Подтверждение по SMS</span><Switch defaultChecked /></div>
              </Space>
            </Card>
          )}

          {activeSection === 'access' && (
            <Card title="Доступы и роли" className="border-0 shadow-card" bordered={false}>
              <List
                dataSource={mockUsers}
                renderItem={(item) => (
                  <List.Item actions={[<Switch key={item.id} defaultChecked={item.role !== 'Просмотр'} />]}>
                    <List.Item.Meta title={item.name} description={item.role} />
                  </List.Item>
                )}
              />
            </Card>
          )}

          {activeSection === 'tariff' && (
            <Card title="Тариф" className="border-0 shadow-card" bordered={false}>
              <Space direction="vertical">
                <div><strong>Текущий тариф:</strong> {account.tariff}</div>
                <div><strong>Комиссии:</strong> {account.commission}</div>
                <Button>История смены тарифа</Button>
                <Button>Подключенные услуги</Button>
              </Space>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
