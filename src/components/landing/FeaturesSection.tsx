import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, FileText, Code, Share2 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate comprehensive project plans in seconds, not hours. Our AI understands your ideas instantly.",
  },
  {
    icon: FileText,
    title: "Professional PRDs",
    description: "Create detailed Product Requirements Documents that your team and stakeholders will love.",
  },
  {
    icon: Code,
    title: "Technical Specs",
    description: "Get architecture recommendations, tech stack suggestions, and implementation guidelines.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Export to PDF, Markdown, or share directly with your team through unique links.",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-foreground">Plan Better</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From initial idea to comprehensive documentation, we've got you covered.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border/50">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
