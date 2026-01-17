import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Search, Book, Code, Terminal, Zap } from "lucide-react";

const Documentation = () => {
    const sections = [
        { title: "Introduction", icon: Book, links: ["What is Reqs.ai?", "Getting Started", "Core Concepts"] },
        { title: "Guides", icon: Zap, links: ["Generating your first plan", "Refining AI output", "Exporting Documents"] },
        { title: "API", icon: Terminal, links: ["Authentication", "Endpoints Reference", "Rate Limits"] },
        { title: "Advanced", icon: Code, links: ["Custom Templates", "Team Workspaces", "Integration Hooks"] }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <div className="max-w-2xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-extrabold mb-4 text-glow-primary">Documentation</h1>
                    <p className="text-muted-foreground mb-8">Everything you need to build and plan with Reqs.ai.</p>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input className="pl-10 h-12 border-primary/20 focus-visible:ring-primary" placeholder="Search the docs..." />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sections.map((section, idx) => (
                        <div key={idx} className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group">
                            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <section.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Documentation;
