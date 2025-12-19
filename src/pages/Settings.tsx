import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sparkles,
    ArrowLeft,
    User,
    Key,
    Save,
    Trash2,
    Plus,
    Loader2,
    MessageSquare,
} from "lucide-react";
import FeedbackForm from "@/components/FeedbackForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { apiKeyService } from "@/services/apiKeyService";

const Settings = () => {
    const { user, login } = useAuth(); // Assuming login updates user context if needed, or we might need a refreshUser function
    const [activeTab, setActiveTab] = useState("profile");
    const [profileData, setProfileData] = useState({ name: "", email: "" });
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [apiKeys, setApiKeys] = useState<{ _id: string, label: string, last4: string }[]>([]);
    const [newKey, setNewKey] = useState("");
    const [keyLabel, setKeyLabel] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setProfileData({ name: user.name, email: user.email });
        }
    }, [user]);

    useEffect(() => {
        if (activeTab === "api-keys") {
            fetchApiKeys();
        }
    }, [activeTab]);

    const fetchApiKeys = async () => {
        try {
            const response = await apiKeyService.getKeys();
            if (response.status === 'success') {
                setApiKeys(response.data.keys);
            }
        } catch (error) {
            console.error("Failed to fetch API keys", error);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await userService.updateProfile(profileData);
            toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const message = error.response?.data?.message || "Could not update profile";
            toast({
                title: "Update failed",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast({ title: "Passwords match error", description: "New passwords do not match.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            await userService.updatePassword({
                currentPassword: passwords.current,
                password: passwords.new,
                passwordConfirm: passwords.confirm
            });
            toast({ title: "Password updated", description: "Your password has been changed." });
            setPasswords({ current: "", new: "", confirm: "" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const message = error.response?.data?.message || "Could not update password";
            toast({
                title: "Update failed",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKey) return;
        setIsLoading(true);
        try {
            await apiKeyService.addKey(newKey, keyLabel || "My API Key");
            toast({ title: "API Key added", description: "Your API key has been stored securely." });
            setNewKey("");
            setKeyLabel("");
            fetchApiKeys();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const message = error.response?.data?.message || "Could not add API key";
            toast({
                title: "Failed to add key",
                description: message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteKey = async (id: string) => {
        try {
            await apiKeyService.deleteKey(id);
            toast({ title: "API Key deleted", description: "The API key has been removed." });
            fetchApiKeys();
        } catch (error) {
            toast({ title: "Error", description: "Could not delete API key", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/dashboard")}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-bold gradient-text hidden sm:inline">Reqs.ai</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">
                    {/* Sidebar */}
                    <aside className="lg:w-64 space-y-2">
                        <Button
                            variant={activeTab === "profile" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => setActiveTab("profile")}
                        >
                            <User className="w-4 h-4" />
                            Profile Settings
                        </Button>
                        <Button
                            variant={activeTab === "api-keys" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => setActiveTab("api-keys")}
                        >
                            <Key className="w-4 h-4" />
                            API Keys
                        </Button>
                        <Button
                            variant={activeTab === "feedback" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => setActiveTab("feedback")}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Feedback
                        </Button>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 bg-card rounded-xl border border-border p-6 lg:p-8">
                        {activeTab === "profile" && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
                                    <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            />
                                        </div>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                            Save Changes
                                        </Button>
                                    </form>
                                </div>

                                <div className="pt-8 border-t border-border">
                                    <h3 className="text-xl font-bold mb-4">Change Password</h3>
                                    <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input
                                                id="current-password"
                                                type="password"
                                                value={passwords.current}
                                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                            />
                                        </div>
                                        <Button type="submit" variant="secondary" disabled={isLoading}>
                                            Update Password
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === "api-keys" && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">API Keys</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Manage your Gemini API keys here. We encrypt them securely.
                                    </p>

                                    <form onSubmit={handleAddKey} className="glass p-6 rounded-xl space-y-4 mb-8">
                                        <h3 className="font-semibold">Add New Key</h3>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="key-label">Label (Optional)</Label>
                                                <Input
                                                    id="key-label"
                                                    placeholder="e.g. My Personal Key"
                                                    value={keyLabel}
                                                    onChange={(e) => setKeyLabel(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="api-key">API Key</Label>
                                                <Input
                                                    id="api-key"
                                                    type="password"
                                                    placeholder="Paste your Gemini API key"
                                                    value={newKey}
                                                    onChange={(e) => setNewKey(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={isLoading || !newKey}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Key
                                        </Button>
                                    </form>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Your Keys</h3>
                                        {apiKeys.length === 0 ? (
                                            <p className="text-muted-foreground italic">No API keys added yet.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {apiKeys.map((key) => (
                                                    <div key={key._id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <Key className="w-5 h-5 text-primary" />
                                                            <div>
                                                                <p className="font-medium">{key.label || "Unnamed Key"}</p>
                                                                <p className="text-xs text-muted-foreground">Ends in ...{key.last4}</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteKey(key._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}


                        {activeTab === "feedback" && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Share Feedback</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Help us improve Reqs.ai by sharing your thoughts, reporting bugs, or suggesting features.
                                    </p>
                                    <div className="flex justify-center sm:justify-start">
                                        <FeedbackForm />
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

        </div>
    );
};

export default Settings;
