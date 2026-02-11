import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    if (isDismissed) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showInstallButton || dismissed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-24 md:w-[350px] z-50">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl shadow-2xl p-4 flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1">Установить приложение</h3>
          <p className="text-sm text-white/90 mb-3">
            Установите FinSim на домашний экран для быстрого доступа
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              size="small"
              className="bg-white text-primary hover:bg-white/90"
              icon={<DownloadOutlined />}
            >
              Установить
            </Button>
            <Button
              onClick={handleDismiss}
              size="small"
              className="bg-white/20 text-white hover:bg-white/30 border-white/30"
            >
              Позже
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/80 hover:text-white transition-colors p-1"
          aria-label="Закрыть"
        >
          <CloseOutlined />
        </button>
      </div>
    </div>
  );
};
