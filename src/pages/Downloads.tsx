import { FileText, FileDown, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const downloadOptions = [
  {
    icon: FileText,
    title: "Markdown",
    description: "Raw markdown file, perfect for GitHub repos and documentation platforms.",
    format: ".md",
    color: "text-primary",
  },
  {
    icon: FileDown,
    title: "Clean PDF",
    description: "Professionally formatted PDF with clean typography and branding.",
    format: ".pdf",
    color: "text-accent",
  },
  {
    icon: GraduationCap,
    title: "Academic PDF",
    description: "IEEE/ACM formatted document suitable for academic submissions.",
    format: ".pdf",
    color: "text-amber-400",
  },
];

export default function Downloads() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Downloads</h1>
        <p className="text-muted-foreground text-sm mt-1">Export your documents in various formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {downloadOptions.map((opt) => (
          <div key={opt.title} className="glass-card p-6 hover-lift flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-4">
              <opt.icon className={`w-6 h-6 ${opt.color}`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{opt.title}</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">{opt.description}</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-between" size="sm">
                <span>PRD</span>
                <span className="text-xs text-muted-foreground">{opt.format}</span>
              </Button>
              <Button variant="outline" className="w-full justify-between" size="sm">
                <span>Design Document</span>
                <span className="text-xs text-muted-foreground">{opt.format}</span>
              </Button>
              <Button variant="outline" className="w-full justify-between" size="sm">
                <span>Tech Stack</span>
                <span className="text-xs text-muted-foreground">{opt.format}</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
