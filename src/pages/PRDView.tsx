import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowLeft,
  Download,
  Copy,
  Check,
  FileText,
  Code,
  Users,
  Calendar,
  Layers,
  Target,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper to parse PRD content into sections
const parsePRDContent = (content: string) => {
  if (!content) return [];

  const sections: { id: string; icon: typeof FileText; title: string; content: string }[] = [];
  const lines = content.split('\n');
  let currentSection: { id: string; icon: typeof FileText; title: string; content: string } | null = null;

  lines.forEach(line => {
    if (line.trim().startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const title = line.replace('## ', '').trim();
      let icon = FileText;
      if (title.toLowerCase().includes('overview') || title.toLowerCase().includes('vision')) icon = Target;
      else if (title.toLowerCase().includes('user') || title.toLowerCase().includes('persona')) icon = Users;
      else if (title.toLowerCase().includes('feature') || title.toLowerCase().includes('requirement')) icon = Layers;
      else if (title.toLowerCase().includes('tech') || title.toLowerCase().includes('architecture')) icon = Code;
      else if (title.toLowerCase().includes('timeline') || title.toLowerCase().includes('roadmap')) icon = Calendar;

      currentSection = {
        id: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        icon: icon,
        title: title,
        content: ''
      };
    } else {
      if (currentSection) {
        currentSection.content += line + '\n';
      } else {
        if (line.trim()) {
          currentSection = {
            id: 'introduction',
            icon: FileText,
            title: 'Introduction',
            content: line + '\n'
          };
        }
      }
    }
  });
  if (currentSection) sections.push(currentSection);

  return sections;
};

interface PRD {
  _id: string;
  planId: string;
  title: string;
  content: string;
  version: string;
  createdAt: string;
}

const PRDView = () => {
  const { id } = useParams<{ id: string }>();
  const [prd, setPrd] = useState<PRD | null>(null);
  const [prdSections, setPrdSections] = useState<{ id: string; icon: typeof FileText; title: string; content: string }[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPRD = () => {
      if (!id) return;
      try {
        setLoading(true);
        const prds = JSON.parse(localStorage.getItem('prds') || '[]');
        const foundPRD = prds.find((p: PRD) => p._id === id);
        
        if (foundPRD) {
          setPrd(foundPRD);
          if (foundPRD.content) {
            const sections = parsePRDContent(foundPRD.content);
            setPrdSections(sections);
            if (sections.length > 0) setActiveSection(sections[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load PRD", error);
        toast({
          title: "Error",
          description: "Could not load PRD.",
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPRD();
  }, [id, toast]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = prdSections.map((s) => ({
        id: s.id,
        offset: document.getElementById(s.id)?.offsetTop || 0,
      }));

      if (sections.length === 0) return;

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offset) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prdSections]);

  const handleCopy = () => {
    if (!prd?.content) return;
    navigator.clipboard.writeText(prd.content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "PRD content has been copied in Markdown format.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = async (format: 'pdf' | 'markdown' | 'json') => {
    if (!prd) return;
    
    toast({ title: "Exporting...", description: "Preparing your download." });
    
    try {
      let content = prd.content;
      let mimeType = 'text/plain';
      let extension: string = format;
      
      if (format === 'json') {
        content = JSON.stringify(prd, null, 2);
        mimeType = 'application/json';
      } else if (format === 'markdown') {
        extension = 'md';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prd-${prd.title || 'export'}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast({ title: "Export Complete", description: `PRD exported as ${format.toUpperCase()}.` });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export PRD.",
        variant: 'destructive'
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!prd) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">PRD Not Found</h1>
        <Button onClick={() => navigate('/dashboard')}>Go Home</Button>
      </div>
    );
  }

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
                onClick={() => navigate(`/plan/${prd.planId}`)}
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
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy Markdown"}</span>
              </Button>
              <Button variant="gradient" size="sm" className="gap-2" onClick={() => handleExport('markdown')}>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 sticky top-16 h-[calc(100vh-4rem)] border-r border-border bg-card p-6 overflow-y-auto">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Contents</h3>
          <nav className="space-y-1">
            {prdSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.title}
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {/* Document Header */}
            <div className="mb-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
              >
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Product Requirements Document</span>
              </motion.div>
              <h1 className="text-4xl font-bold mb-2">{prd.title || "Untitled PRD"}</h1>
              <p className="text-muted-foreground">Version {prd.version || "1.0"} • Generated on {new Date(prd.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Document Sections */}
            <div className="space-y-16">
              {prdSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                      {section.content}
                    </div>
                  </motion.section>
                );
              })}
            </div>

            {/* Footer Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 p-8 rounded-2xl glass text-center"
            >
              <h3 className="text-xl font-bold mb-2">Ready to start building?</h3>
              <p className="text-muted-foreground mb-6">
                Export this PRD and share it with your team.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero" className="gap-2" onClick={() => handleExport('markdown' as const)}>
                  <Download className="w-4 h-4" />
                  Export as Markdown
                </Button>
                <Button variant="glass" className="gap-2" onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                  Copy Markdown
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
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

export default PRDView;
