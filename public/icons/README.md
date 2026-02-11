# PWA Icons Generation Guide

Вам нужно создать PNG иконки следующих размеров в папке `public/icons/`:

## Требуемые иконки:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Быстрый способ - используйте онлайн генератор:

1. **Вариант 1: Favicon Generator**
   - Откройте https://realfavicongenerator.net/
   - Загрузите логотип (можно использовать icon.svg)
   - Скачайте сгенерированные иконки
   
2. **Вариант 2: PWA Asset Generator**
   - Установите: `npm install -g pwa-asset-generator`
   - Запустите: `pwa-asset-generator public/icons/icon.svg public/icons`

3. **Вариант 3: Online Tools**
   - https://www.pwabuilder.com/ - автоматически генерирует все размеры
   - https://app-manifest.firebaseapp.com/

## Временное решение (для разработки):

Используйте icon.svg как фолбэк. Браузеры будут масштабировать его автоматически.

Или создайте копии SVG с разными именами:
```bash
cd public/icons
cp icon.svg icon-72x72.png
cp icon.svg icon-96x96.png
cp icon.svg icon-128x128.png
cp icon.svg icon-144x144.png
cp icon.svg icon-152x152.png
cp icon.svg icon-192x192.png
cp icon.svg icon-384x384.png
cp icon.svg icon-512x512.png
```

## Требования к иконкам:
- Формат: PNG
- Прозрачный или цветной фон
- Квадратные пропорции
- Оптимизированы для небольшого размера файла
