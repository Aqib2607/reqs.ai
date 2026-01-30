import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast({
        title: "You're on the list!",
        description: "We'll notify you when new features drop.",
      });
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28 relative overflow-hidden bg-primary" ref={ref}>
      {/* Premium tech background with subtle pattern */}
      <div className="absolute inset-0 bg-primary">
        <img
          src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1920&q=90&auto=format&fit=crop"
          alt="Premium technology pattern"
          className="w-full h-full object-cover opacity-8 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/95 to-primary" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl xl:max-w-3xl mx-auto text-center px-4 sm:px-0"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-display font-light mb-4 text-primary-foreground px-2 sm:px-0">
            Ready to Transform Your Project Planning?
          </h2>
          <p className="text-primary-foreground/80 text-base sm:text-lg md:text-xl lg:text-lg mb-8 px-2 sm:px-4">
            Join thousands of developers and product managers who are already using Reqs.ai to build better products.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md xl:max-w-lg mx-auto px-4 sm:px-0">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground"
            />
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="h-12 bg-primary-foreground text-primary hover:bg-primary-foreground/90 group border-primary-foreground/20"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-5 h-5" />
                  Subscribed!
                </>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <p className="text-primary-foreground/60 text-sm mt-4">
            Free to start. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
