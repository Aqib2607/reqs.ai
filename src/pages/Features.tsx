import { Link } from "react-router-dom";
import { Sparkles, FileText, Zap, Shield, Code2, BarChart3, RefreshCw, Users, Lock, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const allFeatures = [
  { icon: Sparkles, title: "AI-Powered Generation", description: "Generate comprehensive PRDs and design documents from a simple idea in minutes using advanced AI models." },
  { icon: FileText, title: "Professional Documents", description: "Industry-standard PRDs, design docs, and tech stack recommendations that follow best practices." },
  { icon: Zap, title: "Instant Iterations", description: "Regenerate, expand, or refine any section with AI assistance in real-time." },
  { icon: Shield, title: "Enterprise Ready", description: "Secure API key management and team collaboration features built for scale." },
  { icon: Code2, title: "Tech Stack Analysis", description: "AI-recommended technology stacks tailored to your project needs and constraints." },
  { icon: BarChart3, title: "Export Anywhere", description: "Download as Markdown, clean PDF, or academic-format PDF with one click." },
  { icon: RefreshCw, title: "Version History", description: "Track all changes and revert to previous versions of your documents anytime." },
  { icon: Users, title: "Team Collaboration", description: "Work together with your team in real-time on project documentation." },
  { icon: Lock, title: "Encrypted Storage", description: "Your API keys and documents are encrypted and stored securely." },
  { icon: Cloud, title: "Cloud Sync", description: "Access your projects from anywhere with automatic cloud synchronization." },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar activePage="features" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Powerful Features for <span className="gradient-text">Modern Teams</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform ideas into production-ready documentation with AI.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map((f) => (
              <div key={f.title} className="glass-card p-6 hover-lift">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 border-secondary/30">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join teams already using Reqs.ai to streamline their documentation process.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
