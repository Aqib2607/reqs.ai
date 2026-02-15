import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Palette, Layers, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const statusConfig = {
  draft: { label: "Draft", icon: Clock, className: "text-muted-foreground bg-muted" },
  generating: { label: "Generating", icon: Loader2, className: "text-accent bg-accent/10" },
  completed: { label: "Completed", icon: CheckCircle2, className: "text-emerald-400 bg-emerald-400/10" },
};

export default function Dashboard() {
  const { projects, setCurrentProject, fetchProjects, isLoading, error } = useAppStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchProjects}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your AI-generated project documentation</p>
        </div>
        <Link to="/new-project">
          <Button className="bg-secondary hover:bg-secondary/90 text-background font-bold border-0">
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first project
          </p>
          <Link to="/new-project">
            <Button className="bg-secondary hover:bg-secondary/90 text-background font-bold">
              <Plus className="w-4 h-4 mr-2" /> Create Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            const status = statusConfig[project.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={project.id}
                className="glass-card p-5 hover-lift cursor-pointer group"
                onClick={() => setCurrentProject(project)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                    {project.name}
                  </h3>
                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", status.className)}>
                    <StatusIcon className={cn("w-3 h-3", project.status === "generating" && "animate-spin")} />
                    {status.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className={cn("flex items-center gap-1", project.documents.prd && "text-primary")}>
                    <FileText className="w-3.5 h-3.5" /> PRD
                  </div>
                  <div className={cn("flex items-center gap-1", project.documents.design && "text-primary")}>
                    <Palette className="w-3.5 h-3.5" /> Design
                  </div>
                  <div className={cn("flex items-center gap-1", project.documents.techStack && "text-primary")}>
                    <Layers className="w-3.5 h-3.5" /> Tech
                  </div>
                  <span className="ml-auto">{project.createdAt}</span>
                </div>
              </div>
            );
        })}

        {/* New Project Card */}
        <Link to="/new-project" className="glass-card p-5 hover-lift flex flex-col items-center justify-center min-h-[180px] border-dashed border-2 border-border hover:border-primary/50 transition-colors">
          <Plus className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground">Create New Project</span>
        </Link>
      </div>
      )}
    </div>
  );
}
