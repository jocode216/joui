declare module "*.module.css";
declare module "*.module.scss";
declare module "*.module.sass";

// Extend global interfaces for PWA

// Navigator extension for iOS
interface Navigator {
  standalone?: boolean;
}

// Window extensions for PWA
interface Window {
  installPWA?: () => Promise<void>;
  showInstallButton?: () => void;
  installForEdge?: () => void;
  deferredPrompt?: any;
}

// BeforeInstallPromptEvent for TypeScript
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Type assertion for the event - simpler solution
declare global {
  interface Window {
    onbeforeinstallprompt:
      | ((this: Window, ev: BeforeInstallPromptEvent) => any)
      | null;
    onappinstalled: ((this: Window, ev: Event) => any) | null;
  }
}
