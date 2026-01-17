import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeaturesSection from "@/components/landing/FeaturesSection";

const Features = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
                <FeaturesSection />
            </main>
            <Footer />
        </div>
    );
};

export default Features;
