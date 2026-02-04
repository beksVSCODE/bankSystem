# CSS Utility Classes - Шпаргалка 🎨

## 🔮 Glassmorphism
```jsx
// Светлый вариант
<div className="glass-effect">
  Полупрозрачный фон с blur
</div>

// Темный вариант
<div className="glass-effect-dark">
  Темное стекло
</div>
```

## 🎭 Neumorphism
```jsx
// Выпуклый эффект
<div className="neu-shadow">
  3D тень снаружи
</div>

// Вдавленный эффект
<div className="neu-shadow-inset">
  3D тень внутри
</div>
```

## 🌈 Gradient Text
```jsx
// Синий градиент (primary)
<h1 className="gradient-text">Заголовок</h1>

// Зеленый градиент (success)
<span className="gradient-text-success">+1000₽</span>

// Красный градиент (danger)
<span className="gradient-text-danger">-500₽</span>
```

## ✨ Анимации

### Float (плавающие элементы)
```jsx
<div className="animate-float">
  Парящий элемент
</div>
```

### Pulse Glow (пульсирующее свечение)
```jsx
<button className="animate-pulse-glow">
  Светящаяся кнопка
</button>
```

### Skeleton Loading
```jsx
<div className="skeleton h-20 w-full rounded-xl">
  Загрузка...
</div>
```

### Stagger (последовательное появление)
```jsx
{items.map((item, index) => (
  <div 
    key={item.id}
    className="stagger-item"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    {item.content}
  </div>
))}
```

### Shimmer (мерцание)
```jsx
<div className="shimmer h-32 rounded-xl">
  Мерцающий placeholder
</div>
```

## 🎯 Touch Feedback

### Active Scale
```jsx
// При нажатии уменьшается до 97%
<button className="active-scale">
  Кнопка
</button>
```

### Ripple Effect
```jsx
<button className="ripple">
  Кнопка с волновым эффектом
</button>
```

## 💳 Banking Components

### Bank Card
```jsx
<div className="bank-card">
  Карточка в стиле банковской карты
</div>

// С анимированным градиентом
<div className="bank-card bank-card-animated">
  Карточка с движущимся градиентом
</div>
```

### Stats Card
```jsx
<div className="stats-card">
  Статистическая карточка с hover эффектом
</div>
```

### Glass Card
```jsx
<div className="glass-card">
  Карточка со стеклянным эффектом
</div>
```

### Tilt Card (только desktop)
```jsx
<div className="tilt-card">
  Карточка с 3D наклоном при hover
</div>
```

## 📐 Responsive Text

### Автоматический размер шрифта
```jsx
<h1 className="text-responsive-3xl">
  Огромный заголовок (1.875rem → 2.5rem)
</h1>

<h2 className="text-responsive-2xl">
  Большой заголовок (1.5rem → 2rem)
</h2>

<h3 className="text-responsive-xl">
  Заголовок (1.125rem → 1.25rem)
</h3>

<p className="text-responsive-lg">
  Большой текст (1rem → 1.125rem)
</p>

<p className="text-responsive-base">
  Базовый текст (0.875rem → 1rem)
</p>

<span className="text-responsive-sm">
  Маленький текст (0.75rem → 0.875rem)
</span>

<small className="text-responsive-xs">
  Очень маленький (0.625rem → 0.75rem)
</small>
```

## 🔔 Badge Pulse
```jsx
<span className="badge-pulse">
  Пульсирующий badge
</span>
```

## 🎨 Amount Formatting
```jsx
// Положительная сумма (зеленый)
<span className="amount-positive">
  +1000₽
</span>

// Отрицательная сумма (красный)
<span className="amount-negative">
  -500₽
</span>
```

## 🧭 Navigation Link
```jsx
<NavLink to="/dashboard" className="nav-link">
  <HomeOutlined />
  <span>Главная</span>
</NavLink>

// Активная ссылка
<NavLink to="/dashboard" className="nav-link active">
  <HomeOutlined />
  <span>Главная</span>
</NavLink>
```

## 🖱️ Buttons

### Bank Button (primary)
```jsx
<button className="btn-bank">
  Основная кнопка
</button>
```

### Bank Button Outline
```jsx
<button className="btn-bank-outline">
  Обводка кнопки
</button>
```

