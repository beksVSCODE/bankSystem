import { useState } from 'react';
import { Button, Card, Spin, Select, message } from 'antd';
import { FileTextOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { aiService } from '@/services/aiService';
import { useSupabaseFinancialStore as useFinancialStore } from '@/mock/supabaseFinancialStore';

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
      className="border-0 shadow-card hover:shadow-lg transition-shadow"
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-primary text-lg" />
          <span className="text-lg font-semibold">AI Финансовый отчет</span>
        </div>
      }
      extra={
        <div className="flex gap-2 flex-wrap">
          <Select
            value={period}
            onChange={setPeriod}
            disabled={loading}
            options={[
              { value: 'week', label: 'За неделю' },
              { value: 'month', label: 'За месяц' },
              { value: 'year', label: 'За год' },
            ]}
            className="w-40"
          />
          <Button
            type="primary"
            icon={loading ? <Spin size="small" /> : <ReloadOutlined />}
            onClick={generateReport}
            loading={loading}
            disabled={!hasApiKey}
            size="large"
          >
            {report ? 'Обновить' : 'Сгенерировать'}
          </Button>
          {report && (
            <Button
              icon={<DownloadOutlined />}
              onClick={downloadReport}
              size="large"
            >
              Скачать
            </Button>
          )}
        </div>
      }
    >
      {!hasApiKey && (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <FileTextOutlined className="text-5xl text-warning" />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI ассистент не настроен</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Для генерации подробных финансовых отчетов необходим Google Gemini API ключ
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => window.location.hash = '#/profile'}
          >
            Настроить в профиле
          </Button>
        </div>
      )}

      {hasApiKey && !report && !loading && (
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileTextOutlined className="text-5xl text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Готов к генерации отчета</h3>
          <p className="text-muted-foreground mb-6">
            AI создаст профессиональный анализ ваших финансов с детальными рекомендациями
          </p>
          <ul className="text-sm text-muted-foreground text-left max-w-lg mx-auto space-y-3 mb-8 bg-muted/30 p-6 rounded-lg">
            <li className="flex items-start gap-3">
              <span className="text-lg mt-0.5">📊</span>
              <span><strong>Анализ доходов и расходов</strong> с процентами и сравнениями</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg mt-0.5">💸</span>
              <span><strong>Детальный разбор расходов</strong> по категориям с таблицей</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg mt-0.5">💡</span>
              <span><strong>Персональные рекомендации</strong> на основе ваших данных</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg mt-0.5">📈</span>
              <span><strong>Финансовый прогноз</strong> на 3 месяца вперед</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg mt-0.5">⚠️</span>
              <span><strong>Выявление проблемных зон</strong> в расходах</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg mt-0.5">✅</span>
              <span><strong>Оценка финансового здоровья</strong> и стабильности</span>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground mb-4">
            Отчет генерируется за 15-30 секунд и содержит 1500-2500 слов анализа
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-24">
          <Spin size="large" />
          <p className="text-muted-foreground mt-6 text-lg">
            AI анализирует ваши финансы и готовит детальный отчет...
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            ⏳ Это может занять 15-30 секунд
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <div className="text-xs text-muted-foreground space-y-2 bg-muted/30 p-4 rounded-lg">
              <div>✓ Сбор данных о доходах и расходах</div>
              <div>✓ Анализ категорий расходов</div>
              <div>✓ Расчет финансовых коэффициентов</div>
              <div>✓ Генерация рекомендаций</div>
            </div>
          </div>
        </div>
      )}

      {report && !loading && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
            <p className="text-sm text-muted-foreground m-0">
              ℹ️ Отчет сгенерирован {new Date().toLocaleString('ru-RU')}
            </p>
          </div>
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 className="text-3xl font-bold mb-6 mt-0 text-foreground">{children}</h1>,
              h2: ({children}) => <h2 className="text-2xl font-bold mb-4 mt-6 text-foreground">{children}</h2>,
              h3: ({children}) => <h3 className="text-xl font-semibold mb-3 mt-5 text-foreground">{children}</h3>,
              h4: ({children}) => <h4 className="text-lg font-semibold mb-2 mt-4 text-foreground">{children}</h4>,
              p: ({children}) => <p className="mb-4 leading-relaxed text-base">{children}</p>,
              ul: ({children}) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>,
              li: ({children}) => <li className="leading-relaxed text-base">{children}</li>,
              strong: ({children}) => <strong className="font-bold text-foreground">{children}</strong>,
              em: ({children}) => <em className="italic text-muted-foreground">{children}</em>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 italic my-4 text-muted-foreground bg-muted/20 py-3 rounded">
                  {children}
                </blockquote>
              ),
              code: ({children}) => (
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">
                  {children}
                </code>
              ),
              table: ({children}) => (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border-collapse border border-border">
                    {children}
                  </table>
                </div>
              ),
              thead: ({children}) => (
                <thead className="bg-muted/50 border-b border-border">
                  {children}
                </thead>
              ),
              tbody: ({children}) => (
                <tbody>
                  {children}
                </tbody>
              ),
              tr: ({children}) => (
                <tr className="border-b border-border hover:bg-muted/20">
                  {children}
                </tr>
              ),
              td: ({children}) => (
                <td className="border border-border px-4 py-2 text-sm text-base">
                  {children}
                </td>
              ),
              th: ({children}) => (
                <th className="border border-border px-4 py-2 text-sm font-semibold text-left">
                  {children}
                </th>
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
