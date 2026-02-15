import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, FileText, Zap, Shield, Code2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Sparkles, title: "AI-Powered Generation", description: "Generate comprehensive PRDs and design documents from a simple idea in minutes." },
  { icon: FileText, title: "Professional Documents", description: "Industry-standard PRDs, design docs, and tech stack recommendations." },
  { icon: Zap, title: "Instant Iterations", description: "Regenerate, expand, or refine any section with AI assistance." },
  { icon: Shield, title: "Enterprise Ready", description: "Secure API key management and team collaboration features." },
  { icon: Code2, title: "Tech Stack Analysis", description: "AI-recommended technology stacks tailored to your project needs." },
  { icon: BarChart3, title: "Export Anywhere", description: "Download as Markdown, clean PDF, or academic-format PDF." },
];

const steps = [
  { step: "01", title: "Describe Your Idea", description: "Enter your project concept in natural language." },
  { step: "02", title: "Answer Quick Questions", description: "AI asks clarifying MCQs to understand scope and constraints." },
  { step: "03", title: "AI Generates Documents", description: "Get a complete PRD, design doc, and tech stack in seconds." },
  { step: "04", title: "Refine & Export", description: "Edit with AI assistance and export in your preferred format." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center yellow-glow">
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
            <span className="font-bold text-lg">
              Reqs<span className="text-secondary">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,hsl(var(--ai-glow)/0.08),transparent_70%)]" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-sm font-semibold mb-8 animate-fade-in yellow-glow">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Requirements Engineering
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            From Idea to{" "}
            <span className="gradient-text">Production-Ready</span>{" "}
            Docs
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Generate comprehensive PRDs, design documents, and tech stack recommendations from a single project idea. Powered by AI.
          </p>
          
          <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/dashboard">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-background font-bold border-0 px-8 h-12 text-base yellow-glow">
                Start Building <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base border-secondary/50 text-secondary hover:bg-secondary/10">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Visual Showcase */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-primary/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Documentation</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Transform your ideas into comprehensive technical documentation with the power of advanced AI models.
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-secondary" /> Multi-provider AI orchestration</li>
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-secondary" /> 5-pass iterative refinement</li>
                <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-secondary" /> Real-time streaming responses</li>
              </ul>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" alt="AI Technology" className="rounded-xl shadow-2xl" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Four simple steps from concept to documentation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="glass-card p-6 hover-lift group" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl font-black text-secondary/60 mb-4 group-hover:text-secondary group-hover:yellow-glow transition-colors">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-border/50 relative overflow-hidden">
        <div className="absolute right-0 top-1/4 w-1/3 h-1/2 opacity-5">
          <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to go from idea to implementation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="glass-card p-6 hover-lift group">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 border border-secondary/40 flex items-center justify-center mb-4 group-hover:yellow-glow transition-all">
                  <f.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Showcase */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative order-2 md:order-1">
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80" alt="Development" className="rounded-xl shadow-2xl" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tl from-secondary/20 to-transparent" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Tech Stack Recommendations</h2>
              <p className="text-muted-foreground text-lg mb-6">
                Get AI-powered technology stack suggestions tailored to your project requirements, team size, and constraints.
              </p>
              <div className="flex flex-wrap gap-2">
                {['React', 'Laravel', 'TypeScript', 'MySQL', 'Tailwind'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-sm">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-3xl mx-auto text-center glass-card p-12 border-secondary/30 yellow-glow relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start generating professional project documentation in minutes.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-background font-bold border-0 px-10 h-12 text-base yellow-glow">
              Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 Reqs.ai. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
