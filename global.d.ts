declare global {
  interface TelegramWebApp {
    initData: string;
    initDataUnsafe: Record<string, any>;
    ready: () => void;
    expand: () => void;
  }

  interface Telegram {
    WebApp: TelegramWebApp;
  }

  interface Window {
    BTRenderer: any;
    Telegram: Telegram;
  }
}

export {};
