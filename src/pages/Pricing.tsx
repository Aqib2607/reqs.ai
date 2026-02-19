import { Link } from "react-router-dom";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Reqs.ai",
    features: [
      "3 projects per month",
      "Basic AI generation",
      "Markdown export",
      "Community support",
      "Version history (7 days)"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professional developers and teams",
    features: [
      "Unlimited projects",
      "Advanced AI models",
      "All export formats (MD, PDF)",
      "Priority support",
      "Unlimited version history",
      "Team collaboration (5 members)",
      "API access"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large teams and organizations",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Custom AI training",
      "Dedicated support",
      "SLA guarantee",
      "On-premise deployment",
      "Custom integrations",
      "Advanced security"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar activePage="pricing" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include core AI features.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`glass-card p-8 hover-lift relative ${plan.popular ? 'border-secondary/50 ring-2 ring-secondary/20' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/ {plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.name === "Enterprise" ? "/contact" : "/register"}>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-2">Can I switch plans anytime?</h3>
              <p className="text-sm text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-sm text-muted-foreground">Yes! Pro plan comes with a 14-day free trial. No credit card required.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
