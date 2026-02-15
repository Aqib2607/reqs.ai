import { User, Mail, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Profile Settings</h1>

      <div className="glass-card p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-base md:text-lg font-semibold">John Doe</h2>
            <p className="text-sm text-muted-foreground">john@example.com</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
            <input
              defaultValue="John Doe"
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <input
              defaultValue="john@example.com"
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button className="gradient-primary text-primary-foreground border-0">Save Changes</Button>
        </div>
      </div>

      <div className="glass-card p-4 md:p-6">
        <h3 className="font-semibold mb-4 text-sm md:text-base">Preferences</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Email Notifications</span>
            </div>
            <button className="w-10 h-6 rounded-full bg-primary relative">
              <div className="w-4 h-4 rounded-full bg-primary-foreground absolute right-1 top-1" />
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Two-Factor Auth</span>
            </div>
            <button className="w-10 h-6 rounded-full bg-secondary relative">
              <div className="w-4 h-4 rounded-full bg-muted-foreground absolute left-1 top-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
