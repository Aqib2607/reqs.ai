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
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop" 
            alt="Technology background" 
            className="w-full h-full object-cover"
          />
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

      {/* Visual Showcase Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=800&fit=crop" 
                alt="Tech workspace" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Modern Workspace</h3>
                  <p className="text-sm text-muted-foreground">Built for today's development teams</p>
                </div>
              </div>
            </div>
            <div className="aspect-square relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop" 
                alt="Coding" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-square relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=400&h=400&fit=crop" 
                alt="Laptop workspace" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-square relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop" 
                alt="Team meeting" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-square relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=400&fit=crop" 
                alt="UI Design" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="col-span-2 relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop" 
                alt="Startup culture" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent flex items-center p-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Ship Faster</h3>
                  <p className="text-sm text-muted-foreground">Accelerate your development cycle</p>
                </div>
              </div>
            </div>
            <div className="aspect-square relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=400&fit=crop" 
                alt="Developer" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="aspect-square relative rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop" 
                alt="Brainstorming" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
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
          
          {/* Process Images Showcase */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=400&fit=crop" 
                alt="Writing and brainstorming" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop" 
                alt="Business planning" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop" 
                alt="AI and technology" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=400&h=400&fit=crop" 
                alt="Document editing" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
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
      <section className="py-24 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to go from idea to implementation</p>
          </div>
          
          {/* Feature Showcase Images */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <div className="relative aspect-video rounded-lg overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop" 
                alt="AI technology" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                <span className="text-sm font-semibold">AI-Powered</span>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=400&fit=crop" 
                alt="Code development" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                <span className="text-sm font-semibold">Code Ready</span>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop" 
                alt="Analytics dashboard" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                <span className="text-sm font-semibold">Analytics</span>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                alt="Team collaboration" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                <span className="text-sm font-semibold">Collaboration</span>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop" 
                alt="Design systems" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                <span className="text-sm font-semibold">Design Systems</span>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop" 
                alt="Project management" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end p-4">
                <span className="text-sm font-semibold">Project Management</span>
              </div>
            </div>
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

      {/* Success & Innovation Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Innovation</h2>
            <p className="text-muted-foreground text-lg">Trusted by forward-thinking teams worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=600&h=450&fit=crop" 
                alt="Startup office" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Startups</h3>
                  <p className="text-sm text-muted-foreground">Move fast with confidence</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=600&h=450&fit=crop" 
                alt="Enterprise office" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Enterprise</h3>
                  <p className="text-sm text-muted-foreground">Scale with enterprise tools</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=450&fit=crop" 
                alt="Remote team" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-bold mb-1">Remote Teams</h3>
                  <p className="text-sm text-muted-foreground">Collaborate from anywhere</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop" 
                alt="Product design" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent flex items-center p-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Product Excellence</h3>
                  <p className="text-muted-foreground">Design better products with AI-powered documentation</p>
                </div>
              </div>
            </div>
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&h=450&fit=crop" 
                alt="Team collaboration" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent flex items-center p-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Team Synergy</h3>
                  <p className="text-muted-foreground">Align your team with clear, comprehensive documentation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 border-secondary/30 yellow-glow relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop" 
              alt="Team collaboration" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
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
