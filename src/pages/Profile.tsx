import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Button, Form, Input, Switch, Divider, Tag, message, Modal } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  BellOutlined,
  GlobalOutlined,
  LockOutlined,
  EditOutlined,
  LogoutOutlined,
  CheckCircleOutlined,
  RobotOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { MainLayout } from '@/components/MainLayout';
import { mockUser, formatDate } from '@/mock/data';
import { useAuthStore } from '@/mock/authStore';
import { aiService } from '@/services/aiService';

const Profile = () => {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [language, setLanguage] = useState('ru');
  const [openAIKey, setOpenAIKey] = useState(aiService.getApiKey());
  const [showApiKey, setShowApiKey] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handleLogout = () => {
    Modal.confirm({
      title: 'Выход из системы',
      content: 'Вы уверены, что хотите выйти?',
      okText: 'Выйти',
      cancelText: 'Отмена',
      onOk: () => {
        logout();
        navigate('/login');
      },
    });
  };

  const handleEditSave = () => {
    message.success('Данные успешно сохранены');
    setIsEditModalOpen(false);
  };

  const handleSaveApiKey = () => {
    if (openAIKey.trim()) {
      aiService.setApiKey(openAIKey.trim());
      message.success('API ключ успешно сохранен');
      setIsApiKeyModalOpen(false);
    } else {
      message.error('Введите корректный API ключ');
    }
  };

  const handleRemoveApiKey = () => {
    Modal.confirm({
      title: 'Удалить API ключ?',
      content: 'AI ассистент перестанет работать. Вы сможете добавить ключ позже.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => {
        aiService.setApiKey('');
        setOpenAIKey('');
        message.success('API ключ удален');
      },
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Профиль</h1>
          <p className="text-muted-foreground">Управление личными данными и настройками</p>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-card overflow-hidden" bordered={false}>
          <div 
            className="h-24 -mx-6 -mt-6 mb-4"
            style={{ background: 'var(--bank-gradient)' }}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 relative z-10">
            <Avatar
              size={96}
              className="border-4 border-card bg-primary text-2xl font-bold"
            >
              {mockUser.firstName[0]}{mockUser.lastName[0]}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">
                  {mockUser.lastName} {mockUser.firstName} {mockUser.middleName}
                </h2>
                <CheckCircleOutlined className="text-success" />
              </div>
              <div className="flex items-center gap-3">
                <Tag color="blue">
                  {mockUser.userType === 'individual' ? 'Физическое лицо' : 'Юридическое лицо'}
                </Tag>
                <span className="text-sm text-muted-foreground">
                  Клиент с {formatDate(mockUser.createdAt)}
                </span>
              </div>
            </div>
            <Button 
              icon={<EditOutlined />} 
              onClick={() => setIsEditModalOpen(true)}
            >
              Редактировать
            </Button>
          </div>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <UserOutlined className="text-primary" />
                Контактная информация
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <MailOutlined className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{mockUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <PhoneOutlined className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Телефон</p>
                    <p className="font-medium">{mockUser.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <SafetyOutlined className="text-primary" />
                Безопасность
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <LockOutlined className="text-muted-foreground" />
                    <span>Двухфакторная аутентификация</span>
                  </div>
                  <Tag color="green">Включена</Tag>
                </div>
                <Button icon={<LockOutlined />} block>
                  Изменить пароль
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications Settings */}
        <Card className="border-0 shadow-card" bordered={false}>
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <BellOutlined className="text-primary" />
            Уведомления
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Email уведомления</p>
                <p className="text-sm text-muted-foreground">Получать уведомления на почту</p>
              </div>
              <Switch
                checked={notifications.email}
                onChange={checked => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Push-уведомления</p>
                <p className="text-sm text-muted-foreground">Получать push-уведомления в браузере</p>
              </div>
              <Switch
                checked={notifications.push}
                onChange={checked => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">SMS уведомления</p>
                <p className="text-sm text-muted-foreground">Получать SMS о транзакциях</p>
              </div>
              <Switch
                checked={notifications.sms}
                onChange={checked => setNotifications({ ...notifications, sms: checked })}
              />
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="border-0 shadow-card" bordered={false}>
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <GlobalOutlined className="text-primary" />
            Язык интерфейса
          </h3>
          <div className="flex gap-3">
            <Button
              type={language === 'ru' ? 'primary' : 'default'}
              onClick={() => setLanguage('ru')}
            >
              🇷🇺 Русский
            </Button>
            <Button
              type={language === 'en' ? 'primary' : 'default'}
              onClick={() => setLanguage('en')}
            >
              🇬🇧 English
            </Button>
          </div>
        </Card>

        {/* AI Settings */}
        <Card className="border-0 shadow-card" bordered={false}>
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
            <RobotOutlined className="text-primary" />
            AI Ассистент (Google Gemini)
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">Google Gemini API Ключ</p>
                  <p className="text-sm text-muted-foreground">
                    Бесплатный API для работы AI финансового ассистента
                  </p>
                </div>
                <Tag color={openAIKey ? 'green' : 'default'}>
                  {openAIKey ? '🟢 Настроен' : '⚪ Не настроен'}
                </Tag>
              </div>
              
              {openAIKey && (
                <div className="mb-3 p-3 bg-background rounded border border-border">
                  <div className="flex items-center gap-2">
                    <code className="text-xs flex-1 overflow-hidden text-ellipsis">
                      {showApiKey ? openAIKey : '••••••••••••••••••••••••••••••••'}
                    </code>
                    <Button
                      type="text"
                      size="small"
                      icon={showApiKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      onClick={() => setShowApiKey(!showApiKey)}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setIsApiKeyModalOpen(true)}
                >
                  {openAIKey ? 'Изменить ключ' : 'Добавить ключ'}
                </Button>
                {openAIKey && (
                  <Button
                    danger
                    onClick={handleRemoveApiKey}
                  >
                    Удалить
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>ℹ️ Как получить бесплатный API ключ:</strong>
              </p>
              <ol className="text-sm text-blue-800 dark:text-blue-200 mt-2 ml-4 space-y-1">
                <li>1. Перейдите на <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">makersuite.google.com/app/apikey</a></li>
                <li>2. Войдите через Google аккаунт</li>
                <li>3. Нажмите "Create API key"</li>
                <li>4. Скопируйте ключ и вставьте здесь</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Logout */}
        <Card className="border-0 shadow-card border-destructive/20" bordered={false}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Выход из системы</h3>
              <p className="text-sm text-muted-foreground">
                Последний вход: {formatDate(mockUser.lastLogin)}
              </p>
            </div>
            <Button 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
        </Card>

        {/* Edit Modal */}
        <Modal
          title="Редактирование профиля"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onOk={handleEditSave}
          okText="Сохранить"
          cancelText="Отмена"
        >
          <Form layout="vertical" className="mt-4">
            <Form.Item label="Фамилия">
              <Input defaultValue={mockUser.lastName} />
            </Form.Item>
            <Form.Item label="Имя">
              <Input defaultValue={mockUser.firstName} />
            </Form.Item>
            <Form.Item label="Отчество">
              <Input defaultValue={mockUser.middleName} />
            </Form.Item>
            <Form.Item label="Email">
              <Input defaultValue={mockUser.email} type="email" />
            </Form.Item>
            <Form.Item label="Телефон">
              <Input defaultValue={mockUser.phone} />
            </Form.Item>
          </Form>
        </Modal>

        {/* API Key Modal */}
        <Modal
          title="Настройка Google Gemini API Ключа"
          open={isApiKeyModalOpen}
          onCancel={() => setIsApiKeyModalOpen(false)}
          onOk={handleSaveApiKey}
          okText="Сохранить"
          cancelText="Отмена"
        >
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200 dark:border-yellow-900">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                <strong>⚠️ Безопасность:</strong> API ключ сохраняется локально в вашем браузере и не отправляется на наши серверы.
              </p>
            </div>
            
            <Form layout="vertical">
              <Form.Item 
                label="Google Gemini API Ключ"
                extra="Ключ имеет формат: AIza..."
              >
                <Input.Password
                  placeholder="AIza..."
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  autoComplete="off"
                />
              </Form.Item>
            </Form>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                <strong>Где получить бесплатный API ключ?</strong>
              </p>
              <ol className="text-sm text-blue-800 dark:text-blue-200 ml-4 space-y-1">
                <li>1. Зайдите на <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium">makersuite.google.com/app/apikey</a></li>
                <li>2. Нажмите "Create API key"</li>
                <li>3. Скопируйте ключ и вставьте выше</li>
              </ol>
            </div>
          </div>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Profile;
