import { useState } from "react";
import { X, Clock, RotateCcw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VersionEntry {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  changes: string;
  type: "manual" | "ai" | "auto";
}

const mockVersions: VersionEntry[] = [
  { id: "7", version: "v1.7", timestamp: "2026-02-15 14:32", author: "You", changes: "Updated functional requirements section", type: "manual" },
  { id: "6", version: "v1.6", timestamp: "2026-02-15 13:10", author: "AI", changes: "Expanded technical depth for non-functional requirements", type: "ai" },
  { id: "5", version: "v1.5", timestamp: "2026-02-15 11:45", author: "You", changes: "Added acceptance criteria to user stories", type: "manual" },
  { id: "4", version: "v1.4", timestamp: "2026-02-14 16:20", author: "AI", changes: "Regenerated objectives section with KPIs", type: "ai" },
  { id: "3", version: "v1.3", timestamp: "2026-02-14 14:05", author: "You", changes: "Edited product overview vision statement", type: "manual" },
  { id: "2", version: "v1.2", timestamp: "2026-02-14 10:30", author: "AI", changes: "Added competitive analysis section", type: "ai" },
  { id: "1", version: "v1.1", timestamp: "2026-02-13 09:00", author: "AI", changes: "Initial document generation", type: "ai" },
];

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VersionHistoryModal({ isOpen, onClose }: VersionHistoryModalProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  if (!isOpen) return null;

  const typeConfig = {
    manual: { label: "Manual Edit", className: "bg-primary/10 text-primary" },
    ai: { label: "AI Generated", className: "bg-accent/10 text-accent" },
    auto: { label: "Auto-save", className: "bg-muted text-muted-foreground" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Version History</h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {mockVersions.length} versions
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {mockVersions.map((v, i) => {
            const config = typeConfig[v.type];
            return (
              <div
                key={v.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer",
                  selectedVersion === v.id
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-border hover:bg-secondary/20"
                )}
                onClick={() => setSelectedVersion(v.id)}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center pt-1">
                  <div className={cn("w-3 h-3 rounded-full", v.type === "ai" ? "bg-accent" : "bg-primary")} />
                  {i < mockVersions.length - 1 && <div className="w-px h-8 bg-border mt-1" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{v.version}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", config.className)}>
                      {config.label}
                    </span>
                    {i === 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/20 text-accent">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{v.changes}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground/70">
                    <span>{v.author}</span>
                    <span>•</span>
                    <span>{v.timestamp}</span>
                  </div>
                </div>

                {selectedVersion === v.id && i > 0 && (
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Eye className="w-3 h-3 mr-1" /> Preview
                    </Button>
                    <Button size="sm" className="h-8 text-xs gradient-primary text-primary-foreground border-0">
                      <RotateCcw className="w-3 h-3 mr-1" /> Restore
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
