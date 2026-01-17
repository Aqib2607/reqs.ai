import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Changelog = () => {
    const updates = [
        {
            version: "v1.1.0",
            date: "January 15, 2026",
            title: "Advanced PRD Customization",
            description: "Users can now customize the structure of generated PRDs through settings.",
            changes: ["Added template selection", "Improved AI consistency", "Enhanced export formatting"]
        },
        {
            version: "v1.0.5",
            date: "January 5, 2026",
            title: "Performance Optimizations",
            description: "Major improvements to plan generation speed and UI responsiveness.",
            changes: ["Reduced API latency by 30%", "Lazy loading implementation", "Bundle size reduction"]
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-3xl mx-auto w-full">
                <h1 className="text-4xl font-bold mb-8">Changelog</h1>
                <div className="space-y-12">
                    {updates.map((update, idx) => (
                        <div key={idx} className="relative pl-8 border-l-2 border-border pb-8 last:pb-0">
                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                            <div className="flex items-center gap-4 mb-2">
                                <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded uppercase">
                                    {update.version}
                                </span>
                                <span className="text-sm text-muted-foreground">{update.date}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{update.title}</h3>
                            <p className="text-muted-foreground mb-4">{update.description}</p>
                            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                                {update.changes.map((change, cIdx) => (
                                    <li key={cIdx}>{change}</li>
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

export default Changelog;
