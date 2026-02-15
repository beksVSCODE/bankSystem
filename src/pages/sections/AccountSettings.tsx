import { Card, Switch, Alert, Divider, Row, Col, Statistic } from 'antd';
import { BellOutlined, SafeOutlined } from '@ant-design/icons';

const AccountSettings = () => {
  return (
    <div className="space-y-4">
      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Настройка счета</h3>
        
        <Alert
          message="Параметры договора"
          type="info"
          className="mb-4"
          showIcon
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Уведомления о движениях средств</p>
              <p className="text-sm text-muted-foreground">Получать SMS об операциях по счету</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Лимит овердрафта</p>
              <p className="text-sm text-muted-foreground">Включить возможность овердрафта</p>
            </div>
            <Switch />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Защита по SMS</p>
              <p className="text-sm text-muted-foreground">Подтверждение операций кодом</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="border border-border shadow-sm rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Параметры договора</h3>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Statistic title="Номер договора" value="ДП-12345-2025" />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic title="Дата начала" value="15.01.2025" />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic title="Процентная ставка" value="0%" suffix="годовых" />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic title="Комиссия" value="0" suffix="₽" />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AccountSettings;
