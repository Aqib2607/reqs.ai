import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Phone,
  Shield,
  Bell,
  Lock,
  Trash2,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user, updateProfile, updatePreferences, changePassword, deleteAccount, logout } = useAppStore();
  const { toast } = useToast();

  // Personal Info State
  const [personalData, setPersonalData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
    role: user?.role || "",
    phone: user?.phone || "",
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setPersonalData({
        name: user.name,
        email: user.email,
        company: user.company || "",
        role: user.role || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(personalData);
      toast({ title: "Success", description: "Profile updated successfully." });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(passwordData);
      setPasswordData({ current_password: "", password: "", password_confirmation: "" });
      toast({ title: "Success", description: "Password changed successfully." });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password.",
        variant: "destructive"
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handlePreferenceToggle = async (key: 'email_notifications' | 'two_factor_enabled', value: boolean) => {
    try {
      await updatePreferences({ [key]: value });
      toast({ title: "Updated", description: "Preference saved." });
    } catch (error: unknown) {
      toast({ title: "Error", description: "Failed to update preference.", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    if (!passwordToDelete) return;
    setDeleting(true);
    try {
      await deleteAccount(passwordToDelete);
      toast({ title: "Goodbye", description: "Account deleted successfully." });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account.",
        variant: "destructive"
      });
      setDeleting(false);
    }
  };

  const initials = personalData.name
    ? personalData.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Sidebar - Profile Overview */}
        <div className="w-full md:w-1/3">
          <div className="glass-card p-6 text-center sticky top-24">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border-2 border-primary/30 relative group">
              <span className="text-3xl font-bold text-primary">{initials}</span>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Sun className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold truncate">{personalData.name}</h2>
            <p className="text-muted-foreground text-sm mb-4 truncate">{personalData.email}</p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 mb-6">
              <Shield className="w-3 h-3" />
              {user?.plan?.toUpperCase() || 'FREE'} PLAN
            </div>

            <nav className="space-y-1 text-left">
              <a href="#personal" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium transition-colors">
                <User className="w-4 h-4" /> Personal Info
              </a>
              <a href="#security" className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary/20 hover:text-foreground text-sm transition-colors">
                <Lock className="w-4 h-4" /> Security
              </a>
              <a href="#preferences" className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-secondary/20 hover:text-foreground text-sm transition-colors">
                <Bell className="w-4 h-4" /> Preferences
              </a>
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-400/10 text-sm transition-colors mt-4"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Right Content - Full Forms */}
        <div className="w-full md:w-2/3 space-y-8">

          {/* Section: Personal Info */}
          <section id="personal" className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Personal Information</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
                <input
                  value={personalData.name}
                  onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={personalData.email}
                  onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Company</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    value={personalData.company}
                    onChange={(e) => setPersonalData({ ...personalData, company: e.target.value })}
                    placeholder="Acme Inc."
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Job Role</label>
                <input
                  value={personalData.role}
                  onChange={(e) => setPersonalData({ ...personalData, role: e.target.value })}
                  placeholder="CTO, Lead Developer..."
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-muted-foreground mb-1.5 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input
                    value={personalData.phone}
                    onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 flex justify-end pt-2">
                <Button disabled={saving} className="gradient-primary">
                  {saving ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </section>

          {/* Section: Security */}
          <section id="security" className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Security & Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">New Password</label>
                  <input
                    type="password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={changingPassword} variant="secondary">
                  {changingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>

            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePreferenceToggle('two_factor_enabled', !user?.two_factor_enabled)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    user?.two_factor_enabled ? "bg-primary" : "bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                    user?.two_factor_enabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </section>

          {/* Section: Preferences */}
          <section id="preferences" className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Preferences</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-4">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-semibold">Email Notifications</h4>
                    <p className="text-xs text-muted-foreground">Receive updates about your project generation status.</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePreferenceToggle('email_notifications', !user?.email_notifications)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    user?.email_notifications ? "bg-primary" : "bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                    user?.email_notifications ? "right-1" : "left-1"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/10 transition-colors">
                <div className="flex items-center gap-4">
                  <Moon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="text-sm font-semibold">Theme Preference</h4>
                    <p className="text-xs text-muted-foreground">Switch between light and dark mode.</p>
                  </div>
                </div>
                <div className="flex bg-secondary/30 p-1 rounded-lg border border-border">
                  <button className="p-1 px-3 rounded-md bg-background text-foreground shadow-sm text-xs font-medium">Dark</button>
                  <button className="p-1 px-3 rounded-md text-muted-foreground hover:text-foreground text-xs font-medium">Light</button>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Danger Zone */}
          <section className="glass-card p-6 border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-3 border-b border-red-500/10 pb-4 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
            </div>

            {!showDeleteConfirm ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="text-sm font-bold">Delete Account</h4>
                  <p className="text-xs text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
                </div>
                <Button onClick={() => setShowDeleteConfirm(true)} variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-sm font-medium text-red-500">To confirm, please enter your password:</p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={passwordToDelete}
                    onChange={(e) => setPasswordToDelete(e.target.value)}
                    placeholder="Confirm Password"
                    className="flex-1 bg-muted/50 border border-red-500/20 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-red-500/50 outline-none"
                  />
                  <Button onClick={handleDeleteAccount} disabled={deleting || !passwordToDelete} variant="destructive">
                    {deleting ? "Deleting..." : "Confirm Delete"}
                  </Button>
                  <Button onClick={() => setShowDeleteConfirm(false)} variant="ghost">Cancel</Button>
                </div>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
