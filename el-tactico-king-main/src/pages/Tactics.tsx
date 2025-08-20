import ConfirmResetDialog from "@/components/ConfirmResetDialog";
import { resetApp } from "@/lib/reset-utils";

const Tactics = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-stadium-dark via-background to-stadium-primary/10" />
      
      {/* Ambient lighting effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stadium-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-stadium-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header with Start Over button */}
          <div className="gaming-header rounded-2xl p-8 mb-12">
            <div className="flex justify-between items-center">
              <div className="flex-1" />
              <div className="text-center flex-1">
                <h1 className="text-5xl md:text-7xl font-gaming font-bold gaming-text-gradient mb-4">
                  TACTICS CENTER
                </h1>
                <p className="text-xl font-display text-stadium-light/80 tracking-wide">
                  Master the art of tactical warfare
                </p>
              </div>
              <div className="flex-1 flex justify-end">
                <ConfirmResetDialog
                  onConfirm={resetApp}
                  className="gaming-outline-button"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-8">
              <div className="gaming-card rounded-2xl p-12 max-w-2xl">
                <div className="space-y-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-stadium-primary to-stadium-accent rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-stadium-light to-stadium-primary rounded-full flex items-center justify-center">
                      <span className="text-stadium-dark font-gaming font-bold text-2xl">⚽</span>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-gaming font-bold gaming-text-gradient mb-4">
                      TACTICS ENGINE
                    </h2>
                    <p className="text-lg font-display text-stadium-light/80 leading-relaxed">
                      Advanced tactical analysis and strategy implementation coming soon. 
                      Prepare to revolutionize your approach to the beautiful game.
                    </p>
                  </div>
                  
                  <div className="w-16 h-1 bg-gradient-to-r from-stadium-primary to-stadium-accent mx-auto rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tactics;