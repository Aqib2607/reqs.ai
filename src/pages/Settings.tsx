import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sparkles,
    ArrowLeft,
    User,
    Save,
    Loader2,
    MessageSquare,
    Key,
    Trash,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import FeedbackForm from "@/components/FeedbackForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [profileData, setProfileData] = useState({ name: "", email: "" });
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
        if (user) {
            setProfileData({ name: user.name, email: user.email });
        }
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) setApiKey(storedKey);
    }, [user]);

    const handleApiKeySave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            localStorage.setItem('openai_api_key', apiKey);
            toast({ title: "API Key Saved", description: "Your API key has been saved securely in your browser." });
        } catch (error) {
            toast({
                title: "Save failed",
                description: "Could not save API key",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Mock profile update - update localStorage
            const updatedUser = { ...user, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            toast({ title: "Profile updated", description: "Your profile has been updated successfully." });
        } catch (error) {
            toast({
                title: "Update failed",
                description: "Could not update profile",
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
            // Mock password update
            toast({ title: "Password updated", description: "Your password has been changed." });
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (error) {
            toast({
                title: "Update failed",
                description: "Could not update password",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = () => {
        if (confirm("Are you sure you want to delete all generated plans and PRDs? This action cannot be undone.")) {
            localStorage.removeItem('plans');
            localStorage.removeItem('prds');
            toast({
                title: "History Cleared",
                description: "All generated plans and PRDs have been deleted.",
            });
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
                        <ThemeToggle />
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
                            variant={activeTab === "feedback" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => setActiveTab("feedback")}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Feedback
                        </Button>
                        <Button
                            variant={activeTab === "api-key" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => setActiveTab("api-key")}
                        >
                            <Key className="w-4 h-4" />
                            API Keys
                        </Button>
                        <Button
                            variant={activeTab === "data" ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => setActiveTab("data")}
                        >
                            <Trash className="w-4 h-4" />
                            Data Management
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

                        {activeTab === "api-key" && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">API Keys</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Manage your API keys to access AI features. Your key is stored locally in your browser.
                                    </p>
                                    <form onSubmit={handleApiKeySave} className="space-y-4 max-w-md">
                                        <div className="space-y-2">
                                            <Label htmlFor="api-key">OpenAI API Key</Label>
                                            <div className="relative">
                                                <Input
                                                    id="api-key"
                                                    type="password"
                                                    placeholder="sk-..."
                                                    value={apiKey}
                                                    onChange={(e) => setApiKey(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                We never store your API key on our servers.
                                            </p>
                                        </div>
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                            Save API Key
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === "data" && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Data Management</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Manage your local data. Clearing history will remove all generated plans and PRDs from this device.
                                    </p>

                                    <div className="p-4 border border-destructive/20 rounded-xl bg-destructive/5">
                                        <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Once you delete your history, there is no going back. Please be certain.
                                        </p>
                                        <Button
                                            variant="destructive"
                                            onClick={handleClearHistory}
                                        >
                                            <Trash className="w-4 h-4 mr-2" />
                                            Delete All History
                                        </Button>
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
