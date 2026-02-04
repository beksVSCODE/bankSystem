import { Card, Button, Modal, message, Statistic, Row, Col } from 'antd';
import { DeleteOutlined, ReloadOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useFinancialStore } from '@/mock/financialStore';
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
        <span className="flex items-center gap-2">
          <DatabaseOutlined /> Управление данными
        </span>
      }
      extra={
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleReset}
        >
          Сбросить данные
        </Button>
      }
    >
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Всего счетов"
            value={accounts.length}
            prefix={<DatabaseOutlined />}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Всего транзакций"
            value={transactions.length}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Общий баланс"
            value={totalBalance}
            formatter={(value) => formatCurrency(Number(value))}
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
