import { Link } from "react-router-dom";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavbarProps {
  activePage?: "home" | "features" | "how-it-works" | "pricing";
}

export function Navbar({ activePage = "home" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center yellow-glow">
              <Sparkles className="w-4 h-4 text-secondary" />
            </div>
            <span className="font-bold text-lg">
              Reqs<span className="text-secondary">.ai</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm transition-colors ${
                activePage === "home" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={`text-sm transition-colors ${
                activePage === "features" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Features
            </Link>
            <Link 
              to="/how-it-works" 
              className={`text-sm transition-colors ${
                activePage === "how-it-works" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm transition-colors ${
                activePage === "pricing" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pricing
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-3">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm transition-colors ${
                  activePage === "home" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm transition-colors ${
                  activePage === "features" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Features
              </Link>
              <Link 
                to="/how-it-works" 
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm transition-colors ${
                  activePage === "how-it-works" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                How It Works
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm transition-colors ${
                  activePage === "pricing" ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pricing
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
