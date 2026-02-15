import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  RefreshCw,
  Sparkles,
  Expand,
  BarChart3,
  ChevronRight,
  Check,
  Edit3,
  Wand2,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { VersionHistoryModal } from "@/components/VersionHistoryModal";
import { useToast } from "@/hooks/use-toast";

const documentSections: Record<string, { id: string; title: string; content: string }[]> = {
  prd: [
    { id: "overview", title: "Product Overview", content: "## Product Overview\n\nThis product is a modern project management platform designed for distributed teams. It combines AI-powered task prioritization with intuitive collaboration tools.\n\n### Vision\nTo become the go-to platform for teams seeking intelligent project management that adapts to their workflow.\n\n### Mission\nSimplify project complexity through AI-driven insights and seamless team coordination." },
    { id: "objectives", title: "Objectives & Goals", content: "## Objectives & Goals\n\n### Primary Objectives\n- Reduce project planning time by 60%\n- Improve task completion rates by 40%\n- Enable real-time collaboration across time zones\n\n### Key Results\n1. Achieve 10,000 active users within 6 months\n2. Maintain 95% uptime SLA\n3. Average task completion improvement of 35%" },
    { id: "user-stories", title: "User Stories", content: "## User Stories\n\n### Epic: Task Management\n- As a project manager, I want to create tasks with AI-suggested priorities so that I can focus on what matters most.\n- As a team member, I want to see my tasks sorted by urgency so that I can manage my time effectively.\n\n### Epic: Collaboration\n- As a team lead, I want to assign tasks to team members with context so they understand the requirements.\n- As a stakeholder, I want to view project progress dashboards so I can track delivery." },
    { id: "requirements", title: "Functional Requirements", content: "## Functional Requirements\n\n### FR-1: User Authentication\n- Support email/password and OAuth (Google, GitHub)\n- MFA support for enterprise accounts\n- Session management with configurable timeouts\n\n### FR-2: Task Management\n- CRUD operations for tasks, subtasks, and epics\n- Drag-and-drop Kanban board\n- AI-powered priority scoring\n- Dependency tracking between tasks" },
    { id: "non-functional", title: "Non-Functional Requirements", content: "## Non-Functional Requirements\n\n### Performance\n- Page load time < 2 seconds\n- API response time < 200ms (p95)\n- Support 10,000 concurrent users\n\n### Security\n- SOC 2 Type II compliance\n- End-to-end encryption for sensitive data\n- Regular penetration testing" },
    { id: "timeline", title: "Timeline & Milestones", content: "## Timeline & Milestones\n\n| Phase | Duration | Deliverables |\n|-------|----------|-------------|\n| Phase 1 - MVP | 8 weeks | Core task management, auth, basic AI |\n| Phase 2 - Beta | 6 weeks | Collaboration, dashboards, integrations |\n| Phase 3 - Launch | 4 weeks | Polish, performance, marketing site |" },
  ],
  design: [
    { id: "overview", title: "Design Overview", content: "## Design Overview\n\nThe design system follows a modern, clean aesthetic with emphasis on readability and efficient information density." },
    { id: "components", title: "Component Library", content: "## Component Library\n\nA comprehensive set of reusable UI components built on atomic design principles." },
    { id: "wireframes", title: "Wireframes", content: "## Wireframes\n\nKey screens and user flows documented with annotated wireframes." },
  ],
  "tech-stack": [
    { id: "overview", title: "Stack Overview", content: "## Technology Stack\n\nRecommended stack based on project requirements, team expertise, and scalability needs." },
    { id: "frontend", title: "Frontend", content: "## Frontend\n\n- **Framework:** React 18 with TypeScript\n- **Styling:** Tailwind CSS\n- **State:** Zustand\n- **Routing:** React Router v6" },
    { id: "backend", title: "Backend", content: "## Backend\n\n- **Runtime:** Node.js with Express\n- **Database:** PostgreSQL\n- **Cache:** Redis\n- **Auth:** Supabase Auth" },
  ],
};

interface AiAction {
  icon: typeof RefreshCw;
  label: string;
  description: string;
  id: string;
}

