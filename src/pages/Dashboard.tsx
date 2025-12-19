import { useState } from "react";
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

const recentActivity = [
  { id: 1, title: "E-commerce Platform", time: "2 hours ago", type: "plan" },
  { id: 2, title: "Mobile App PRD", time: "1 day ago", type: "prd" },
  { id: 3, title: "SaaS Dashboard", time: "3 days ago", type: "plan" },
];

const Dashboard = () => {
  const [idea, setIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    navigate("/plan");
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
              12
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
              8
            </motion.p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                className="w-full p-3 rounded-lg text-left hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{item.title}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <User className="w-4 h-4" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            onClick={() => navigate("/")}
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
                Welcome back, <span className="gradient-text">Developer</span>
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
