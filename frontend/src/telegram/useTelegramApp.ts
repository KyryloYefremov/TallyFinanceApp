import { useMemo } from "react";

type TelegramWebApp = Readonly<{
  initData: string;
  colorScheme: "light" | "dark";
  ready: () => void;
  expand: () => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  HapticFeedback?: {
    notificationOccurred: (type: "success" | "error" | "warning") => void;
    impactOccurred: (type: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
  };
}>;

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export type TelegramAdapter = Readonly<{
  isTelegram: boolean;
  ready: () => void;
  expand: () => void;
  confirm: (message: string) => Promise<boolean>;
  notifySuccess: () => void;
  notifyError: () => void;
}>;

export function useTelegramApp(): TelegramAdapter {
  return useMemo(() => {
    const webApp = window.Telegram?.WebApp;

    return {
      isTelegram: Boolean(webApp?.initData),
      ready: () => webApp?.ready(),
      expand: () => webApp?.expand(),
      confirm: (message: string) =>
        new Promise((resolve) => {
          if (webApp) {
            webApp.showConfirm(message, resolve);
            return;
          }

          resolve(window.confirm(message));
        }),
      notifySuccess: () => webApp?.HapticFeedback?.notificationOccurred("success"),
      notifyError: () => webApp?.HapticFeedback?.notificationOccurred("error"),
    };
  }, []);
}

