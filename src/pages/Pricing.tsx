import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for students and early explorers.",
            features: ["5 Plans per month", "Basic PRD Generation", "Markdown Export", "Community Support"],
            cta: "Get Started",
            variant: "outline"
        },
        {
            name: "Pro",
            price: "$19",
            description: "Best for solo developers and freelancers.",
            features: ["Unlimited Plans", "Advanced AI Models", "All Export Formats", "Priority Support", "Version Tracking"],
            cta: "Go Pro",
            variant: "default"
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For teams requiring scale and control.",
            features: ["SSO & Team Management", "Shared API Quotas", "Custom Templates", "Dedicated Success Manager", "SLA Guarantee"],
            cta: "Contact Sales",
            variant: "outline"
        }
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your project needs. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`p-8 rounded-2xl border ${plan.variant === 'default' ? 'border-primary shadow-glow-primary' : 'border-border'} bg-card flex flex-col`}>
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.price !== 'Custom' && <span className="text-muted-foreground">/mo</span>}
                            </div>
                            <p className="text-muted-foreground mb-8">{plan.description}</p>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-3 text-sm">
                                        <Check className="w-5 h-5 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button variant={plan.variant as any} className="w-full">
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Pricing;
