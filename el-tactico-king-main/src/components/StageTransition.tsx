import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface StageTransitionProps {
  isVisible: boolean;
  onComplete: () => void;
  stageTitle: string;
  stageSubtitle?: string;
  stageNumber: number;
  theme?: 'formation' | 'draft' | 'tactics';
}

const StageTransition = ({ 
  isVisible, 
  onComplete, 
  stageTitle, 
  stageSubtitle = "Get ready to build your dream team",
  stageNumber = 1,
  theme = 'draft'
}: StageTransitionProps) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Show content after a brief delay
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 100);

      // Complete after 5 seconds
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    } else {
      setShowContent(false);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background">
      {/* Background gradient similar to landing page */}
      <div className="absolute inset-0 bg-gradient-to-br from-stadium-dark via-background to-stadium-primary/10" />
      
      {/* Ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stadium-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-stadium-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Stage indicator */}
          <motion.div
            className="mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={showContent ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-stadium-accent/20 rounded-full border border-stadium-accent/40">
              <div className="w-3 h-3 bg-stadium-accent rounded-full mr-4 animate-pulse" />
              <span className="text-lg font-gaming font-medium text-stadium-accent">
                STAGE {stageNumber}
              </span>
            </div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="text-6xl md:text-8xl font-gaming font-bold mb-6 bg-gradient-to-r from-white via-stadium-accent to-white bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={showContent ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              type: "spring",
              stiffness: 80
            }}
          >
            {stageTitle}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl font-display text-stadium-light/80 mb-12 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={showContent ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.3,
              ease: "easeOut"
            }}
          >
            {stageSubtitle}
          </motion.p>

          {/* Loading animation */}
          <motion.div
            className="flex justify-center items-center space-x-3"
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-stadium-accent rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="mt-12 max-w-md mx-auto"
            initial={{ scaleX: 0 }}
            animate={showContent ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
          >
            <div className="h-2 bg-stadium-accent/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-stadium-accent to-stadium-primary"
                initial={{ width: "0%" }}
                animate={showContent ? { width: "100%" } : { width: "0%" }}
                transition={{ duration: 4, delay: 1.2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StageTransition;
