import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const mcqQuestions = [
  {
    id: "type",
    question: "What type of product are you building?",
    options: ["Web Application", "Mobile App", "Desktop App", "API / Backend Service"],
  },
  {
    id: "audience",
    question: "Who is your target audience?",
    options: ["B2B Enterprise", "B2C Consumers", "Internal Tool", "Developer Platform"],
  },
  {
    id: "scale",
    question: "What scale do you anticipate?",
    options: ["MVP / Prototype", "Small (< 1K users)", "Medium (1K-100K)", "Large (100K+)"],
  },
  {
    id: "priority",
    question: "What's your top priority?",
    options: ["Speed to Market", "Scalability", "Security & Compliance", "User Experience"],
  },
];

const steps = ["Describe Idea", "Clarify Scope", "Review", "Generate"];

export default function NewProject() {
  const navigate = useNavigate();
  const { 
    wizardStep, setWizardStep, wizardIdea, setWizardIdea, 
    wizardAnswers, setWizardAnswer, resetWizard, createProject 
  } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mcqIndex, setMcqIndex] = useState(0);
  const [projectName, setProjectName] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Build project description from wizard data
      const description = `${wizardIdea}\n\nType: ${wizardAnswers.type}\nAudience: ${wizardAnswers.audience}\nScale: ${wizardAnswers.scale}\nPriority: ${wizardAnswers.priority}`;
      
      // Create project through API
      const project = await createProject(
        projectName || "New Project",
        description
      );
      
      if (project) {
        // Navigate to PRD editor for this project
        navigate(`/editor/prd?project=${project.id}`);
      }
      
      resetWizard();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = ((wizardStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Steps */}
      <div className="mb-8 md:mb-10">
        <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  i < wizardStep ? "bg-primary text-primary-foreground" :
                  i === wizardStep ? "bg-primary/20 text-primary border-2 border-primary" :
                  "bg-secondary text-muted-foreground"
                )}
              >
                {i < wizardStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn("text-sm hidden sm:block", i === wizardStep ? "text-foreground font-medium" : "text-muted-foreground")}>
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className={cn("w-12 lg:w-20 h-0.5 mx-2", i < wizardStep ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
        <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Step 0: Idea Input */}
      {wizardStep === 0 && (
        <div className="glass-card p-4 md:p-8 animate-fade-in">
          <h2 className="text-lg md:text-xl font-bold mb-2">What are you building?</h2>
          <p className="text-muted-foreground text-sm mb-6">Describe your project idea in a few sentences. Be as detailed as you like.</p>
          <textarea
            value={wizardIdea}
            onChange={(e) => setWizardIdea(e.target.value)}
            placeholder="e.g., A project management tool with AI-powered task prioritization, team collaboration features, and real-time notifications..."
            className="w-full h-40 bg-muted/50 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setWizardStep(1)}
              disabled={!wizardIdea.trim()}
              className="gradient-primary text-primary-foreground border-0"
            >
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: MCQ */}
      {wizardStep === 1 && (
        <div className="glass-card p-4 md:p-8 animate-fade-in">
          <div className="text-xs text-muted-foreground mb-2">
            Question {mcqIndex + 1} of {mcqQuestions.length}
          </div>
          <h2 className="text-lg md:text-xl font-bold mb-6">{mcqQuestions[mcqIndex].question}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mcqQuestions[mcqIndex].options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setWizardAnswer(mcqQuestions[mcqIndex].id, opt);
                  if (mcqIndex < mcqQuestions.length - 1) {
                    setMcqIndex(mcqIndex + 1);
                  } else {
                    setWizardStep(2);
                  }
                }}
                className={cn(
                  "p-4 rounded-lg border text-left text-sm font-medium transition-all hover-lift",
                  wizardAnswers[mcqQuestions[mcqIndex].id] === opt
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 text-foreground hover:border-primary/50"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => mcqIndex > 0 ? setMcqIndex(mcqIndex - 1) : setWizardStep(0)}
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {wizardStep === 2 && (
        <div className="glass-card p-4 md:p-8 animate-fade-in">
          <h2 className="text-lg md:text-xl font-bold mb-6">Review Your Project</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="text-xs text-muted-foreground mb-2">Project Name (Optional)</div>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Task Manager Pro"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50"
              />
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="text-xs text-muted-foreground mb-1">Project Idea</div>
              <p className="text-sm text-foreground">{wizardIdea}</p>
            </div>
            {Object.entries(wizardAnswers).map(([key, value]) => {
              const q = mcqQuestions.find((q) => q.id === key);
              return (
                <div key={key} className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">{q?.question}</div>
                  <p className="text-sm text-foreground">{value}</p>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setWizardStep(1)}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button 
              onClick={() => { setWizardStep(3); handleGenerate(); }} 
              className="bg-secondary hover:bg-secondary/90 text-background font-bold border-0"
            >
              <Sparkles className="mr-2 w-4 h-4" /> Generate Documents
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Generating */}
      {wizardStep === 3 && (
        <div className="glass-card p-8 md:p-12 text-center animate-fade-in ai-glow">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
          </div>
          <h2 className="text-lg md:text-xl font-bold mb-2">Generating Your Documents</h2>
          <p className="text-muted-foreground text-sm mb-8">AI is analyzing your requirements and creating comprehensive documentation...</p>
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">This usually takes 15-30 seconds</span>
          </div>
        </div>
      )}
    </div>
  );
}
