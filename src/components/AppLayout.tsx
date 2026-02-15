import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <Topbar />
      <main
        className={cn(
          "pt-14 pb-20 md:pb-0 min-h-screen transition-all duration-300",
          "ml-0 md:ml-16 lg:ml-[260px]",
          !sidebarCollapsed && "lg:ml-[260px]"
        )}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