const aiActions: AiAction[] = [
  { id: "regenerate", icon: RefreshCw, label: "Regenerate Section", description: "Rewrite this section from scratch" },
  { id: "improve", icon: Sparkles, label: "Improve Section", description: "Enhance clarity and detail" },
  { id: "expand", icon: Expand, label: "Expand Technical Depth", description: "Add more technical specifics" },
  { id: "competitive", icon: BarChart3, label: "Add Competitive Analysis", description: "Compare with market solutions" },
  { id: "regenerate-all", icon: Wand2, label: "Regenerate Document", description: "Recreate the entire document" },
];

// Mock AI responses for different actions
const mockAiResponses: Record<string, string> = {
  regenerate: "## [Section Regenerated]\n\nThis section has been completely rewritten by AI with improved structure, clearer language, and more actionable requirements. The content now follows industry best practices for technical documentation.\n\n### Key Changes\n- Restructured for better readability\n- Added quantifiable metrics\n- Included edge cases and error scenarios",
  improve: "### AI Improvements Applied\n\n✅ Enhanced clarity of technical terms\n✅ Added concrete examples for each requirement\n✅ Improved formatting consistency\n✅ Added cross-references between related sections\n✅ Standardized terminology throughout",
  expand: "### Expanded Technical Details\n\n#### Architecture Considerations\n- Microservices vs monolith trade-offs analyzed\n- Event-driven architecture recommended for real-time features\n- CDN strategy for static assets\n\n#### Infrastructure\n- Auto-scaling policies defined\n- Database sharding strategy for scale\n- Monitoring and alerting pipeline\n- Disaster recovery procedures",
  competitive: "### Competitive Analysis\n\n| Feature | Our Product | Competitor A | Competitor B |\n|---------|------------|-------------|-------------|\n| AI-Powered | ✅ | ❌ | Partial |\n| Real-time Collab | ✅ | ✅ | ❌ |\n| Custom Workflows | ✅ | Limited | ✅ |\n| Pricing | Competitive | Premium | Freemium |",
};

