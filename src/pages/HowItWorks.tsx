import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HowItWorksSection from "@/components/landing/HowItWorksSection";

const HowItWorks = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
                <HowItWorksSection />
            </main>
            <Footer />
        </div>
    );
};

export default HowItWorks;
