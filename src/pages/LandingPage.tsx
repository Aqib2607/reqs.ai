import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, FileText, Zap, Shield, Code2, BarChart3, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

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
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar activePage="home" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--secondary)/0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-sm font-medium mb-10 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-secondary-dark" />
            AI-Powered Requirements Engineering
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.05] mb-8 text-slate-900 animate-fade-in-up">
            Simply powerful <br />
            <span className="text-primary">Project Documentation</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 animate-fade-in-up font-medium" style={{ animationDelay: "0.1s" }}>
            Generate professional PRDs, architecture docs, and tech stack recommendations from a single idea. Built for creators and developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/register">
              <Button className="primary-button h-14 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                Start Building Free
              </Button>
            </Link>
            <Button variant="ghost" className="pill-button h-14 text-lg text-slate-600 hover:bg-slate-50">
              View Sample Docs
            </Button>
          </div>

          {/* Hero Visual - Soft Professional Mockup */}
          <div className="mt-24 w-full max-w-5xl mx-auto rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="bg-slate-50 border-b border-slate-200 h-10 flex items-center px-6 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>
            </div>
            <img
              src="/workflow-mockup.png"
              alt="Project Workflow Visualization"
              className="w-full aspect-[16/9] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature Showcase - High Whitespace */}
      <section className="section-container section-bg-alt">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">AI-Powered Documentation</h2>
              <p className="text-xl text-slate-500 mb-10 leading-relaxed">
                Transform your core ideas into comprehensive technical documentation with the power of advanced AI models. Reqs.ai orchestrates multiple passes to ensure depth and clarity.
              </p>
              <div className="space-y-6">
                {[
                  "Multi-provider AI orchestration",
                  "5-pass iterative refinement",
                  "Real-time streaming responses"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                      <Sparkles className="w-5 h-5 text-secondary-dark" />
                    </div>
                    <span className="text-lg font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="soft-card p-4">
              <img
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80"
                alt="AI Tech"
                className="rounded-[1.5rem] w-full shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Soft Cards Grid */}
      <section className="section-container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">How Reqs.ai works</h2>
            <p className="text-xl text-slate-500">From concept to production-ready docs in four simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="soft-card p-10 flex flex-col h-full hover:border-primary/30 group">
                <div className="text-5xl font-black text-primary/30 mb-8 transition-colors group-hover:text-primary/50">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powerful Features Grid */}
      <section className="section-container section-bg-alt">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">Powerful Features</h2>
            <p className="text-xl text-slate-500">Everything you need to go from idea to implementation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="soft-card p-10 hover:translate-y-[-4px] transition-all">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8">
                  <f.icon className="w-7 h-7 text-secondary-dark" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack - Alternative Section */}
      <section className="section-container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 soft-card p-4">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"
                alt="Development"
                className="rounded-[1.5rem] w-full shadow-sm"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900">Smart Tech Stacks</h2>
              <p className="text-xl text-slate-500 mb-10 leading-relaxed">
                Get AI-powered technology suggestions tailored to your project requirements, team size, and existing expertise. No more guesswork.
              </p>
              <div className="flex flex-wrap gap-3">
                {['React', 'Laravel', 'TypeScript', 'Tailwind', 'Python', 'AWS'].map(tech => (
                  <span key={tech} className="px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm">{tech}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto soft-card bg-foreground p-16 md:p-24 text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--secondary-dark)),transparent_30%)] opacity-20" />
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white relative z-10 leading-tight">Ready to build your next big idea?</h2>
          <p className="text-xl text-slate-400 mb-12 relative z-10 max-w-2xl mx-auto">
            Join thousands of creators using Reqs.ai to turn concepts into professional documentation.
          </p>
          <div className="relative z-10">
            <Link to="/register">
              <Button className="cyan-button h-16 px-12 text-xl font-black shadow-secondary/25 shadow-lg">
                Get Started Free <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Solid Dark */}
      <footer className="bg-foreground pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-8">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-4 h-4 text-foreground" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  Reqs<span className="text-secondary font-black">.ai</span>
                </span>
              </Link>
              <p className="text-slate-500 text-base leading-relaxed max-w-xs">
                AI-powered requirements engineering and technical documentation for modern teams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-slate-500">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-slate-600 text-sm">
            <span>© {new Date().getFullYear()} Reqs.ai. All rights reserved.</span>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Twitter</a>
              <a href="#" className="hover:text-white">LinkedIn</a>
              <a href="#" className="hover:text-white">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
