import { useEffect } from 'react';

/**
 * Hook для блокировки скролла body при открытии модальных окон
 * Предотвращает скролл фона на мобильных устройствах
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    // Сохраняем текущую позицию скролла
    const scrollY = window.scrollY;
    const body = document.body;
    const html = document.documentElement;

    // Применяем стили для блокировки скролла
    const originalBodyOverflow = body.style.overflow;
    const originalBodyPosition = body.style.position;
    const originalBodyTop = body.style.top;
    const originalBodyWidth = body.style.width;
    const originalHtmlOverflow = html.style.overflow;

    // Добавляем класс для блокировки скролла (работает вместе с CSS)
    body.classList.add('body-scroll-lock');

    // Блокируем скролл с сохранением позиции
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    html.style.overflow = 'hidden';

    // Cleanup: восстанавливаем скролл при размонтировании
    return () => {
      body.classList.remove('body-scroll-lock');
      body.style.overflow = originalBodyOverflow;
      body.style.position = originalBodyPosition;
      body.style.top = originalBodyTop;
      body.style.width = originalBodyWidth;
      html.style.overflow = originalHtmlOverflow;

      // Восстанавливаем позицию скролла
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}
