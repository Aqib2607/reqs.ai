import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Blog = () => {
    const posts = [
        {
            title: "How AI is changing project management for developers",
            excerpt: "Explore the shift from manual planning to AI-assisted roadmap generation and what it means for the future.",
            author: "Team Reqs",
            date: "Jan 10, 2026",
            category: "Insight"
        },
        {
            title: "5 Tips for better PRD generation",
            excerpt: "Learn how to structure your prompts to get the most accurate and actionable documents from our engine.",
            author: "Sarah Chen",
            date: "Jan 5, 2026",
            category: "Guide"
        },
        {
            title: "Announcing Reqs.ai v1.1.0",
            excerpt: "New features, faster generation speeds, and better integrations. See what's new in our latest update.",
            author: "Team Reqs",
            date: "Dec 20, 2025",
            category: "Updates"
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2">Our Blog</h1>
                        <p className="text-muted-foreground">Stories, insights, and engineering updates from the Reqs.ai team.</p>
                    </div>
                    <div className="flex gap-2">
                        {["All", "Insight", "Guide", "Updates"].map(cat => (
                            <button key={cat} className="px-4 py-1.5 rounded-full border border-border text-sm hover:border-primary hover:text-primary transition-all">
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, idx) => (
                        <article key={idx} className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:card-shadow-hover transition-all">
                            <div className="aspect-video bg-accent" />
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase text-primary tracking-wider">{post.category}</span>
                                    <span className="text-xs text-muted-foreground">{post.date}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 hover:text-primary cursor-pointer transition-colors">{post.title}</h3>
                                <p className="text-muted-foreground text-sm flex-grow mb-4 line-clamp-3">{post.excerpt}</p>
                                <div className="pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">By {post.author}</span>
                                    <span className="text-sm font-bold text-primary cursor-pointer">Read more →</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Blog;
