import { useState, useMemo, useEffect } from 'react';
import { Button, Input, Drawer, Badge, Empty, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined, MenuOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { MainLayout } from '@/components/MainLayout';
import { paymentsMenuStructure, findMenuItemById } from '@/mock/menuStructure';
import type { FC } from 'react';

// Компоненты платежей
import PaymentOrders from './sections/PaymentOrders';
import Transfers from './sections/Transfers';
import CurrencyExchange from './sections/CurrencyExchange';
import PaymentsByCalendar from './sections/PaymentsByCalendar';
import CardReplenishment from './sections/CardReplenishment';
import MassPayments from './sections/MassPayments';
import BankMessages from './sections/BankMessages';
import QRCodePayment from './sections/QRCodePayment';
import RegistryPayments from './sections/RegistryPayments';
import InvoiceService from './sections/InvoiceService';
import CardManagement from './sections/CardManagement';
import AccountSettings from './sections/AccountSettings';
import Deposits from './sections/Deposits';
import Credits from './sections/Credits';
import CurrencyOperations from './sections/CurrencyOperations';
import Uploads from './sections/Uploads';
import OtherOperations from './sections/OtherOperations';

// Заглушки для остальных компонентов
const TransferToPersonal = () => <div className="p-6">Перевод на счет физ лица (в разработке)</div>;
const CardToCard = () => <div className="p-6">Перевод с карты на карту (в разработке)</div>;
const SberbankTransfer = () => <div className="p-6">Перевод клиенту СберБанка (в разработке)</div>;
const ContractParameters = () => <div className="p-6">Параметры договора (в разработке)</div>;

const componentMap: Record<string, FC<any>> = {
  payment_orders: PaymentOrders,
  transfer_to_personal: TransferToPersonal,
  currency_exchange: CurrencyExchange,
  card_to_card: CardToCard,
  sberbank_transfer: SberbankTransfer,
  scheduled_payments: PaymentsByCalendar,
  card_replenishment: CardReplenishment,
  arbitration_office: () => <OtherOperations selectedId="arbitration_office" />,
  mass_payments: MassPayments,
  bank_messages: BankMessages,
  qr_payment: QRCodePayment,
  registry_payments: RegistryPayments,
  invoice_service: InvoiceService,
  cards: CardManagement,
  account_settings: AccountSettings,
  contract_parameters: ContractParameters,
  business_deposits: Deposits,
  placements: Deposits,
  guarantees: Credits,
  credit_application: Credits,
  credits: Credits,
  currency_ops: CurrencyOperations,
  currency_control_docs: CurrencyOperations,
  conversion_ops: CurrencyOperations,
  currency_exchange_spec: CurrencyOperations,
  '1c_upload': Uploads,
  counterparties_upload: Uploads,
  upload_history: Uploads,
  gov_services: () => <OtherOperations selectedId="gov_services" />,
  salary_project: () => <OtherOperations selectedId="salary_project" />,
  mobile_notify: () => <OtherOperations selectedId="mobile_notify" />,
  update_balances: () => <OtherOperations selectedId="update_balances" />,
  insurance: () => <OtherOperations selectedId="insurance" />,
};

export default function Payments() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    paymentsMenuStructure.length > 0 ? paymentsMenuStructure[0].id : ''
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const selectedCategory = paymentsMenuStructure.find(cat => cat.id === selectedCategoryId);
  const categoryItems = selectedCategory?.items || [];

  // Фильтрация элементов по поиску
  const filteredItems = useMemo(() => {
    if (!searchValue.trim()) return categoryItems;
    const query = searchValue.toLowerCase();
    return categoryItems.filter(item =>
      item.label.toLowerCase().includes(query)
    );
  }, [searchValue, categoryItems]);

  // Автоматически выбираем первый элемент при изменении категории
  useEffect(() => {
    if (categoryItems.length > 0 && !filteredItems.find(item => item.id === selectedItemId)) {
      setSelectedItemId(filteredItems[0]?.id || null);
    }
  }, [selectedCategoryId, filteredItems, selectedItemId]);

  const selectedItem = selectedItemId ? findMenuItemById(paymentsMenuStructure, selectedItemId) : null;
  const ComponentToRender = selectedItem?.componentId ? componentMap[selectedItem.componentId] : null;

  // Левая панель - меню
  const renderSidebar = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white border-r border-gray-200">
      {/* Заголовок */}
      <div className="p-4 sm:p-6 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-bold text-gray-900">Платежи и переводы</h2>
        <p className="text-xs text-gray-500 mt-1">Выберите категорию операции</p>
      </div>

      {/* Поиск */}
      <div className="p-4 border-b border-gray-100">
        <Input
          placeholder="Поиск операции..."
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
        {paymentsMenuStructure.map(category => {
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
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105 font-semibold'
                    : 'text-gray-700 hover:bg-white hover:shadow-md border border-transparent'
                }`}
              >
                {Icon && <Icon className={`text-xl flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-600'}`} />}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{category.label}</div>
                  <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                    {itemCount} операций
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
                  <Badge count={itemCount} className="flex-shrink-0" style={{ backgroundColor: '#2563eb' }} />
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
        <div className="bg-gradient-to-r from-white to-blue-50 border-b border-gray-200 px-4 sm:px-6 py-5 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <PlusOutlined className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Платежи и переводы</h1>
                  <p className="text-xs text-gray-500">
                    {selectedCategory ? selectedCategory.label : 'Управление платежами и переводами'}
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
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
              >
                Новая операция
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                className="sm:hidden"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
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
            title="Платежи и переводы"
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
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
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
                    description="Выберите операцию"
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
