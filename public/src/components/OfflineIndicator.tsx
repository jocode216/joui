import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
      <WifiOff className="h-4 w-4" />
      You are currently offline. Check your internet connection.
    </div>
  );
};

export default OfflineIndicator;
