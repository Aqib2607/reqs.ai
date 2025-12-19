import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowLeft,
  Download,
  Copy,
  Check,
  FileText,
  Code,
  Users,
  Calendar,
  Layers,
  Target,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const prdSections = [
  {
    id: "overview",
    icon: Target,
    title: "Product Overview",
    content: `## Vision Statement
Our e-commerce platform aims to revolutionize online shopping by providing an intuitive, AI-powered experience that anticipates customer needs and delivers personalized recommendations.

## Problem Statement
Current e-commerce solutions often lack personalization, leading to poor user experiences and low conversion rates. Customers struggle to find relevant products, and businesses lose potential sales.

## Solution
A modern, AI-driven e-commerce platform that learns from user behavior to provide personalized shopping experiences, streamlined checkout processes, and intelligent inventory management.`,
  },
  {
    id: "users",
    icon: Users,
    title: "User Personas",
    content: `## Primary Users

### Sarah - The Busy Professional
- Age: 32
- Tech-savvy online shopper
- Values convenience and fast delivery
- Expects personalized recommendations

### Mike - The Small Business Owner
- Age: 45
- Looking to expand online presence
- Needs easy-to-manage store interface
- Focused on cost-effectiveness

### Emma - The Retail Manager
- Age: 38
- Manages multiple product categories
- Needs robust analytics and reporting
- Values automation and efficiency`,
  },
  {
    id: "features",
    icon: Layers,
    title: "Feature Specifications",
    content: `## Core Features

### 1. Smart Product Discovery
- AI-powered search with natural language processing
- Visual search using image recognition
- Personalized product recommendations
- Advanced filtering and sorting options

### 2. Seamless Checkout
- One-click purchasing for returning customers
- Multiple payment gateway integrations
- Address auto-completion
- Order tracking and notifications

### 3. User Account Management
- Social login integration
- Wishlist and favorites
- Order history and reordering
- Subscription management

### 4. Admin Dashboard
- Real-time analytics and reporting
- Inventory management
- Order processing workflow
- Customer support tools`,
  },
  {
    id: "technical",
    icon: Code,
    title: "Technical Requirements",
    content: `## Architecture Overview

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query + Zustand
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful with GraphQL for complex queries

### Database
- **Primary**: PostgreSQL 15
- **Caching**: Redis for session and query caching
- **Search**: Elasticsearch for product search

### Infrastructure
- **Cloud Provider**: AWS
- **CDN**: CloudFront
- **Container Orchestration**: ECS with Fargate
- **CI/CD**: GitHub Actions

### Security
- JWT-based authentication
- OAuth 2.0 for social login
- PCI DSS compliance for payments
- Regular security audits`,
  },
  {
    id: "timeline",
    icon: Calendar,
    title: "Development Timeline",
    content: `## Project Phases

### Phase 1: Foundation (Weeks 1-4)
- [ ] Project setup and infrastructure
- [ ] Authentication system
- [ ] Database schema design
- [ ] CI/CD pipeline

### Phase 2: Core Features (Weeks 5-8)
- [ ] Product catalog management
- [ ] Search and filtering
- [ ] User account features
- [ ] Shopping cart functionality

### Phase 3: Checkout & Payments (Weeks 9-12)
- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Email notifications
- [ ] Shipping integration

### Phase 4: Admin & Analytics (Weeks 13-16)
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Inventory management
- [ ] Customer support tools

### Phase 5: Polish & Launch (Weeks 17-20)
- [ ] Performance optimization
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Production deployment`,
  },
];

const PRDView = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const sections = prdSections.map((s) => ({
        id: s.id,
        offset: document.getElementById(s.id)?.offsetTop || 0,
      }));

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offset) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = () => {
    const content = prdSections.map((s) => `# ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "PRD content has been copied in Markdown format.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/plan")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold gradient-text hidden sm:inline">Reqs.ai</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleCopy}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy Markdown"}</span>
              </Button>
              <Button variant="gradient" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:block w-64 sticky top-16 h-[calc(100vh-4rem)] border-r border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Contents</h3>
          <nav className="space-y-1">
            {prdSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.title}
                  {activeSection === section.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {/* Document Header */}
            <div className="mb-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4"
              >
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Product Requirements Document</span>
              </motion.div>
              <h1 className="text-4xl font-bold mb-2">E-Commerce Platform</h1>
              <p className="text-muted-foreground">Version 1.0 • Generated on {new Date().toLocaleDateString()}</p>
            </div>

            {/* Document Sections */}
            <div className="space-y-16">
              {prdSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-bold">{section.title}</h2>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {section.content.split("\n").map((line, i) => {
                        if (line.startsWith("## ")) {
                          return (
                            <h3 key={i} className="text-lg font-semibold mt-6 mb-3">
                              {line.replace("## ", "")}
                            </h3>
                          );
                        }
                        if (line.startsWith("### ")) {
                          return (
                            <h4 key={i} className="text-base font-medium mt-4 mb-2">
                              {line.replace("### ", "")}
                            </h4>
                          );
                        }
                        if (line.startsWith("- ")) {
                          return (
                            <li key={i} className="text-muted-foreground ml-4">
                              {line.replace("- ", "")}
                            </li>
                          );
                        }
                        if (line.startsWith("**")) {
                          const parts = line.split("**");
                          return (
                            <p key={i} className="text-muted-foreground">
                              <strong>{parts[1]}</strong>
                              {parts[2]}
                            </p>
                          );
                        }
                        if (line.trim()) {
                          return (
                            <p key={i} className="text-muted-foreground">
                              {line}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </motion.section>
                );
              })}
            </div>

            {/* Footer Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 p-8 rounded-2xl glass text-center"
            >
              <h3 className="text-xl font-bold mb-2">Ready to start building?</h3>
              <p className="text-muted-foreground mb-6">
                Export this PRD and share it with your team.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export as PDF
                </Button>
                <Button variant="glass" className="gap-2" onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                  Copy Markdown
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-6 right-6"
      >
        <Button
          variant="gradient"
          size="icon"
          className="w-14 h-14 rounded-full shadow-lg"
          onClick={() => navigate("/dashboard")}
        >
          <Sparkles className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
};

export default PRDView;
