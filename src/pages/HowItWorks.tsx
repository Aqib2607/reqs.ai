import { Link } from "react-router-dom";
import { Sparkles, MessageSquare, Wand2, FileCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const steps = [
  { 
    step: "01", 
    icon: MessageSquare,
    title: "Describe Your Idea", 
    description: "Enter your project concept in natural language. Be as detailed or brief as you like - our AI understands both.",
    details: ["No technical jargon required", "Supports multiple languages", "Voice input coming soon"]
  },
  { 
    step: "02", 
    icon: Sparkles,
    title: "Answer Quick Questions", 
    description: "AI asks clarifying MCQs to understand scope, constraints, and priorities for your project.",
    details: ["Smart contextual questions", "Skip questions you're unsure about", "Takes less than 2 minutes"]
  },
  { 
    step: "03", 
    icon: Wand2,
    title: "AI Generates Documents", 
    description: "Get a complete PRD, design doc, and tech stack recommendation in seconds using advanced AI.",
    details: ["Multi-provider AI orchestration", "5-pass iterative refinement", "Real-time generation"]
  },
  { 
    step: "04", 
    icon: FileCheck,
    title: "Review & Refine", 
    description: "Edit with AI assistance, approve sections, and regenerate any part you want to improve.",
    details: ["Section-by-section approval", "AI-powered improvements", "Version history tracking"]
  },
  { 
    step: "05", 
    icon: Download,
    title: "Export & Share", 
    description: "Download in your preferred format and share with your team or stakeholders.",
    details: ["Markdown, PDF formats", "Academic-style PDFs", "Direct team sharing"]
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar activePage="how-it-works" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            From Idea to Docs in <span className="gradient-text">5 Simple Steps</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered workflow makes creating professional documentation effortless.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((s, i) => (
            <div key={s.step} className="glass-card p-8 hover-lift">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center">
                    <s.icon className="w-8 h-8 text-secondary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-black text-secondary/60">{s.step}</span>
                    <h3 className="text-2xl font-bold">{s.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{s.description}</p>
                  <ul className="space-y-2">
                    {s.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 border-secondary/30">
          <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
          <p className="text-muted-foreground mb-8">
            Experience the power of AI-driven documentation yourself.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-background font-bold">
              Try It Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
