import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const APIReference = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto w-full">
                <h1 className="text-4xl font-bold mb-4">API Reference</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Integrate project planning directly into your workflow with our REST API.
                </p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2 text-primary">Authentication</h2>
                        <p className="mb-4">All API requests must include an <code className="bg-accent px-2 py-0.5 rounded text-sm font-mono">X-API-Key</code> header.</p>
                        <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                            curl https://api.reqs.ai/v1/plans \<br />
                            &nbsp;&nbsp;-H "X-API-Key: YOUR_API_KEY"
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2 text-primary">Endpoints</h2>
                        <div className="space-y-6">
                            <div className="p-6 rounded-xl border border-border bg-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold rounded">GET</span>
                                    <span className="font-mono text-sm">/v1/plans</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">Retrieve a list of all your generated project plans.</p>
                            </div>
                            <div className="p-6 rounded-xl border border-border bg-card">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-xs font-bold rounded">POST</span>
                                    <span className="font-mono text-sm">/v1/plans</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">Generate a new project plan from a natural language idea.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default APIReference;
