import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Support = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow pt-24 pb-16 px-4 md:px-8 max-w-3xl mx-auto w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
                    <p className="text-muted-foreground">Have a question or need assistance? We're here to help.</p>
                </div>

                <div className="p-8 rounded-2xl border border-border bg-card">
                    <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input type="email" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input placeholder="How can we help?" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea className="min-h-[150px]" placeholder="Tell us more about your issue..." />
                        </div>
                        <Button className="w-full h-12 text-lg">Send Message</Button>
                    </form>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm text-muted-foreground">
                    <div className="p-4">
                        <h4 className="font-bold text-foreground mb-1">Email</h4>
                        <p>support@reqs.ai</p>
                    </div>
                    <div className="p-4">
                        <h4 className="font-bold text-foreground mb-1">Response Time</h4>
                        <p>Typically within 24 hours</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Support;
