# Диаграмма процесса обмена валют

## Поток выполнения обмена

```mermaid
sequenceDiagram
    participant User as Пользователь
    participant UI as ExchangeModal
    participant Store as FinancialStore
    participant Accounts as Accounts State

    User->>UI: Открывает модальное окно обмена
    UI->>UI: Инициализация (RUB → USD по умолчанию)
    
    User->>UI: Выбирает валюту FROM (например, RUB)
    UI->>Accounts: Фильтрует счета с валютой RUB
    UI->>User: Показывает доступные счета в рублях
    
    User->>UI: Выбирает валюту TO (например, USD)
    UI->>Accounts: Фильтрует счета с валютой USD
    UI->>User: Показывает доступные счета в долларах
    
    User->>UI: Вводит сумму (10,000 RUB)
    UI->>UI: Рассчитывает по курсу (10,000 * 0.0108 = 108 USD)
    UI->>User: Отображает сумму получения (108 USD)
    
    User->>UI: Выбирает счет списания
    UI->>User: Показывает доступный баланс
    
    User->>UI: Выбирает счет зачисления
    UI->>User: Показывает текущий баланс
    
    User->>UI: Нажимает "Обменять"
    
    UI->>UI: Валидация полей
    alt Ошибка валидации
        UI->>User: Показывает сообщение об ошибке
    else Успешная валидация
        UI->>Store: exchangeCurrency(fromAcc, toAcc, fromAmount, toAmount)
        
        Store->>Accounts: Проверяет существование счетов
        Store->>Accounts: Проверяет достаточность средств
        
        alt Недостаточно средств
            Store-->>UI: return false
            UI->>User: "Недостаточно средств"
        else Достаточно средств
            Store->>Accounts: Списывает средства с FROM счета
            Store->>Accounts: Зачисляет средства на TO счет
            Store->>Store: Создает транзакцию списания
            Store->>Store: Создает транзакцию зачисления
            Store-->>UI: return true
            
            UI->>UI: Показывает экран успеха
            UI->>User: "Обмен выполнен!"
        end
    end
```

## Диаграмма компонентов

```mermaid
graph TB
    A[Dashboard/Accounts Page] -->|открывает| B[ExchangeModal]
    B -->|использует| C[useFinancialStore]
    C -->|управляет| D[Accounts State]
    C -->|управляет| E[Transactions State]
    
    B -->|отображает| F[Exchange Rates]
    B -->|фильтрует| G[FROM Accounts]
    B -->|фильтрует| H[TO Accounts]
    
    B -->|вызывает| I[exchangeCurrency]
    I -->|обновляет| D
    I -->|создает| J[Transaction: expense]
    I -->|создает| K[Transaction: income]
    
    J -->|добавляется в| E
    K -->|добавляется в| E
    
    style B fill:#0050B3,color:#fff
    style C fill:#10B981,color:#fff
    style I fill:#F59E0B,color:#fff
```

## Диаграмма состояний

```mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: Пользователь открывает модальное окно
    
    Open --> SelectingCurrencies: Выбор валют
    SelectingCurrencies --> EnteringAmount: Валюты выбраны
    
    EnteringAmount --> SelectingAccounts: Сумма введена
    SelectingAccounts --> ReadyToExchange: Счета выбраны
    
    ReadyToExchange --> Validating: Нажата кнопка "Обменять"
    
    Validating --> Error: Ошибка валидации
    Error --> SelectingAccounts: Исправление ошибки
    
    Validating --> Processing: Валидация пройдена
    Processing --> CheckingBalance: Проверка баланса
    
    CheckingBalance --> InsufficientFunds: Недостаточно средств
    InsufficientFunds --> EnteringAmount: Изменить сумму
    
    CheckingBalance --> Exchanging: Средств достаточно
    Exchanging --> Success: Обмен выполнен
    
    Success --> Closed: Пользователь закрывает окно
    Error --> Closed: Отмена
    Open --> Closed: Отмена
```

## Структура данных

```mermaid
classDiagram
    class Account {
        +string id
        +string name
        +string type
        +string currency
        +number balance
        +string accountNumber
        +boolean isActive
        +string color
    }
    
    class Transaction {
        +string id
        +string date
        +string description
        +string category
        +number amount
        +string type
        +string accountId
        +string status
    }
    
    class ExchangeRate {
        +string from
        +string to
        +number rate
        +number change
    }
    
    class FinancialStore {
        +Account[] accounts
        +Transaction[] transactions
        +exchangeCurrency(fromAccountId, toAccountId, fromAmount, toAmount)
        +updateAccountBalance(accountId, newBalance)
        +addTransaction(transaction)
    }
    
    FinancialStore "1" --> "*" Account
    FinancialStore "1" --> "*" Transaction
    Transaction "*" --> "1" Account : belongs to
    ExchangeRate ..> Account : используется для обмена
```

## Алгоритм обмена

```mermaid
flowchart TD
    Start([Начало обмена]) --> Validate{Валидация<br/>данных}
    
    Validate -->|Ошибка| ShowError[Показать ошибку]
    ShowError --> End([Конец])
    
    Validate -->|OK| CheckAccounts{Счета<br/>существуют?}
    CheckAccounts -->|Нет| Error1[Ошибка: Счет не найден]
    Error1 --> End
    
    CheckAccounts -->|Да| CheckBalance{Баланс FROM<br/> >= сумма?}
    CheckBalance -->|Нет| Error2[Ошибка: Недостаточно средств]
    Error2 --> End
    
    CheckBalance -->|Да| UpdateFrom[Списать с FROM счета]
    UpdateFrom --> UpdateTo[Зачислить на TO счет]
    UpdateTo --> CreateTx1[Создать транзакцию<br/>расхода]
    CreateTx1 --> CreateTx2[Создать транзакцию<br/>дохода]
    CreateTx2 --> Success[Успех!]
    Success --> End
    
    style Start fill:#10B981,color:#fff
    style Success fill:#10B981,color:#fff
    style Error1 fill:#EF4444,color:#fff
    style Error2 fill:#EF4444,color:#fff
    style ShowError fill:#EF4444,color:#fff
    style End fill:#6B7280,color:#fff
```

## Расчет курса обмена

```
Пример:
- Пользователь хочет обменять 10,000 RUB на USD
- Курс RUB → USD = 0.0108
- Сумма получения = 10,000 × 0.0108 = 108 USD

Формула:
TO_AMOUNT = FROM_AMOUNT × EXCHANGE_RATE

Где:
- FROM_AMOUNT - сумма списания
- EXCHANGE_RATE - курс обмена валют
- TO_AMOUNT - сумма зачисления
```
