import { FileText, FileDown, GraduationCap, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { jsPDF } from "jspdf";

const documents = [
  { key: "prd", label: "PRD", contentKey: "prdContent" as const },
  { key: "design", label: "Design Document", contentKey: "designContent" as const },
  { key: "techStack", label: "Tech Stack", contentKey: "techStackContent" as const },
];

function downloadBlob(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generatePdf(title: string, content: string, filename: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxW = pageW - margin * 2;
  const lineH = 5;

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, 20);

  // Body
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(content, maxW);
  let y = 30;

  for (const line of lines) {
    if (y + lineH > pageH - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineH;
  }

  doc.save(filename);
}

export default function Downloads() {
  const { currentProject, fetchProjects, projects } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentProject && projects.length === 0) fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const project = currentProject;

  const handleDownloadMd = (label: string, contentKey: "prdContent" | "designContent" | "techStackContent") => {
    const content = project?.documents[contentKey];
    if (!content) {
      toast({ title: "No content", description: `${label} has not been generated yet.`, variant: "destructive" });
      return;
    }
    const slug = label.toLowerCase().replace(/\s+/g, "-");
    downloadBlob(`${slug}.md`, content, "text/markdown");
  };

  const handleDownloadPdf = (label: string, contentKey: "prdContent" | "designContent" | "techStackContent", prefix = "") => {
    const content = project?.documents[contentKey];
    if (!content) {
      toast({ title: "No content", description: `${label} has not been generated yet.`, variant: "destructive" });
      return;
    }
    const slug = label.toLowerCase().replace(/\s+/g, "-");
    const filename = prefix ? `${prefix}-${slug}.pdf` : `${slug}.pdf`;
    generatePdf(label, content, filename);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Downloads</h1>
        <p className="text-muted-foreground text-sm mt-1">Export your documents in various formats</p>
      </div>

      {!project && (
        <div className="glass-card p-6 mb-6 flex items-center gap-3 text-amber-400 border border-amber-400/20 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">Open a project from the Dashboard first to download its documents.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Markdown */}
        <div className="glass-card p-6 hover-lift flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Markdown</h3>
          <p className="text-sm text-muted-foreground mb-6 flex-1">Raw markdown file, perfect for GitHub repos and documentation platforms.</p>
          <div className="space-y-2">
            {documents.map((doc) => (
              <Button
                key={doc.key}
                variant="outline"
                className="w-full justify-between"
                size="sm"
                onClick={() => handleDownloadMd(doc.label, doc.contentKey)}
                disabled={!project?.documents[doc.contentKey]}
              >
                <span className="flex items-center gap-2"><Download className="w-3.5 h-3.5" />{doc.label}</span>
                <span className="text-xs text-muted-foreground">.md</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Clean PDF */}
        <div className="glass-card p-6 hover-lift flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4">
            <FileDown className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Clean PDF</h3>
          <p className="text-sm text-muted-foreground mb-6 flex-1">Professionally formatted PDF with clean typography and branding.</p>
          <div className="space-y-2">
            {documents.map((doc) => (
              <Button
                key={doc.key}
                variant="outline"
                className="w-full justify-between"
                size="sm"
                onClick={() => handleDownloadPdf(doc.label, doc.contentKey)}
                disabled={!project?.documents[doc.contentKey]}
              >
                <span className="flex items-center gap-2"><Download className="w-3.5 h-3.5" />{doc.label}</span>
                <span className="text-xs text-muted-foreground">.pdf</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Academic PDF */}
        <div className="glass-card p-6 hover-lift flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Academic PDF</h3>
          <p className="text-sm text-muted-foreground mb-6 flex-1">IEEE/ACM formatted document suitable for academic submissions.</p>
          <div className="space-y-2">
            {documents.map((doc) => (
              <Button
                key={doc.key}
                variant="outline"
                className="w-full justify-between"
                size="sm"
                onClick={() => handleDownloadPdf(`[Academic] ${doc.label}`, doc.contentKey)}
                disabled={!project?.documents[doc.contentKey]}
              >
                <span className="flex items-center gap-2"><Download className="w-3.5 h-3.5" />{doc.label}</span>
                <span className="text-xs text-muted-foreground">.pdf</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
