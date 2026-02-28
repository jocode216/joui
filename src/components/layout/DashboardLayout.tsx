import { ReactNode, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "./DashboardSidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Toggle Button */}
      {!sidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-4 z-50 md:hidden bg-background shadow-md border-border"
          onClick={() => setSidebarOpen(true)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <DashboardSidebar
        className={cn(
          "-translate-x-full md:translate-x-0", // Default hidden on mobile, visible on desktop
          sidebarOpen ? "translate-x-0" : "", // Show when open
        )}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen transition-all duration-300 md:ml-20">
        <div className="p-4 md:p-8 pt-16 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
