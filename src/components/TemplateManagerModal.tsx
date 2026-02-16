import { useState } from 'react';
import { Modal, Form, Input, Select, Tag, Space, Button, List, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useTemplateStore, type AccountTemplate } from '@/mock/templateStore';
import { getSubActionsByParentId, accountActions } from '@/mock/accountActions';

interface TemplateManagerModalProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
}

export const TemplateManagerModal = ({ open, onClose, accountId }: TemplateManagerModalProps) => {
  const [form] = Form.useForm();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const templates = useTemplateStore((state) => state.getAllTemplates());
  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const updateTemplate = useTemplateStore((state) => state.updateTemplate);
  const deleteTemplate = useTemplateStore((state) => state.deleteTemplate);
  const getTemplate = useTemplateStore((state) => state.getTemplate);

  // Получить все доступные действия
  const allActions = accountActions.flatMap((cat) => [
    cat,
    ...getSubActionsByParentId(cat.id),
  ]);

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingId) {
        updateTemplate(editingId, values);
        message.success('Шаблон обновлен');
      } else {
        addTemplate(values);
        message.success('Шаблон создан');
      }
      form.resetFields();
      setIsCreating(false);
      setEditingId(null);
    } catch (error) {
      message.error('Ошибка при сохранении шаблона');
    }
  };

  const handleEdit = (template: AccountTemplate) => {
    setEditingId(template.id);
    setIsCreating(true);
    form.setFieldsValue(template);
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    message.success('Шаблон удален');
  };

  const handleCancel = () => {
    form.resetFields();
    setIsCreating(false);
    setEditingId(null);
  };

  return (
    <Modal
      title="Управление шаблонами счета"
      open={open}
      onCancel={onClose}
      width={900}
      footer={null}
      className="template-manager-modal"
    >
      <div className="space-y-6">
        {/* Форма создания/редактирования */}
        {isCreating && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-4 text-purple-900">
              {editingId ? 'Редактировать шаблон' : 'Создать новый шаблон'}
            </h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleCreateOrUpdate}
            >
              <Form.Item
                label="Название"
                name="name"
                rules={[{ required: true, message: 'Введите название' }]}
              >
                <Input placeholder="Например: Мои быстрые операции" />
              </Form.Item>

              <Form.Item
                label="Описание"
                name="description"
                rules={[{ required: true, message: 'Введите описание' }]}
              >
                <Input.TextArea placeholder="Описание шаблона" rows={3} />
              </Form.Item>

              <Form.Item
                label="Категория"
                name="category"
                rules={[{ required: true, message: 'Выберите категорию' }]}
              >
                <Select placeholder="Выберите категорию">
                  <Select.Option value="payments">Платежи</Select.Option>
                  <Select.Option value="reports">Выписки</Select.Option>
                  <Select.Option value="analytics">Аналитика</Select.Option>
                  <Select.Option value="cards">Карты</Select.Option>
                  <Select.Option value="settings">Настройки</Select.Option>
                  <Select.Option value="custom">Пользовательская</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Действия в шаблоне"
                name="actions"
                rules={[{ required: true, message: 'Выберите хотя бы одно действие' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Выберите действия"
                  optionLabelProp="label"
                >
                  {allActions.map((action) => (
                    <Select.Option key={action.id} value={action.id}>
                      {action.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Цвет (опционально)" name="color">
                <Input type="color" />
              </Form.Item>

              <Space>
                <Button type="primary" htmlType="submit">
                  {editingId ? 'Обновить' : 'Создать'}
                </Button>
                <Button onClick={handleCancel}>Отмена</Button>
              </Space>
            </Form>
          </div>
        )}

        {/* Кнопка создания */}
        {!isCreating && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreating(true)}
            className="w-full"
            size="large"
          >
            Создать новый шаблон
          </Button>
        )}

        {/* Список шаблонов */}
        <div>
          <h3 className="font-semibold mb-3">Все шаблоны ({templates.length})</h3>
          <List
            dataSource={templates}
            renderItem={(template) => (
              <List.Item
                key={template.id}
                className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{template.name}</h4>
                    {template.isDefault && (
                      <Tag color="blue">По умолчанию</Tag>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Действия:</span>
                    {template.actions.slice(0, 3).map((actionId) => {
                      const action = allActions.find((a) => a.id === actionId);
                      return (
                        <Tag key={actionId} color="purple">
                          {action?.title || actionId}
                        </Tag>
                      );
                    })}
                    {template.actions.length > 3 && (
                      <Tag>+{template.actions.length - 3}</Tag>
                    )}
                  </div>
                </div>
                <Space>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(template)}
                    disabled={template.isDefault}
                  />
                  <Popconfirm
                    title="Удалить шаблон?"
                    description="Это действие нельзя отменить"
                    onConfirm={() => handleDelete(template.id)}
                    disabled={template.isDefault}
                  >
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={template.isDefault}
                    />
                  </Popconfirm>
                </Space>
              </List.Item>
            )}
            locale={{
              emptyText: 'Нет шаблонов',
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
