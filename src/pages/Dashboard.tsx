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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { planService } from "@/services/planService";
import { userService } from "@/services/userService";
import { DashboardSkeleton } from "@/components/loading/DashboardSkeleton";

const Dashboard = () => {
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({ totalPlans: 0, totalPRDs: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await userService.getDashboardStats();
        if (statsData.status === 'success') {
          setStats({
            totalPlans: statsData.data.aggregation.totalPlans,
            totalPRDs: statsData.data.aggregation.totalPRDs
          });
          setRecentActivity(statsData.data.recentPlans || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          {/* Minimal header for mobile while loading */}
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
      const result = await planService.createPlan({
        ideaText: idea,
        visibility: 'private'
      });

      toast({
        title: "Plan generated!",
        description: "Your project plan is ready.",
      });

      // The createPlan controller returns { status: 'success', data: { plan: ... } }
      navigate(`/plan/${result.data.plan._id}`);
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.response?.data?.message || "Could not generate plan",
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
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">Reqs.ai</span>
        </Link>

        {/* Stats */}
        <div className="space-y-4 mb-8">
          <div className="p-4 rounded-xl bg-muted">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Plans Generated</span>
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
              <Zap className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">PRDs Created</span>
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
                  <span className="text-sm font-medium truncate w-32">
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
        <div className="space-y-2 pt-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <User className="w-4 h-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">Reqs.ai</span>
          </Link>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, <span className="gradient-text">{user?.name || "Developer"}</span>
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
                variant="hero"
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
