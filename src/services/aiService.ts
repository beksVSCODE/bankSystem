import type { Account, Transaction } from '@/mock/types';
import { formatCurrency } from '@/mock/data';

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ChatResponse {
    message: string;
    error?: string;
}

class AIService {
    private apiKey: string;
    private model = 'gemini-2.5-flash';

    constructor() {
        // API ключ должен быть в переменных окружения или настройках
        this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    }

    // Установить API ключ программно (если пользователь вводит его в настройках)
    setApiKey(key: string) {
        this.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
    }

    // Получить API ключ из localStorage
    getApiKey(): string {
        if (!this.apiKey) {
            this.apiKey = localStorage.getItem('gemini_api_key') || '';
        }
        return this.apiKey;
    }

    // Проверить наличие API ключа
    hasApiKey(): boolean {
        return this.getApiKey().length > 0;
    }

    // Создать системный промпт с контекстом пользователя
    private createSystemPrompt(accounts: Account[], transactions: Transaction[]): string {
        const totalBalance = accounts
            .filter(acc => acc.currency === 'RUB')
            .reduce((sum, acc) => sum + acc.balance, 0);

        const accountsList = accounts
            .map(acc => `- ${acc.name} (${acc.currency}): ${formatCurrency(acc.balance, acc.currency)}`)
            .join('\n');

        const recentTransactions = transactions
            .slice(0, 10)
            .map(tx => `${tx.date}: ${tx.description} - ${formatCurrency(Math.abs(tx.amount), 'RUB')} (${tx.category})`)
            .join('\n');

        const currentMonth = new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

        const monthlyIncome = transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return tx.type === 'income' &&
                    tx.status === 'completed' &&
                    txDate.getMonth() === new Date().getMonth();
            })
            .reduce((sum, tx) => sum + tx.amount, 0);

        const monthlyExpense = transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return tx.type === 'expense' &&
                    tx.status === 'completed' &&
                    txDate.getMonth() === new Date().getMonth();
            })
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

        return `Ты - финансовый ассистент для личного финансового дашборда.

КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
Текущая дата: ${new Date().toLocaleDateString('ru-RU')}

СЧЕТА ПОЛЬЗОВАТЕЛЯ:
${accountsList}

Общий баланс в рублях: ${formatCurrency(totalBalance, 'RUB')}

СТАТИСТИКА ЗА ${currentMonth.toUpperCase()}:
- Доходы: ${formatCurrency(monthlyIncome, 'RUB')}
- Расходы: ${formatCurrency(monthlyExpense, 'RUB')}
- Баланс: ${formatCurrency(monthlyIncome - monthlyExpense, 'RUB')}

ПОСЛЕДНИЕ ТРАНЗАКЦИИ:
${recentTransactions}

ТВОИ ВОЗМОЖНОСТИ:
1. Отвечать на вопросы о балансах, счетах и транзакциях
2. Давать финансовые советы на основе данных пользователя
3. Анализировать паттерны расходов
4. Помогать с планированием бюджета
5. Объяснять функции приложения (переводы, обмен валют, депозиты)

ПРАВИЛА:
- Отвечай на русском языке
- Будь кратким и конкретным
- Используй эмодзи для улучшения восприятия
- Форматируй суммы правильно (с пробелами и символом валюты)
- Если данных недостаточно для ответа, честно скажи об этом
- Не придумывай информацию, используй только предоставленный контекст
- Если вопрос не связан с финансами, вежливо направь разговор в нужное русло

ФОРМАТИРОВАНИЕ ОТВЕТОВ:
- Используй **жирный текст** для важных цифр и сумм
- Используй списки для перечислений (- пункт 1, - пункт 2)
- Используй нумерованные списки для шагов (1. первый шаг, 2. второй шаг)
- Добавляй эмодзи в начале категорий (💰 Расходы, 📊 Статистика, 💡 Совет)
- Разделяй ответ на абзацы для читаемости
- Для больших сумм используй форматирование: **150 000 ₽**`;
    }

    // Отправить сообщение в Gemini API
    async sendMessage(
        userMessage: string,
        accounts: Account[],
        transactions: Transaction[],
        conversationHistory: ChatMessage[] = []
    ): Promise<ChatResponse> {
        if (!this.hasApiKey()) {
            return {
                message: '',
                error: 'API ключ Gemini не настроен. Перейдите в настройки профиля для добавления ключа.'
            };
        }

        try {
            const systemPrompt = this.createSystemPrompt(accounts, transactions);

            // Формируем полный промпт для Gemini (объединяем системный промпт, историю и новое сообщение)
            let fullPrompt = systemPrompt + '\n\n';

            // Добавляем историю разговора
            conversationHistory.forEach(msg => {
                if (msg.role === 'user') {
                    fullPrompt += `Пользователь: ${msg.content}\n\n`;
                } else if (msg.role === 'assistant') {
                    fullPrompt += `Ассистент: ${msg.content}\n\n`;
                }
            });

            // Добавляем новое сообщение пользователя
            fullPrompt += `Пользователь: ${userMessage}\n\nАссистент:`;

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.getApiKey()}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                        topP: 0.95,
                        topK: 40,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_NONE'
                        },
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_NONE'
                        },
                        {
                            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            threshold: 'BLOCK_NONE'
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_NONE'
                        }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Gemini API Error:', errorData);
                throw new Error(errorData.error?.message || 'Ошибка Gemini API');
            }

            const data = await response.json();

            // Проверяем наличие ответа
            if (!data.candidates || data.candidates.length === 0) {
                console.error('No candidates in response:', data);
                throw new Error('AI не смог сгенерировать ответ. Попробуйте переформулировать вопрос.');
            }

            const candidate = data.candidates[0];

            // Проверяем блокировку контента
            if (candidate.finishReason === 'SAFETY') {
                throw new Error('Ответ заблокирован фильтрами безопасности. Попробуйте другой вопрос.');
            }

            if (candidate.finishReason === 'RECITATION') {
                throw new Error('Ответ заблокирован из-за повторения. Попробуйте переформулировать.');
            }

            const assistantMessage = candidate?.content?.parts?.[0]?.text;

            if (!assistantMessage || assistantMessage.trim().length === 0) {
                throw new Error('Получен пустой ответ от AI. Попробуйте еще раз.');
            }

            return {
                message: assistantMessage.trim()
            };

        } catch (error) {
            console.error('AI Service Error:', error);
            return {
                message: '',
                error: error instanceof Error ? error.message : 'Неизвестная ошибка при обращении к AI'
            };
        }
    }

    // Получить быстрые предложения вопросов
    getSuggestedQuestions(accounts: Account[], transactions: Transaction[]): string[] {
        const hasMultipleCurrencies = new Set(accounts.map(a => a.currency)).size > 1;
        const hasDeposit = accounts.some(a => a.type === 'deposit');

        const suggestions = [
            'Сколько я потратил в этом месяце?',
            'Покажи мои доходы за текущий месяц',
            'На что я больше всего трачу?',
        ];

        if (hasMultipleCurrencies) {
            suggestions.push('Какой у меня общий баланс во всех валютах?');
        }

        if (hasDeposit) {
            suggestions.push('Расскажи о моих депозитах');
        }

        if (transactions.filter(tx => tx.category === 'restaurants').length > 3) {
            suggestions.push('Много ли я трачу на рестораны?');
        }

        return suggestions.slice(0, 4);
    }

    // Генерация финансового отчета на естественном языке
    async generateReport(
        accounts: Account[],
        transactions: Transaction[],
        period: 'week' | 'month' | 'year' = 'month'
    ): Promise<ChatResponse> {
        if (!this.hasApiKey()) {
            return {
                message: '',
                error: 'API ключ Gemini не настроен.'
            };
        }

        try {
            const now = new Date();
            const startDate = new Date();
            let periodName = '';

            switch (period) {
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    periodName = 'неделю';
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    periodName = 'месяц';
                    break;
                case 'year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    periodName = 'год';
                    break;
            }

            // Фильтруем транзакции за период
            const periodTransactions = transactions.filter(tx => {
                const txDate = new Date(tx.date);
                return txDate >= startDate && txDate <= now && tx.status === 'completed';
            });

            const income = periodTransactions
                .filter(tx => tx.type === 'income')
                .reduce((sum, tx) => sum + tx.amount, 0);

            const expense = periodTransactions
                .filter(tx => tx.type === 'expense')
                .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

            // Группировка по категориям
            const expensesByCategory = periodTransactions
                .filter(tx => tx.type === 'expense')
                .reduce((acc, tx) => {
                    const category = tx.category;
                    acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
                    return acc;
                }, {} as Record<string, number>);

            const topCategories = Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5);

            const totalBalance = accounts.reduce((sum, acc) => {
                if (acc.currency === 'RUB') return sum + acc.balance;
                return sum;
            }, 0);

            const prompt = `Ты - профессиональный финансовый аналитик. Создай ПОДРОБНЫЙ и СТРУКТУРИРОВАННЫЙ финансовый отчет.

═══════════════════════════════════════════════════════════
ИСХОДНЫЕ ДАННЫЕ за последний ${periodName.toUpperCase()}
═══════════════════════════════════════════════════════════

📊 ФИНАНСОВЫЕ ПОКАЗАТЕЛИ:
• Общие доходы: ${formatCurrency(income, 'RUB')}
• Общие расходы: ${formatCurrency(expense, 'RUB')}
• Чистый баланс за период: ${formatCurrency(income - expense, 'RUB')}
• Коэффициент сбережений: ${income > 0 ? Math.round(((income - expense) / income) * 100) : 0}%
• Текущий итоговый баланс: ${formatCurrency(totalBalance, 'RUB')}
• Всего транзакций проанализировано: ${periodTransactions.length}

💳 РАСПРЕДЕЛЕНИЕ ПО СЧЕТАМ:
${accounts.map(acc => `• ${acc.name} (${acc.currency}): ${formatCurrency(acc.balance, acc.currency)}`).join('\n')}

💸 ТОП-5 КАТЕГОРИЙ РАСХОДОВ:
${topCategories.map(([cat, amount], idx) => {
                const pct = income > 0 ? Math.round((amount / expense) * 100) : 0;
                return `${idx + 1}. ${cat}: ${formatCurrency(amount, 'RUB')} (${pct}% от всех расходов)`;
            }).join('\n')}

═══════════════════════════════════════════════════════════
ТРЕБУЕМАЯ СТРУКТУРА ОТЧЕТА (используй именно эту структуру)
═══════════════════════════════════════════════════════════

## 📋 Финансовый отчет за ${periodName}

### 1️⃣ Резюме финансового состояния
- Напиши 2-3 предложения общей оценки финансового здоровья
- Используй критерии: баланс доходов/расходов, коэффициент сбережений, тренды
- Определи, насколько пользователь дисциплинирован в расходах

### 2️⃣ Анализ доходов и расходов
- Сравни доходы и расходы в абсолютных числах и процентах
- Рассчитай норму сбережений (процент сбереженных денег)
- Дай оценку: "Сбережения выше нормы / соответствуют норме / ниже нормы"
- Укажи, увеличиваются или снижаются расходы по сравнению с предыдущим периодом (если данные доступны)

### 3️⃣ Детальный анализ расходов
**Таблица расходов:**
| Категория | Сумма | % от расходов | Оценка |
|-----------|--------|-----------|---------|
${topCategories.map(([cat, amount]) => {
                const pct = expense > 0 ? Math.round((amount / expense) * 100) : 0;
                let assessment = 'Нормально';
                if (pct > 40) assessment = '⚠️ Очень много';
                else if (pct > 25) assessment = '⚡ Заметно';
                else if (pct > 10) assessment = '✅ Разумно';
                return `| ${cat} | ${formatCurrency(amount, 'RUB')} | ${pct}% | ${assessment} |`;
            }).join('\n')}

- Определи лидирующие категории расходов
- Дай оценку каждой: слишком много / нормально / мало
- Укажи на необычные траты или аномалии

### 4️⃣ Ключевые выводы и тренды
- ✓ Что идет хорошо (низкие расходы в какой-то категории, хорошие сбережения)
- ⚠️ На что следует обратить внимание (высокие расходы, снижение баланса)
- 📈 Общие тренды (увеличение/снижение расходов, стабильность)

### 5️⃣ Рекомендации по улучшению финансов
Дай 5-7 КОНКРЕТНЫХ и ПРАКТИЧЕСКИХ рекомендаций:
1. Основанных на его реальных данных (его траты, баланс, категории)
2. С примерами ("если сократить траты на кафе на 20%, сэкономит ~1000 ₽")
3. Приоритизированные (начни с самого важного)
4. Реалистичные (не просить сократить расходы в 2 раза)

### 6️⃣ Финансовый прогноз
- Если тренд сохранится, какой баланс будет через 3 месяца?
- Достаточно ли текущих сбережений на экстренные ситуации?
- Какой минимальный ежемесячный доход нужен для финансовой стабильности?

═══════════════════════════════════════════════════════════
ПРАВИЛА ФОРМАТИРОВАНИЯ
═══════════════════════════════════════════════════════════

1. Используй markdown правильно:
   - # H1 для основного заголовка
   - ### H3 для секций
   - Жирный текст для цифр: **150 000 ₽**
   - Списки для перечислений (- пункт, • пункт)
   - Таблицы для данных (| Колонка |)

2. Визуализация:
   - 📊 для статистики
   - 📈 для роста
   - 📉 для падения
   - 💡 для идей и рекомендаций
   - ⚠️ для предупреждений
   - ✅ для позитива
   - 💰 для денег

3. Контент:
   - ИСПОЛЬЗУЙ ТОЛЬКО ПРЕДОСТАВЛЕННЫЕ ДАННЫЕ
   - НЕ ПРИДУМЫВАЙ информацию
   - Будь конкретным, используй цифры
   - Пиши на русском языке
   - Будь доброжелательным и позитивным

4. Объем:
   - Среднее резюме: 1-2 предложения
   - Таблица расходов: полная и ясная
   - Рекомендации: 5-7 штук, детальные
   - Весь отчет: 1500-2500 слов

Теперь создай отчет! Начни с основного заголовка.`;

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.getApiKey()}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 4000,
                        topP: 0.9,
                        topK: 40,
                    },
                    safetySettings: [
                        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Ошибка генерации отчета');
            }

            const data = await response.json();
            const report = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!report) {
                throw new Error('Не удалось сгенерировать отчет');
            }

            return {
                message: report.trim()
            };

        } catch (error) {
            console.error('Report Generation Error:', error);
            return {
                message: '',
                error: error instanceof Error ? error.message : 'Ошибка при генерации отчета'
            };
        }
    }
}

export const aiService = new AIService();
