import { Bell, Wifi, WifiOff, ChevronDown, User } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { currentProject, sidebarCollapsed } = useAppStore();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-[260px]"
      )}
    >
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          {currentProject?.name || "Reqs.ai"}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* API Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/20 border border-secondary/30 text-xs">
          <Wifi className="w-3.5 h-3.5 text-secondary" />
          <span className="text-secondary font-medium">API Connected</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full animate-pulse" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary/10 hover:border hover:border-secondary/30 transition-colors">
          <div className="w-7 h-7 rounded-full bg-secondary/20 border border-secondary/40 flex items-center justify-center">
            <User className="w-4 h-4 text-secondary" />
          </div>
          <span className="text-sm text-foreground hidden md:block">User</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
