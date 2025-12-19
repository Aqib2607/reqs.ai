import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileText,
  Edit,
  Save,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const planSections = [
  {
    title: "Executive Summary",
    content: "A comprehensive e-commerce platform designed to provide seamless shopping experiences with AI-powered recommendations, secure payments, and real-time inventory management.",
  },
  {
    title: "Target Audience",
    content: "Online shoppers aged 25-45, small to medium business owners looking to expand their digital presence, and retail companies seeking modern e-commerce solutions.",
  },
  {
    title: "Core Features",
    content: `• Product catalog with advanced filtering and search
• AI-powered product recommendations
• Secure checkout with multiple payment options
• User accounts with order history and wishlists
• Real-time inventory management
• Admin dashboard for store management
• Mobile-responsive design
• Integration with major shipping providers`,
  },
  {
    title: "Technical Stack",
    content: `Frontend: React with TypeScript, Tailwind CSS
Backend: Node.js with Express
Database: PostgreSQL with Redis caching
Authentication: JWT with OAuth2 support
Payment: Stripe integration
Hosting: AWS with CDN distribution`,
  },
  {
    title: "Timeline",
    content: `Phase 1 (Weeks 1-4): Core infrastructure and authentication
Phase 2 (Weeks 5-8): Product catalog and search functionality
Phase 3 (Weeks 9-12): Checkout and payment integration
Phase 4 (Weeks 13-16): Admin dashboard and analytics
Phase 5 (Weeks 17-20): Testing, optimization, and launch`,
  },
  {
    title: "Success Metrics",
    content: `• Page load time < 2 seconds
• 99.9% uptime SLA
• Conversion rate > 3%
• Customer satisfaction score > 4.5/5
• Cart abandonment rate < 60%`,
  },
];

const PlanView = () => {
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleCopy = () => {
    const content = planSections.map((s) => `${s.title}\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Plan content has been copied.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePRD = () => {
    toast({
      title: "Generating PRD...",
      description: "Your PRD will be ready in a moment.",
    });
    setTimeout(() => navigate("/prd"), 1500);
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

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button variant="gradient" size="sm" className="gap-2" onClick={handleGeneratePRD}>
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Generate PRD</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
            >
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Plan Generated Successfully</span>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">E-Commerce Platform</h1>
            <p className="text-muted-foreground">Project Plan Overview</p>
          </div>

          {/* Plan Sections */}
          <div className="space-y-4">
            {planSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden card-shadow"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  {expandedSections.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                          {section.content}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="hero" size="lg" className="gap-2" onClick={handleGeneratePRD}>
              <FileText className="w-5 h-5" />
              Generate Full PRD
            </Button>
            <Button variant="glass" size="lg" className="gap-2">
              <Share2 className="w-5 h-5" />
              Share Plan
            </Button>
            <Button variant="ghost" size="lg" className="gap-2">
              <Download className="w-5 h-5" />
              Download
            </Button>
          </motion.div>
        </motion.div>
      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="fixed bottom-6 right-6"
      >
        <Button
          variant="gradient"
          size="icon"
          className="w-14 h-14 rounded-full shadow-lg"
          onClick={() => navigate("/dashboard")}
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default PlanView;
