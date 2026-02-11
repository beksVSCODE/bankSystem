import { useState, useRef, useEffect } from 'react';
import { Button, Input, Spin, Tag, Empty } from 'antd';
import ReactMarkdown from 'react-markdown';
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined, 
  CloseOutlined,
  SettingOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { aiService } from '@/services/aiService';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatBotProps {
  open: boolean;
  onClose: () => void;
}

export const AIChatBot = ({ open, onClose }: AIChatBotProps) => {
  const accounts = useFinancialStore(state => state.accounts);
  const transactions = useFinancialStore(state => state.transactions);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasApiKey(aiService.hasApiKey());
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (message?: string) => {
    const textToSend = message || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Преобразуем историю для API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await aiService.sendMessage(
        textToSend,
        accounts,
        transactions,
        conversationHistory
      );

      setLoading(false);

      if (response.error) {
        let errorContent = `❌ Ошибка: ${response.error}`;
        
        // Специальная обработка ошибки квоты
        if (response.error.includes('quota') || response.error.includes('billing') || response.error.includes('RESOURCE_EXHAUSTED')) {
          errorContent = `❌ Превышена квота Google Gemini API

📊 Что случилось:
Превышен лимит запросов (60/мин или 1500/день).

🔧 Как исправить:
1. Подождите 1 минуту и попробуйте снова
2. Проверьте лимиты на makersuite.google.com
3. Gemini API бесплатный - ничего платить не нужно!

💡 Лимиты обновляются автоматически.`;
        }
        
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          role: 'assistant',
          content: errorContent,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `❌ Произошла ошибка при отправке сообщения. Попробуйте еще раз.\n\nЕсли проблема повторяется, проверьте:\n- Интернет соединение\n- API ключ в настройках профиля`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const suggestedQuestions = aiService.getSuggestedQuestions(accounts, transactions);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <RobotOutlined className="text-white text-xl" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Ассистент</h3>
            <p className="text-xs text-muted-foreground">
              {hasApiKey ? '🟢 Подключен' : '🔴 Не настроен'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="text"
            size="small"
            icon={<ClearOutlined />}
            onClick={handleClearChat}
            disabled={messages.length === 0}
            title="Очистить чат"
          />
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onClose}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!hasApiKey && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-sm">
            <p className="font-semibold mb-2 text-warning">⚠️ API ключ не настроен</p>
            <p className="text-muted-foreground mb-3">
              Для работы AI ассистента необходим Google Gemini API ключ.
            </p>
            <Button
              type="primary"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => {
                onClose();
                window.location.hash = '#/profile';
              }}
            >
              Перейти в настройки
            </Button>
          </div>
        )}

        {messages.length === 0 && hasApiKey && (
          <div className="text-center py-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <p className="text-muted-foreground mb-4">
                    Привет! Я ваш финансовый ассистент 👋
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Задайте вопрос о ваших финансах:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((q, idx) => (
                      <Tag
                        key={idx}
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleSend(q)}
                      >
                        {q}
                      </Tag>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {msg.role === 'user' ? (
                <UserOutlined className="text-sm" />
              ) : (
                <RobotOutlined className="text-sm" />
              )}
            </div>
            <div
              className={`flex-1 rounded-2xl p-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className={`text-sm prose prose-sm max-w-none ${
                  msg.role === 'assistant' ? 'prose-invert' : ''
                }`}>
                  <ReactMarkdown
                    components={{
                      p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({children}) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="text-sm">{children}</li>,
                      strong: ({children}) => <strong className="font-bold">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                      code: ({children}) => <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                      h1: ({children}) => <h1 className="text-base font-bold mb-2">{children}</h1>,
                      h2: ({children}) => <h2 className="text-sm font-bold mb-2">{children}</h2>,
                      h3: ({children}) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                      blockquote: ({children}) => <blockquote className="border-l-2 border-primary/30 pl-3 italic my-2">{children}</blockquote>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
              <p
                className={`text-xs mt-1 ${
                  msg.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                }`}
              >
                {msg.timestamp.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <RobotOutlined className="text-sm text-muted-foreground" />
            </div>
            <div className="flex-1 rounded-2xl p-3 bg-muted">
              <Spin size="small" />
              <span className="ml-2 text-sm text-muted-foreground">Думаю...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        {messages.length === 0 && hasApiKey && (
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 2).map((q, idx) => (
              <Tag
                key={idx}
                className="cursor-pointer hover:bg-primary/10 text-xs"
                onClick={() => handleSend(q)}
              >
                {q}
              </Tag>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder={hasApiKey ? "Задайте вопрос..." : "Настройте API ключ"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={() => handleSend()}
            disabled={loading || !hasApiKey}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            loading={loading}
            disabled={!input.trim() || !hasApiKey}
          />
        </div>
      </div>
    </div>
  );
};
