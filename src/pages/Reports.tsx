import { useState, useMemo, useEffect } from 'react';
import { Button, Input, Drawer, Badge, Empty, Tooltip } from 'antd';
import { FileTextOutlined, SearchOutlined, PlusOutlined, MenuOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { MainLayout } from '@/components/MainLayout';
import { reportsMenuStructure, findMenuItemById } from '@/mock/menuStructure';

// Компоненты отчетов
import AccountStatement from './reports/AccountStatement';
import AllReports from './reports/AllReports';
import BalanceMovement from './reports/BalanceMovement';
import Counterparties from './reports/Counterparties';
import TransactionCalendar from './reports/TransactionCalendar';
import SpendingAnalysis from './reports/SpendingAnalysis';
import TagReport from './reports/TagReport';
import BalanceStructure from './reports/BalanceStructure';
import CounterpartyCheck from './reports/CounterpartyCheck';
import Tariffs from './reports/Tariffs';
import AccountDetails from './reports/AccountDetails';
import DepositTerms from './reports/DepositTerms';
import AgreementTerms from './reports/AgreementTerms';
import ConsultantRequests from './reports/ConsultantRequests';
import GeneratedReports from './reports/GeneratedReports';
import type { FC } from 'react';

const componentMap: Record<string, FC> = {
  account_statement: AccountStatement,
  balance_movement: BalanceMovement,
  counterparties: Counterparties,
  transaction_calendar: TransactionCalendar,
  spending_analysis: SpendingAnalysis,
  tag_report: TagReport,
  balance_structure: BalanceStructure,
  counterparty_check_history: CounterpartyCheck,
  tariffs: Tariffs,
  counterparty_check: CounterpartyCheck,
  account_details: AccountDetails,
  deposit_terms: DepositTerms,
  agreement_terms: AgreementTerms,
  consultant_requests: ConsultantRequests,
  generated_reports: GeneratedReports,
};

export default function Reports() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    reportsMenuStructure.length > 0 ? reportsMenuStructure[0].id : ''
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const selectedCategory = reportsMenuStructure.find(cat => cat.id === selectedCategoryId);

  // Фильтрация элементов по поиску
  const filteredItems = useMemo(() => {
    const categoryItems = selectedCategory?.items || [];
    if (!searchValue.trim()) return categoryItems;
    const query = searchValue.toLowerCase();
    return categoryItems.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }, [searchValue, selectedCategory]);

  // Автоматически выбираем первый элемент при изменении категории
  useEffect(() => {
    if (filteredItems.length > 0 && !filteredItems.find(item => item.id === selectedItemId)) {
      setSelectedItemId(filteredItems[0]?.id || null);
    }
  }, [selectedCategoryId, filteredItems, selectedItemId]);

  const selectedItem = selectedItemId ? findMenuItemById(reportsMenuStructure, selectedItemId) : null;
  const ComponentToRender = selectedItem?.componentId ? componentMap[selectedItem.componentId] : null;

  // Левая панель - меню
  const renderSidebar = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white border-r border-gray-200">
      {/* Заголовок */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-bold text-gray-900">Отчеты и аналитика</h2>
        <p className="text-xs text-gray-500 mt-1">Выберите тип отчета</p>
      </div>

      {/* Поиск */}
      <div className="p-4 border-b border-gray-100">
        <Input
          placeholder="Поиск отчета..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
          size="large"
          className="rounded-lg font-medium"
          style={{ borderColor: '#e5e7eb' }}
        />
      </div>

      {/* Список категорий */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {reportsMenuStructure.map(category => {
          const Icon = category.icon;
          const isActive = selectedCategoryId === category.id;
          const itemCount = category.items?.length || 0;
          return (
            <Tooltip key={category.id} title={category.label} placement="right">
              <button
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setSelectedItemId(null);
                  setMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105 font-semibold'
                    : 'text-gray-700 hover:bg-white hover:shadow-md border border-transparent'
                }`}
              >
                {Icon && <Icon className={`text-xl flex-shrink-0 ${isActive ? 'text-white' : 'text-emerald-600'}`} />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{category.label}</div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {itemCount} отчетов
                  </div>
                </div>
                {isActive && (
                  <div className="flex-shrink-0">
                    <div className="bg-white bg-opacity-20 rounded-full p-1">
                      <ArrowRightOutlined className="text-white text-xs" />
                    </div>
                  </div>
                )}
                {!isActive && itemCount > 0 && (
                  <Badge count={itemCount} className="flex-shrink-0" style={{ backgroundColor: '#059669' }} />
                )}
              </button>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Верхняя панель */}
        <div className="bg-gradient-to-r from-white to-emerald-50 border-b border-gray-200 px-4 sm:px-6 py-5 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                  <FileTextOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Отчеты и аналитика</h1>
                  <p className="text-xs text-gray-500">
                    {selectedCategory ? selectedCategory.label : 'Просмотр отчетов и статистики'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                className="hidden sm:flex font-semibold"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
              >
                Новый отчет
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                className="sm:hidden"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
              />
              <Button
                type="text"
                icon={<MenuOutlined />}
                size="large"
                className="lg:hidden text-gray-600"
                onClick={() => setMobileDrawerOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          {/* Боковое меню (скрыто на мобильных) */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            {renderSidebar()}
          </div>

          {/* Drawer для мобильных */}
          <Drawer
            title="Отчеты и аналитика"
            placement="left"
            onClose={() => setMobileDrawerOpen(false)}
            open={mobileDrawerOpen}
            width={320}
            bodyStyle={{ padding: 0 }}
            headerStyle={{ borderBottom: '1px solid #e5e7eb' }}
          >
            {renderSidebar()}
          </Drawer>

          {/* Основная панель с подменю и контентом */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Подменю - элементы выбранной категории */}
            {selectedCategory && (
              <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0 shadow-sm">
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{selectedCategory.label}</p>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <div className="flex gap-2">
                    {filteredItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                          selectedItemId === item.id
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Основной контент */}
            <div className="flex-1 overflow-y-auto">
              {ComponentToRender ? (
                <div className="p-4 sm:p-6">
                  <ComponentToRender />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Empty
                    description="Выберите отчет"
                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
