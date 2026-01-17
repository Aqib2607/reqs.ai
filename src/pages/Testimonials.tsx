import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TestimonialsSection from "@/components/landing/TestimonialsSection";

const Testimonials = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-16">
                <TestimonialsSection />
            </main>
            <Footer />
        </div>
    );
};

export default Testimonials;
