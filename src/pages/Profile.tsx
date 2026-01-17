import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar, FileText, Zap, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalPlans: 0, totalPRDs: 0 });

    useEffect(() => {
        // Load stats from localStorage
        const plans = JSON.parse(localStorage.getItem('plans') || '[]');
        const prds = JSON.parse(localStorage.getItem('prds') || '[]');
        setStats({
            totalPlans: plans.length,
            totalPRDs: prds.length
        });
    }, []);

    const joinedDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString()
        : "N/A";

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

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-card border border-border">
                        <div className="w-32 h-32 rounded-full gradient-bg flex items-center justify-center text-4xl font-bold text-primary-foreground">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h1 className="text-3xl font-bold">{user?.name}</h1>
                            <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user?.email}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Joined {joinedDate}
                                </span>
                            </div>
                            <div className="pt-4">
                                <Button onClick={() => navigate("/settings")}>
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-6 rounded-xl bg-card border border-border"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg">Total Plans</h3>
                            </div>
                            <p className="text-3xl font-bold">{stats.totalPlans}</p>
                            <p className="text-sm text-muted-foreground mt-1">Generated project plans</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-6 rounded-xl bg-card border border-border"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-secondary/10 text-secondary">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg">PRDs Created</h3>
                            </div>
                            <p className="text-3xl font-bold">{stats.totalPRDs}</p>
                            <p className="text-sm text-muted-foreground mt-1">Detailed requirements docs</p>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Profile;
