import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager at TechCorp",
    content: "Reqs.ai has completely transformed how we approach project planning. What used to take days now takes minutes.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=90&auto=format&fit=crop",
  },
  {
    name: "Marcus Johnson",
    role: "CTO at StartupXYZ",
    content: "The quality of PRDs generated is incredible. It's like having a senior PM on demand, available 24/7.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=90&auto=format&fit=crop",
  },
  {
    name: "Emily Rodriguez",
    role: "Engineering Lead at DevStudio",
    content: "Our team's alignment improved dramatically. Everyone understands the requirements from day one.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=90&auto=format&fit=crop",
  },
  {
    name: "David Kim",
    role: "Founder at InnovateLab",
    content: "As a solo founder, Reqs.ai is my secret weapon. It helps me think through projects like a full team would.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=90&auto=format&fit=crop",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 xl:py-28" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-light tracking-tight mb-4">
            Loved by <span className="text-foreground">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what our users have to say about their experience with Reqs.ai.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-0">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glass p-6 sm:p-8 md:p-10 lg:p-8 xl:p-10 rounded-2xl text-center"
                  >
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl mb-6 sm:mb-8 text-foreground leading-relaxed px-2 sm:px-4">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-border shadow-lg">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button variant="ghost" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "w-8 bg-foreground"
                    : "bg-muted-foreground/30"
                    }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={goToNext}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
