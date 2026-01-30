import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  FileText,
  Clock,
  LogOut,
  User,
  Settings,
  Zap,
  ChevronRight,
  Send,
  Search,
  Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { DashboardSkeleton } from "@/components/loading/DashboardSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Plan {
  _id: string;
  ideaText: string;
  createdAt: string;
}

const Dashboard = () => {
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({ totalPlans: 0, totalPRDs: 0 });
  const [recentActivity, setRecentActivity] = useState<Plan[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Load data from localStorage
    const loadData = () => {
      try {
        const plans = JSON.parse(localStorage.getItem('plans') || '[]');
        const prds = JSON.parse(localStorage.getItem('prds') || '[]');

        setStats({
          totalPlans: plans.length,
          totalPRDs: prds.length
        });

        // Get recent plans (last 5)
        setRecentActivity(plans.slice(-5).reverse());
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, []);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-muted animate-pulse"></div>
        </header>
        <DashboardSkeleton />
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!idea.trim()) {
      toast({
        title: "Please enter your idea",
        description: "Describe your project idea to generate a plan.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Mock plan generation - store in localStorage
      const newPlan: Plan = {
        _id: 'plan-' + Date.now(),
        ideaText: idea,
        createdAt: new Date().toISOString()
      };

      const plans = JSON.parse(localStorage.getItem('plans') || '[]');
      plans.push({
        ...newPlan,
        status: 'completed',
        generatedPlan: `# Project Plan for: ${idea}\n\n## Overview\nThis is a generated plan for your project idea.\n\n## Goals\n- Define the core features\n- Plan the architecture\n- Set milestones\n\n## Timeline\n- Week 1-2: Planning and Design\n- Week 3-4: Development\n- Week 5: Testing and Launch`
      });
      localStorage.setItem('plans', JSON.stringify(plans));

      toast({
        title: "Plan generated!",
        description: "Your project plan is ready.",
      });

      navigate(`/plan/${newPlan._id}`);
    } catch (err) {
      toast({
        title: "Generation failed",
        description: "Could not generate plan",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col w-64 border-r border-border bg-card p-6"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground dark:text-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Reqs.ai</span>
        </Link>

        {/* Stats */}
        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-xl bg-muted">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">Plans Generated</span>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold"
            >
              {stats.totalPlans}
            </motion.p>
          </div>
          <div className="p-4 rounded-xl bg-muted">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-secondary-foreground dark:text-secondary" />
              <span className="text-sm text-foreground">PRDs Created</span>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold"
            >
              {stats.totalPRDs}
            </motion.p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Plans</h3>
          <div className="space-y-2">
            {recentActivity.map((plan) => (
              <motion.button
                key={plan._id}
                whileHover={{ x: 4 }}
                onClick={() => navigate(`/plan/${plan._id}`)}
                className="w-full p-3 rounded-lg text-left hover:bg-muted transition-colors"
                title={plan.ideaText}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate w-32 text-foreground">
                    {plan.ideaText && plan.ideaText.length > 20
                      ? plan.ideaText.substring(0, 20) + "..."
                      : (plan.ideaText || "Untitled Plan")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </span>
              </motion.button>
            ))}
            {recentActivity.length === 0 && (
              <div className="p-4 rounded-lg border border-dashed border-border/50 text-center">
                <p className="text-xs text-muted-foreground">No recent plans</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        {/* Navigation - Removed and moved to Navbar */}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between p-6 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Reqs.ai</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="w-64 pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20 transition-all hover:bg-muted"
              />
            </div>
            <div className="h-6 w-px bg-border mx-2"></div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-xs ring-2 ring-border ml-2 cursor-pointer hover:ring-primary transition-all">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground dark:text-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Reqs.ai</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/70 to-background z-10" />
            <img
              src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=90&auto=format&fit=crop"
              alt="Background"
              className="w-full h-full object-cover opacity-30"
            />
          </div>

          <motion.div
            className="absolute -top-32 -right-32 w-96 h-96 opacity-20 pointer-events-none blur-3xl bg-primary/20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute top-10 right-10 w-48 h-48 opacity-25 pointer-events-none"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=90&auto=format&fit=crop"
              alt="Element"
              className="w-full h-full object-cover rounded-3xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-10 w-40 h-40 opacity-20 pointer-events-none"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=90&auto=format&fit=crop"
              alt="Element"
              className="w-full h-full object-cover rounded-3xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl relative z-20"
          >
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-8 h-8 text-primary-foreground dark:text-foreground" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">
                Welcome back, <span className="text-foreground">{user?.name || "Developer"}</span>
              </h1>
              <p className="text-muted-foreground">
                What would you like to build today?
              </p>
            </div>

            {/* Input Area */}
            <div className="relative">
              <Textarea
                placeholder="Describe your project idea here... Be as detailed as you'd like!"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="min-h-[200px] resize-none text-base p-6 rounded-2xl border-2 border-border focus:border-primary transition-colors"
                disabled={isGenerating}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {idea.length} characters
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Button
                variant="gradient"
                size="xl"
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Generating your plan...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Generate Plan
                  </>
                )}
              </Button>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 rounded-xl bg-muted/50"
            >
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Tips for better results</h3>
                  <p className="text-sm text-muted-foreground">
                    Include target audience, key features, and any technical preferences for more comprehensive plans.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
