import { Crown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import stadiumBackground from "@/assets/stadium-background.jpg";
import ConfirmResetDialog from "@/components/ConfirmResetDialog";
import { resetApp } from "@/lib/reset-utils";

const HeroSection = () => {

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${stadiumBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 stadium-overlay" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Start Over Button (top right) */}
        <div className="absolute top-4 right-4 animate-fade-in">
          <ConfirmResetDialog
            onConfirm={resetApp}
            className="text-stadium-light/60 hover:text-stadium-light border-stadium-light/20 hover:border-stadium-light/40"
          />
        </div>

        {/* Main Title */}
        <div className="mb-12 animate-fade-in">
          <h1 className="flex items-center justify-center gap-6 text-6xl md:text-8xl font-bold mb-4">
            <span className="stadium-title font-gaming">EL</span>
            <Crown 
              size={80} 
              className="text-stadium-accent animate-pulse-glow" 
              strokeWidth={1.5}
            />
            <span className="stadium-title font-gaming">TACTICO</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-stadium-light/80 font-display max-w-2xl mx-auto leading-relaxed">
            Master the beautiful game through strategic thinking and tactical excellence
          </p>
        </div>

        {/* Play Button */}
        <div className="animate-slide-up">
          <Button
            asChild
            size="lg"
            className="stadium-button text-stadium-dark font-semibold text-lg px-12 py-6 rounded-full border-0 hover:scale-105 transition-all duration-300"
          >
            <Link to="/draft">
              <Play className="mr-3 h-6 w-6" fill="currentColor" />
              Start Overthinking
            </Link>
          </Button>
        </div>

        {/* Subtitle */}
        <div className="mt-8 animate-fade-in">
          <p className="text-stadium-light/60 text-sm font-display tracking-wider uppercase">
            Chess meets Football
          </p>
        </div>
      </div>

      {/* Ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-stadium-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-stadium-accent/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
    </section>
  );
};

export default HeroSection;