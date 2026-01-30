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
    <section id="features" className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-background" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-light tracking-tight mb-4">
            Everything You Need to <span className="text-foreground">Plan Better</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From initial idea to comprehensive documentation, we've got you covered.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-6 xl:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card hover:bg-accent/5 transition-all duration-300 card-shadow hover:card-shadow-hover group border border-border/50"
            >
              {/* Feature Image */}
              <div className="mb-5 overflow-hidden rounded-2xl h-40 sm:h-44 md:h-48 lg:h-40 xl:h-48 bg-gradient-to-br from-muted/40 to-muted/20 shadow-lg">
                <img
                  src={
                    index === 0 ? "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&q=90&auto=format&fit=crop" :
                      index === 1 ? "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=90&auto=format&fit=crop" :
                        index === 2 ? "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=90&auto=format&fit=crop" :
                          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=90&auto=format&fit=crop"
                  }
                  alt={feature.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>

              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
