import { Card } from 'antd';

const OtherOperations = ({ selectedId }: { selectedId: string }) => {
  const getTitleAndDescription = () => {
    const mapping: Record<string, { title: string; description: string }> = {
      arbitration_office: {
        title: 'Кабинет арбитражного управления',
        description: 'Управление обращениями в арбитражное управление',
      },
      gov_services: {
        title: 'Государственные услуги',
        description: 'Доступ к электронным государственным услугам',
      },
      salary_project: {
        title: 'Зарплатный проект',
        description: 'Управление зарплатными проектами и начислениями',
      },
      mobile_notify: {
        title: 'Мобильное информирование',
        description: 'Настройка SMS уведомлений об операциях',
      },
      update_balances: {
        title: 'Обновить остатки',
        description: 'Синхронизация актуальных остатков по всем счетам',
      },
      insurance: {
        title: 'Страхование',
        description: 'Услуги страхования и управление полисами',
      },
    };
    return mapping[selectedId] || { title: 'Операция', description: 'Описание' };
  };

  const info = getTitleAndDescription();

  return (
    <Card className="border border-border shadow-sm rounded-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">{info.title}</h3>
      <div className="bg-muted p-6 rounded-lg text-center">
        <p className="text-muted-foreground">{info.description}</p>
        <p className="text-sm text-muted-foreground mt-4">
          Эта функция находится в разработке. Скоро будет доступна полная функциональность.
        </p>
      </div>
    </Card>
  );
};

export default OtherOperations;
