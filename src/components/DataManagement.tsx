import { Card, Button, message, Statistic, Row, Col } from 'antd';
import { Modal } from '@/components/ui/modal';
import { DeleteOutlined, ReloadOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';
import { formatCurrency } from '@/mock/data';

export const DataManagement = () => {
  const { accounts, transactions, resetData } = useFinancialStore();

  const handleReset = () => {
    Modal.confirm({
      title: 'Сбросить все данные?',
      content: 'Все изменения будут удалены и данные вернутся к начальному состоянию.',
      okText: 'Сбросить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => {
        resetData();
        message.success('Данные успешно сброшены!');
      },
    });
  };

  const totalBalance = accounts
    .filter(acc => acc.currency === 'RUB')
    .reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <Card
    title={
        <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mt-[20px]">
            <DatabaseOutlined />
            <span >Управление данными</span>
        </div>

        <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleReset}
            className="w-fit"
        >
            Сбросить данные
        </Button>
        </div>
    }
    >

      <Row gutter={[12, 16]} className="mb-4">
        <Col xs={24} sm={12} lg={8}>
          <Statistic
            title="Всего счетов"
            value={accounts.length}
            prefix={<DatabaseOutlined />}
            valueStyle={{ fontSize: 'clamp(20px, 5vw, 32px)' }}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Statistic
            title="Всего транзакций"
            value={transactions.length}
            valueStyle={{ fontSize: 'clamp(20px, 5vw, 32px)' }}
          />
        </Col>
        <Col xs={24} sm={24} lg={8}>
          <Statistic
            title="Общий баланс"
            value={totalBalance}
            formatter={(value) => formatCurrency(Number(value))}
            valueStyle={{ fontSize: 'clamp(16px, 4vw, 28px)' }}
          />
        </Col>
      </Row>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <h4 className="font-semibold mb-2">ℹ️ Информация</h4>
        <p className="text-sm text-muted-foreground">
          Все операции (переводы, платежи, обмен валюты, открытие вкладов) теперь реально изменяют балансы счетов 
          и сохраняют транзакции. Данные хранятся в localStorage и сохраняются между сеансами.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Используйте кнопку "Сбросить данные" чтобы вернуть всё к начальному состоянию.
        </p>
      </div>
    </Card>
  );
};
