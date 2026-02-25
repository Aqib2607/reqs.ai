import { Link } from "react-router-dom";
import { Sparkles, Menu, X, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavbarProps {
  activePage?: "home" | "features" | "how-it-works" | "pricing";
}

export function Navbar({ activePage = "home" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/40 py-2">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#050208] flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105">
                <BrainCircuit className="w-4 h-4 text-secondary" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#050208]">
                Reqs<span className="text-secondary-dark font-black">.ai</span>
              </span>
            </Link>

            {/* Main Links - Subtle and secondary */}
            <div className="hidden lg:flex items-center gap-8 ml-8">
              {["Features", "How It Works", "Pricing"].map((item) => {
                const id = item.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link
                    key={item}
                    to={`/${id}`}
                    className={`text-sm font-medium transition-colors ${activePage === id ? "text-slate-900" : "text-slate-400 hover:text-slate-900"
                      }`}
                  >
                    {item}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block">
              <span className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors px-4">Log in</span>
            </Link>
            {/* Primary Action Button (Pill shaped) */}
            <Link to="/register">
              <Button className="rounded-full bg-primary text-white hover:bg-primary/90 font-bold px-7 h-10 text-sm shadow-md transition-all hover:translate-y-[-1px] hover:shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
