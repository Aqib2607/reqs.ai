import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Wand2, FileCheck, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Describe Your Idea",
    description: "Simply type or paste your project idea. Be as detailed or brief as you like.",
  },
  {
    icon: Wand2,
    title: "AI Analyzes",
    description: "Our AI processes your input and structures it into a comprehensive plan.",
  },
  {
    icon: FileCheck,
    title: "Review & Edit",
    description: "Fine-tune the generated plan to match your exact requirements.",
  },
  {
    icon: Rocket,
    title: "Generate PRD",
    description: "Export your professional PRD and start building your project.",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 gradient-hero-bg" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How <span className="gradient-text">Reqs.ai</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four simple steps to transform your ideas into actionable project plans.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary -translate-y-1/2">
            <motion.div
              className="absolute top-1/2 w-4 h-4 rounded-full bg-primary -translate-y-1/2"
              animate={{ left: ["0%", "100%", "0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ 
                  opacity: 0, 
                  x: index % 2 === 0 ? -30 : 30 
                }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Step Number */}
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-bold text-sm mb-4 relative z-10">
                    {index + 1}
                  </div>
                  
                  {/* Card */}
                  <div className="w-full p-6 rounded-2xl bg-card card-shadow border border-border/50 hover:card-shadow-hover transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
