import { Modal as AntdModal } from 'antd';
import type { ModalProps } from 'antd';
import { useEffect } from 'react';
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock';

/**
 * Обертка над Modal из Antd с автоматической блокировкой скролла body
 * Решает проблему скролла фона на мобильных устройствах
 */
export const Modal = ({ open, ...props }: ModalProps) => {
  // Блокируем скролл body при открытии модального окна
  useBodyScrollLock(open || false);

  return <AntdModal open={open} {...props} />;
};

// Экспортируем статические методы Modal
Modal.confirm = AntdModal.confirm;
Modal.info = AntdModal.info;
Modal.success = AntdModal.success;
Modal.error = AntdModal.error;
Modal.warning = AntdModal.warning;
Modal.destroyAll = AntdModal.destroyAll;
Modal.useModal = AntdModal.useModal;

export default Modal;