## 📝 Input
```jsx
<input 
  type="text" 
  className="input-bank"
  placeholder="Введите значение"
/>
```

## 📜 Scrollbar

### Hide Scrollbar
```jsx
<div className="hide-scrollbar overflow-y-auto">
  Контент без видимого scrollbar
</div>
```

## 🌊 Swipe Hint
```jsx
<div className="swipe-hint overflow-x-auto">
  Контент с градиентом справа (намек на прокрутку)
</div>
```

## 📱 Mobile Breakpoints

```jsx
// Extra small (475px+)
<div className="xs:text-base">

// Small (640px+)
<div className="sm:text-lg">

// Medium (768px+)
<div className="md:text-xl">

// Large (1024px+)
<div className="lg:text-2xl">

// Extra large (1280px+)
<div className="xl:text-3xl">

// 2X large (1536px+)
<div className="2xl:text-4xl">
```

## 🎪 Комбинации

### Карточка счета с эффектами
```jsx
<div className="stats-card hover:shadow-lg hover:-translate-y-1 active-scale transition-all duration-300 group">
  <div className="glass-effect p-4 rounded-xl">
    <h3 className="text-responsive-lg gradient-text">
      Основной счет
    </h3>
    <p className="text-responsive-2xl font-bold">
      125 000₽
    </p>
  </div>
</div>
```

### Кнопка quick action
```jsx
<button className="btn-bank ripple active-scale animate-pulse-glow">
  <SendOutlined />
  <span className="text-responsive-sm">Перевести</span>
</button>
```

### Loading placeholder
```jsx
<div className="space-y-3">
  <div className="skeleton h-20 rounded-xl" />
  <div className="shimmer h-32 rounded-2xl" />
  <div className="skeleton h-16 rounded-lg" />
</div>
```

### Транзакция в списке
```jsx
<div 
  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 active:bg-muted transition-all cursor-pointer group"
  style={{ animationDelay: `${index * 50}ms` }}
>
  <div className="w-10 h-10 rounded-full neu-shadow flex items-center justify-center group-hover:scale-110 transition-transform">
    <ArrowDownOutlined className="gradient-text-success" />
  </div>
  <div className="flex-1">
    <p className="text-responsive-base font-medium">Зарплата</p>
    <p className="text-responsive-xs text-muted-foreground">15.12.2024</p>
  </div>
  <span className="amount-positive text-responsive-lg">
    +50 000₽
  </span>
</div>
```

## 🎨 Цвета через CSS Variables

### Использование в inline styles
```jsx
<div style={{ 
  backgroundColor: 'hsl(var(--primary))',
  color: 'hsl(var(--primary-foreground))'
}}>
  Контент
</div>
```

### Доступные переменные
```css
--primary          /* Основной синий */
--primary-foreground
--secondary        /* Светло-синий */
--secondary-foreground
--muted            /* Приглушенный */
--muted-foreground
--accent           /* Акцент */
--accent-foreground
--destructive      /* Красный для ошибок */
--destructive-foreground
--success          /* Зеленый для успеха */
--success-foreground
--warning          /* Желтый для предупреждений */
--warning-foreground
--border           /* Цвет границ */
--input            /* Фон инпутов */
--ring             /* Outline при фокусе */
--card             /* Фон карточек */
--card-foreground
--sidebar-*        /* Цвета сайдбара */
```

## ⚡ Performance Tips

### Оптимизация анимаций
```jsx
// ✅ Хорошо - использует GPU
<div className="transition-transform duration-300 hover:scale-105">

// ❌ Плохо - не использует GPU
<div className="transition-all duration-300 hover:w-full">
```

### Debounce для hover
```jsx
// Добавляйте задержки для предотвращения лишних перерисовок
<div className="transition-all duration-300 hover:shadow-lg">
```

---

**Совет**: Комбинируйте классы для создания уникальных эффектов!

Примеры:
- `glass-effect + neu-shadow` = стеклянная карточка с 3D эффектом
- `animate-float + animate-pulse-glow` = парящий светящийся элемент
- `ripple + active-scale` = кнопка с двойным feedback

**Важно**: Не используйте слишком много анимаций одновременно - это может замедлить UI!
