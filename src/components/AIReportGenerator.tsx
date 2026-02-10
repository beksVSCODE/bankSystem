import { useState } from 'react';
import { Button, Card, Spin, Select, message } from 'antd';
import { FileTextOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { aiService } from '@/services/aiService';
import { useFinancialStore } from '@/mock/financialStore';

export const AIReportGenerator = () => {
  const accounts = useFinancialStore(state => state.accounts);
  const transactions = useFinancialStore(state => state.transactions);
  
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string>('');
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [hasApiKey, setHasApiKey] = useState(aiService.hasApiKey());

  const generateReport = async () => {
    if (!hasApiKey) {
      message.warning('Настройте API ключ в профиле');
      return;
    }

    setLoading(true);
    const response = await aiService.generateReport(accounts, transactions, period);
    setLoading(false);

    if (response.error) {
      message.error(`Ошибка: ${response.error}`);
    } else {
      setReport(response.message);
      message.success('Отчет сгенерирован!');
    }
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${period}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('Отчет загружен!');
  };

  return (
    <Card 
      className="border-0 shadow-card"
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-primary" />
          <span>AI Финансовый отчет</span>
        </div>
      }
      extra={
        <div className="flex gap-2">
          <Select
            value={period}
            onChange={setPeriod}
            disabled={loading}
            options={[
              { value: 'week', label: 'За неделю' },
              { value: 'month', label: 'За месяц' },
              { value: 'year', label: 'За год' },
            ]}
            className="w-32"
          />
          <Button
            type="primary"
            icon={loading ? <Spin size="small" /> : <ReloadOutlined />}
            onClick={generateReport}
            loading={loading}
            disabled={!hasApiKey}
          >
            {report ? 'Обновить' : 'Сгенерировать'}
          </Button>
          {report && (
            <Button
              icon={<DownloadOutlined />}
              onClick={downloadReport}
            >
              Скачать
            </Button>
          )}
        </div>
      }
    >
      {!hasApiKey && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <FileTextOutlined className="text-3xl text-warning" />
          </div>
          <h3 className="text-lg font-semibold mb-2">AI ассистент не настроен</h3>
          <p className="text-muted-foreground mb-4">
            Для генерации отчетов необходим Google Gemini API ключ
          </p>
          <Button
            type="primary"
            onClick={() => window.location.hash = '#/profile'}
          >
            Настроить в профиле
          </Button>
        </div>
      )}

      {hasApiKey && !report && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileTextOutlined className="text-3xl text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Готов к генерации</h3>
          <p className="text-muted-foreground mb-4">
            AI создаст детальный анализ ваших финансов с рекомендациями
          </p>
          <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-2 mb-6">
            <li>📊 Анализ доходов и расходов</li>
            <li>📈 Топ категорий трат с процентами</li>
            <li>💡 Персональные рекомендации</li>
            <li>⚠️ Выявление необычных трат</li>
            <li>✅ Оценка финансового здоровья</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Выберите период и нажмите "Сгенерировать"
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <Spin size="large" />
          <p className="text-muted-foreground mt-4">
            AI анализирует ваши финансы и готовит отчет...
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Это может занять 10-20 секунд
          </p>
        </div>
      )}

      {report && !loading && (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>,
              h2: ({children}) => <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h2>,
              h3: ({children}) => <h3 className="text-lg font-semibold mb-2 mt-4">{children}</h3>,
              p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
              ul: ({children}) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>,
              li: ({children}) => <li className="leading-relaxed">{children}</li>,
              strong: ({children}) => <strong className="font-bold text-foreground">{children}</strong>,
              em: ({children}) => <em className="italic">{children}</em>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 text-muted-foreground">
                  {children}
                </blockquote>
              ),
              code: ({children}) => (
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ),
            }}
          >
            {report}
          </ReactMarkdown>
        </div>
      )}
    </Card>
  );
};
