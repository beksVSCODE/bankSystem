import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, BankOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/mock/authStore';

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore(state => state.login);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        message.success('Добро пожаловать!');
        navigate(from, { replace: true });
      } else {
        message.error('Неверный логин или пароль');
      }
    } catch {
      message.error('Произошла ошибка. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-900/20"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite 1s' }}></div>
        
        <div className="max-w-md text-white text-center relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center mx-auto mb-8 ring-2 ring-white/30 shadow-2xl">
            <BankOutlined className="text-5xl text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">FinSim</h1>
          <p className="text-xl text-white/90 mb-8 font-medium">
            Современный интернет-банк для управления вашими финансами
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-xs text-white/80">Доступ</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl font-bold mb-1">0 ₽</div>
              <div className="text-xs text-white/80">Комиссия</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20">
              <div className="text-2xl font-bold mb-1">5 мин</div>
              <div className="text-xs text-white/80">Переводы</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
        <Card className="w-full max-w-md shadow-2xl border-0 card-modern" bordered={false}>
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BankOutlined className="text-3xl text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">FinSim</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Вход в систему</h2>
            <p className="text-muted-foreground mt-2">
              Введите данные для входа в личный кабинет
            </p>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Введите логин или email' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-muted-foreground" />}
                placeholder="Логин или email"
                className="input-bank h-12"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Введите пароль' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-muted-foreground" />}
                placeholder="Пароль"
                className="input-bank h-12"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex items-center justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Запомнить меня</Checkbox>
                </Form.Item>
                <Button type="link" className="p-0 text-purple-600 hover:text-purple-700">
                  Забыли пароль?
                </Button>
              </div>
            </Form.Item>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  border: 'none',
                }}
              >
                Войти
              </Button>
            </Form.Item>

            <div className="text-center text-muted-foreground">
              Нет аккаунта?{' '}
              <Button type="link" className="p-0 text-purple-600 hover:text-purple-700">
                Зарегистрироваться
              </Button>
            </div>
          </Form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Для демо-доступа используйте любые данные
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
