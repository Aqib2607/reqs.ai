import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto w-full">
            <h1 className="text-4xl font-bold mb-8">{title}</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
                {children}
            </div>
        </main>
        <Footer />
    </div>
);

export const PrivacyPolicy = () => (
    <LegalLayout title="Privacy Policy">
        <p>Last Updated: January 18, 2026</p>
        <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
        <p>We collect information you provide directly to us when you create an account, generate plans, or contact support.</p>
        <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, including AI plan generation.</p>
    </LegalLayout>
);

export const TermsOfService = () => (
    <LegalLayout title="Terms of Service">
        <p>Last Updated: January 18, 2026</p>
        <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
        <p>By accessing Reqs.ai, you agree to be bound by these Terms of Service.</p>
        <h2 className="text-xl font-bold text-foreground">2. Service Description</h2>
        <p>Reqs.ai provides AI-powered project planning tools. We do not guarantee the accuracy of generated content.</p>
    </LegalLayout>
);

export const CookiePolicy = () => (
    <LegalLayout title="Cookie Policy">
        <p>Last Updated: January 18, 2026</p>
        <h2 className="text-xl font-bold text-foreground">1. What are cookies?</h2>
        <p>Cookies are small text files stored on your device to help websites function better.</p>
        <h2 className="text-xl font-bold text-foreground">2. How we use cookies</h2>
        <p>We use essential cookies for authentication and performance cookies for analytics.</p>
    </LegalLayout>
);