export default function DocumentEditor() {
  const { type } = useParams<{ type: string }>();
  const { activeSection, setActiveSection, apiKeys } = useAppStore();
  const [approvedSections, setApprovedSections] = useState<Set<string>>(new Set());
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeAiAction, setActiveAiAction] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const { toast } = useToast();

  const docType = type || "prd";
  const sections = documentSections[docType] || documentSections.prd;
  const currentSection = sections.find((s) => s.id === activeSection) || sections[0];
  const content = editingContent ?? currentSection.content;

  const hasActiveApiKey = apiKeys.some((k) => k.active);

  const handleApprove = (id: string) => {
    setApprovedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAiAction = (actionId: string) => {
    if (!hasActiveApiKey) {
      toast({
        title: "No Active API Key",
        description: "Please add and activate an API key in API Configuration first.",
        variant: "destructive",
      });
      return;
    }

    setActiveAiAction(actionId);
    setAiResult(null);

    // Simulate AI processing
    setTimeout(() => {
      setAiResult(mockAiResponses[actionId] || mockAiResponses.improve);
      setActiveAiAction(null);
      toast({ title: "AI Action Complete", description: "The AI has finished processing your request." });
    }, 2500);
  };

  const applyAiResult = () => {
    if (aiResult) {
      setEditingContent((prev) => (prev ?? currentSection.content) + "\n\n" + aiResult);
      setAiResult(null);
      toast({ title: "Applied", description: "AI result has been appended to the document." });
    }
  };

  return (
    <>
      <div className="flex gap-0 -m-6 h-[calc(100vh-3.5rem)]">
        {/* Section Navigator */}
        <div className="w-64 border-r border-border bg-card/30 p-4 overflow-y-auto shrink-0">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {docType === "prd" ? "PRD" : docType === "design" ? "Design Doc" : "Tech Stack"} Sections
          </h3>
          <div className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id); setEditingContent(null); setAiResult(null); }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-all",
                  activeSection === s.id || (!activeSection && s.id === sections[0].id)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {approvedSections.has(s.id) && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                <span className="truncate">{s.title}</span>
                <ChevronRight className="w-3 h-3 ml-auto shrink-0 opacity-50" />
              </button>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">
              Progress: {approvedSections.size}/{sections.length} approved
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${(approvedSections.size / sections.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{currentSection.title}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowVersionHistory(true)}>
                  <Clock className="w-3.5 h-3.5 mr-1.5" /> History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingContent(editingContent !== null ? null : currentSection.content)}
                >
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                  {editingContent !== null ? "Preview" : "Edit"}
                </Button>
                <Button
                  size="sm"
                  variant={approvedSections.has(currentSection.id) ? "outline" : "default"}
                  className={approvedSections.has(currentSection.id) ? "border-accent/50 text-accent" : "gradient-primary text-primary-foreground border-0"}
                  onClick={() => handleApprove(currentSection.id)}
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  {approvedSections.has(currentSection.id) ? "Approved" : "Approve"}
                </Button>
              </div>
            </div>

            {editingContent !== null ? (
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full min-h-[500px] bg-muted/30 border border-border rounded-lg p-6 font-mono text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <div className="prose prose-invert prose-sm max-w-none">
                {content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-bold mt-6 mb-3 text-foreground">{line.replace("## ", "")}</h2>;
                  if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold mt-4 mb-2 text-foreground">{line.replace("### ", "")}</h3>;
                  if (line.startsWith("#### ")) return <h4 key={i} className="text-sm font-semibold mt-3 mb-1 text-foreground">{line.replace("#### ", "")}</h4>;
                  if (line.startsWith("- ")) return <li key={i} className="text-sm text-muted-foreground ml-4 mb-1">{line.replace("- ", "")}</li>;
                  if (line.startsWith("| ")) return <p key={i} className="text-sm text-muted-foreground font-mono">{line}</p>;
                  if (line.startsWith("✅") || line.startsWith("❌")) return <p key={i} className="text-sm text-muted-foreground mb-1">{line}</p>;
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i} className="text-sm text-muted-foreground mb-2 leading-relaxed">{line}</p>;
                })}
              </div>
            )}

            {/* AI Result Panel */}
            {(activeAiAction || aiResult) && (
              <div className="mt-6 glass-card p-5 ai-glow animate-fade-in">
                {activeAiAction ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                    <div>
                      <div className="text-sm font-medium text-foreground">AI is processing...</div>
                      <div className="text-xs text-muted-foreground">Using your configured API key to generate content</div>
                    </div>
                  </div>
                ) : aiResult ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-sm font-semibold text-accent">AI Result</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setAiResult(null)}>
                          Dismiss
                        </Button>
                        <Button size="sm" className="h-7 text-xs gradient-primary text-primary-foreground border-0" onClick={applyAiResult}>
                          Apply to Document
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-t border-border/50 pt-3">
                      {aiResult}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* AI Action Panel */}
        <div className="w-72 border-l border-border bg-card/30 p-4 overflow-y-auto shrink-0">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">AI Actions</h3>

          {!hasActiveApiKey && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div className="text-xs text-destructive">
                No active API key. <a href="/api-config" className="underline font-medium">Configure one</a> to use AI actions.
              </div>
            </div>
          )}

          <div className="space-y-2">
            {aiActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAiAction(action.id)}
                disabled={!!activeAiAction}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left group",
                  activeAiAction === action.id
                    ? "border-accent bg-accent/5"
                    : "border-border bg-secondary/20 hover:bg-secondary/40 hover:border-primary/30",
                  activeAiAction && activeAiAction !== action.id && "opacity-50"
                )}
              >
                {activeAiAction === action.id ? (
                  <Loader2 className="w-4 h-4 text-accent mt-0.5 shrink-0 animate-spin" />
                ) : (
                  <action.icon className="w-4 h-4 text-accent mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                )}
                <div>
                  <div className="text-sm font-medium text-foreground">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Suggestions</h3>
            <div className="glass-card p-3 ai-glow">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-medium text-accent">Suggestion</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Consider adding acceptance criteria to each user story for clearer validation of requirements.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Info</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Active API</span>
                <span className={hasActiveApiKey ? "text-accent" : "text-destructive"}>
                  {hasActiveApiKey ? apiKeys.find(k => k.active)?.name : "None"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sections Approved</span>
                <span>{approvedSections.size}/{sections.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VersionHistoryModal isOpen={showVersionHistory} onClose={() => setShowVersionHistory(false)} />
    </>
  );
}
