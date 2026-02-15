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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 text-xs">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-muted-foreground">API Connected</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm text-foreground hidden md:block">User</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
