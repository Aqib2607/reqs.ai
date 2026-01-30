import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Transform Your Ideas into Detailed Project Plans";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 sm:px-6 lg:px-8 pt-20 sm:pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=90&auto=format&fit=crop"
          alt="Premium tech background with AI elements"
          className="w-full h-full object-cover opacity-8"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
      </div>

      {/* Floating Tech Elements */}
      <motion.div
        className="absolute top-20 right-20 w-80 h-80 opacity-15"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=90&auto=format&fit=crop"
          alt="Futuristic AI visualization"
          className="w-full h-full object-cover rounded-3xl shadow-2xl"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 w-72 h-72 opacity-12"
        animate={{
          y: [0, 25, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=90&auto=format&fit=crop"
          alt="Advanced AI neural network"
          className="w-full h-full object-cover rounded-3xl shadow-2xl"
        />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 text-sm sm:text-base mb-6 sm:mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Project Planning</span>
          </motion.div>

          {/* Headline with Typewriter Effect */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[44px] sm:text-[56px] md:text-[66px] lg:text-[76px] xl:text-[84px] 2xl:text-[96px] font-display font-light leading-none tracking-tighter mb-6 sm:mb-8"
          >
            <span className="text-foreground">{displayText}</span>
            <span className="animate-pulse text-primary">|</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-muted-foreground max-w-2xl xl:max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-0"
          >
            Generate comprehensive PRDs and project plans in seconds. Let AI handle the documentation while you focus on building amazing products.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0"
          >
            <Link to="/signup">
              <Button variant="default" size="xl" className="group">
                Get Started Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="outline" size="xl">
              Watch Demo
            </Button>
          </motion.div>

          {/* Dashboard Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 sm:mt-16 lg:mt-20 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto relative px-4 sm:px-0"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-border/30 bg-gradient-to-br from-card/50 to-card">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=95&auto=format&fit=crop"
                alt="Reqs.ai Premium Dashboard Interface"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>

            {/* Stats Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-card px-8 py-4 rounded-full shadow-lg border border-border/50 flex gap-6"
            >
              <div className="text-center">
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">99%</p>
                <p className="text-xs text-muted-foreground">Satisfied</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
