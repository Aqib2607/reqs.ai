import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { planService } from "@/services/planService";
import { prdService } from "@/services/prdService";

// Helper to parse the Markdown/Text plan into sections (rough heuristic if structure is consistent)
// Or we just display the raw text if parsing is too complex for now.
// For now, let's treat the whole plan as one section or try to split by headers.
const parsePlanContent = (content: string) => {
  if (!content) return [];

  // Simple split by markdown headers (## Title)
  const sections = content.split(/^#+\s+(.+)$/gm);

  // If no headers found, return as one block
  if (sections.length === 1) {
    return [{ title: "Project Plan", content: sections[0] }];
  }

  const result = [];
  // Sections array will look like: ["", "Title 1", "Content 1", "Title 2", "Content 2", ...]
  for (let i = 1; i < sections.length; i += 2) {
    result.push({
      title: sections[i].trim(),
      content: sections[i + 1].trim(),
    });
  }
  return result;
};

interface Plan {
  _id: string;
  ideaText: string;
  generatedPlan: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

interface Section {
  title: string;
  content: string;
}

const PlanView = () => {
  const { id } = useParams<{ id: string }>();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await planService.getPlan(id);
        if (response.status === 'success') {
          setPlan(response.data);
          if (response.data.generatedPlan) {
            setSections(parsePlanContent(response.data.generatedPlan));
            // Expand all by default if reasonable count
            setExpandedSections([0, 1, 2, 3, 4, 5].slice(0, 6));
          }
        }
      } catch (error) {
        console.error("Failed to fetch plan", error);
        toast({
          title: "Error",
          description: "Could not load plan details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, toast]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleCopy = () => {
    if (!plan?.generatedPlan) return;
    navigator.clipboard.writeText(plan.generatedPlan);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Plan content has been copied.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGeneratePRD = async () => {
    if (!plan || !plan._id) return;

    toast({
      title: "Generating PRD...",
      description: "This may take a few moments.",
    });

    try {
      const result = await prdService.generatePRD(plan._id);
      if (result.status === 'success') {
        toast({
          title: "PRD Generated!",
          description: "Redirecting to view PRD.",
        });
        // The result.data.prd contains the new PRD
        navigate(`/prd/${result.data.prd._id}`);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error("PRD generation failed", error);
      toast({
        title: "Generation failed",
        description: error.response?.data?.message || "Could not generate PRD.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Plan not found</h1>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const displayTitle = plan.ideaText && plan.ideaText.length > 50
    ? plan.ideaText.substring(0, 50) + "..."
    : (plan.ideaText || "Project Plan");

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
            {plan.status === 'completed' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
              >
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Plan Generated Successfully</span>
              </motion.div>
            )}
            <h1 className="text-3xl font-bold mb-2">{displayTitle}</h1>
            <p className="text-muted-foreground">Project Plan Overview</p>
          </div>

          {/* Plan Sections */}
          <div className="space-y-4">
            {sections.length > 0 ? (
              sections.map((section, index) => (
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
              ))
            ) : (
              <div className="text-center p-8 bg-muted rounded-xl">
                <p>No content generated for this plan yet.</p>
              </div>
            )}
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
