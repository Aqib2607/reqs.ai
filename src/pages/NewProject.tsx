import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";



const steps = ["Describe Idea", "Clarify Scope", "Review", "Generate"];

export default function NewProject() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    wizardStep, setWizardStep, wizardIdea, setWizardIdea,
    wizardQuestions, isGeneratingQuestions, fetchDynamicQuestions,
    wizardAnswers, setWizardAnswer, resetWizard, createProject,
    generateDocuments
  } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mcqIndex, setMcqIndex] = useState(0);
  const [projectName, setProjectName] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Build project description from wizard data
      let description = `${wizardIdea}\n\n`;
      wizardQuestions.forEach((q, i) => {
        description += `Q: ${q}\nA: ${wizardAnswers[i] || 'Not provided'}\n\n`;
      });

      // Create project through API
      const project = await createProject(
        projectName || "New Project",
        description
      );

      if (project) {
        // Generate actual documents via the deep-research backend and AI orchestrator
        const success = await generateDocuments(project.id, description, false);

        if (success) {
          // Navigate to PRD editor for this project
          navigate(`/editor/prd?project=${project.id}`);
          resetWizard();
        } else {
          toast({
            title: "Generation Failed",
            description: useAppStore.getState().error || "Failed to generate documents. Please ensure you have an active API key in API Configuration.",
            variant: "destructive"
          });
          setWizardStep(2); // Go back to review on failure
        }
      } else {
        setWizardStep(2);
      }
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
            id="wizard-idea"
            name="wizardIdea"
            value={wizardIdea}
            onChange={(e) => setWizardIdea(e.target.value)}
            placeholder="e.g., A project management tool with AI-powered task prioritization, team collaboration features, and real-time notifications..."
            className="w-full h-40 bg-muted/50 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          <div className="flex justify-end mt-6">
            <Button
              onClick={async () => {
                if (wizardQuestions.length === 0) {
                  const success = await fetchDynamicQuestions(wizardIdea);
                  if (success) setWizardStep(1);
                  else {
                    toast({
                      title: "Failed to generate questions",
                      description: useAppStore.getState().error || "Please ensure your API key lies in the active status.",
                      variant: "destructive"
                    });
                  }
                } else {
                  setWizardStep(1);
                }
              }}
              disabled={!wizardIdea.trim() || isGeneratingQuestions}
              className="gradient-primary text-primary-foreground border-0"
            >
              {isGeneratingQuestions ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Analyzing...</>
              ) : (
                <>Continue <ArrowRight className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Dynamic Questions */}
      {wizardStep === 1 && wizardQuestions.length > 0 && (
        <div className="glass-card p-4 md:p-8 animate-fade-in">
          <div className="text-xs text-muted-foreground mb-2">
            Question {mcqIndex + 1} of {wizardQuestions.length}
          </div>
          <h2 className="text-lg md:text-xl font-bold mb-6">{wizardQuestions[mcqIndex]}</h2>

          <textarea
            id={`wizard-answer-${mcqIndex}`}
            name={`wizardAnswer_${mcqIndex}`}
            value={wizardAnswers[mcqIndex] || ''}
            onChange={(e) => setWizardAnswer(String(mcqIndex), e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-32 bg-muted/50 border border-border rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => mcqIndex > 0 ? setMcqIndex(mcqIndex - 1) : setWizardStep(0)}
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button
              onClick={() => {
                if (mcqIndex < wizardQuestions.length - 1) {
                  setMcqIndex(mcqIndex + 1);
                } else {
                  setWizardStep(2);
                }
              }}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              {mcqIndex < wizardQuestions.length - 1 ? "Next" : "Review"} <ArrowRight className="ml-2 w-4 h-4" />
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
            {wizardQuestions.map((q, index) => {
              const value = wizardAnswers[index];
              if (!value) return null;

              return (
                <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">{q}</div>
                  <p className="text-sm text-foreground whitespace-pre-line">{value}</p>
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
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold border-0"
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
