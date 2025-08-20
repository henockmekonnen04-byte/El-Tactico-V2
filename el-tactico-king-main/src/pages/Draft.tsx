import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import StageTransition from "@/components/StageTransition";
import ConfirmResetDialog from "@/components/ConfirmResetDialog";
import { resetApp, shouldResetOnRefresh } from "@/lib/reset-utils";

// Formation definitions
const formations = [
  {
    id: "4-3-3",
    name: "4-3-3",
    slots: ["GK", "LB", "CB", "CB", "RB", "DM", "CM", "CM", "LW", "ST", "RW"],
    positions: {
      GK: [{ x: 50, y: 90 }],
      CB: [{ x: 30, y: 70 }, { x: 70, y: 70 }],
      LB: [{ x: 10, y: 60 }],
      RB: [{ x: 90, y: 60 }],
      DM: [{ x: 50, y: 55 }],
      CM: [{ x: 30, y: 40 }, { x: 70, y: 40 }],
      LW: [{ x: 20, y: 20 }],
      ST: [{ x: 50, y: 15 }],
      RW: [{ x: 80, y: 20 }]
    }
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    slots: ["GK", "CB", "CB", "CB", "LWB", "CM", "CM", "CM", "RWB", "ST", "ST"],
    positions: {
      GK: [{ x: 50, y: 90 }],
      CB: [{ x: 25, y: 70 }, { x: 50, y: 75 }, { x: 75, y: 70 }],
      LWB: [{ x: 15, y: 50 }],
      CM: [{ x: 35, y: 45 }, { x: 50, y: 40 }, { x: 65, y: 45 }],
      RWB: [{ x: 85, y: 50 }],
      ST: [{ x: 40, y: 15 }, { x: 60, y: 15 }]
    }
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    slots: ["GK", "LB", "CB", "CB", "RB", "DM", "DM", "LW", "CAM", "RW", "ST"],
    positions: {
      GK: [{ x: 50, y: 90 }],
      CB: [{ x: 30, y: 70 }, { x: 70, y: 70 }],
      LB: [{ x: 10, y: 60 }],
      RB: [{ x: 90, y: 60 }],
      DM: [{ x: 35, y: 50 }, { x: 65, y: 50 }],
      LW: [{ x: 20, y: 30 }],
      CAM: [{ x: 50, y: 25 }],
      RW: [{ x: 80, y: 30 }],
      ST: [{ x: 50, y: 10 }]
    }
  }
];

// Mock player data with team information
const players = [
  // Goalkeepers
  { id: "1", name: "Alisson Becker", position: "GK" as const, team: "Liverpool" },
  { id: "2", name: "Thibaut Courtois", position: "GK" as const, team: "Real Madrid" },
  { id: "3", name: "Ederson", position: "GK" as const, team: "Manchester City" },
  
  // Center Backs
  { id: "4", name: "Virgil van Dijk", position: "CB" as const, team: "Liverpool" },
  { id: "5", name: "Sergio Ramos", position: "CB" as const, team: "PSG" },
  { id: "6", name: "Ruben Dias", position: "CB" as const, team: "Manchester City" },
  { id: "7", name: "Kalidou Koulibaly", position: "CB" as const, team: "Chelsea" },
  { id: "8", name: "Raphael Varane", position: "CB" as const, team: "Manchester United" },
  
  // Full Backs
  { id: "9", name: "Trent Alexander-Arnold", position: "RB" as const, team: "Liverpool" },
  { id: "10", name: "Andrew Robertson", position: "LB" as const, team: "Liverpool" },
  { id: "11", name: "Kyle Walker", position: "RB" as const, team: "Manchester City" },
  { id: "12", name: "Jordi Alba", position: "LB" as const, team: "Barcelona" },
  { id: "13", name: "Achraf Hakimi", position: "RWB" as const, team: "PSG" },
  { id: "14", name: "Alphonso Davies", position: "LWB" as const, team: "Bayern Munich" },
  
  // Midfielders
  { id: "15", name: "Kevin De Bruyne", position: "CM" as const, team: "Manchester City" },
  { id: "16", name: "Luka Modric", position: "CM" as const, team: "Real Madrid" },
  { id: "17", name: "N'Golo Kante", position: "DM" as const, team: "Chelsea" },
  { id: "18", name: "Joshua Kimmich", position: "DM" as const, team: "Bayern Munich" },
  { id: "19", name: "Bruno Fernandes", position: "CAM" as const, team: "Manchester United" },
  { id: "20", name: "Pedri", position: "CM" as const, team: "Barcelona" },
  { id: "21", name: "Casemiro", position: "DM" as const, team: "Manchester United" },
  { id: "22", name: "Jude Bellingham", position: "CM" as const, team: "Real Madrid" },
  
  // Wingers
  { id: "23", name: "Mohamed Salah", position: "RW" as const, team: "Liverpool" },
  { id: "24", name: "Sadio Mane", position: "LW" as const, team: "Bayern Munich" },
  { id: "25", name: "Kylian Mbappe", position: "LW" as const, team: "PSG" },
  { id: "26", name: "Riyad Mahrez", position: "RW" as const, team: "Manchester City" },
  
  // Strikers
  { id: "27", name: "Robert Lewandowski", position: "ST" as const, team: "Barcelona" },
  { id: "28", name: "Erling Haaland", position: "ST" as const, team: "Manchester City" },
  { id: "29", name: "Harry Kane", position: "ST" as const, team: "Bayern Munich" },
  { id: "30", name: "Karim Benzema", position: "ST" as const, team: "Real Madrid" }
];

type SlotId = string;
type PlayerId = string;
type Position = "GK" | "CB" | "LB" | "RB" | "DM" | "CM" | "CAM" | "LW" | "RW" | "ST" | "LWB" | "RWB";

interface DraftState {
  formationId: string;
  order: SlotId[];
  candidates: Record<SlotId, PlayerId[]>;
  picks: Partial<Record<SlotId, PlayerId>>;
  used: Set<string>;
  idx: number;
}

const STORAGE_KEY = "draft-state";

const Draft = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"stage1" | "formation" | "stage2" | "draft" | "stage3">("stage1");
  const [selectedFormation, setSelectedFormation] = useState<typeof formations[0] | null>(null);
  const [draftState, setDraftState] = useState<DraftState | null>(null);

  // Load from localStorage on mount - but only if we're not refreshing
  useEffect(() => {
    // Don't load saved state if we're supposed to reset
    if (shouldResetOnRefresh()) {
      return;
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const formation = formations.find(f => f.id === parsed.formationId);
        if (formation) {
          setSelectedFormation(formation);
          setDraftState({
            ...parsed,
            used: new Set(parsed.used)
          });
          setStep("draft");
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever draftState changes
  useEffect(() => {
    if (draftState) {
      const toSave = {
        ...draftState,
        used: Array.from(draftState.used)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  }, [draftState]);

  const generateCandidates = (position: Position, used: Set<string>): PlayerId[] => {
    const positionMap: Record<Position, Position[]> = {
      GK: ["GK"],
      CB: ["CB"],
      LB: ["LB", "LWB"],
      RB: ["RB", "RWB"],
      LWB: ["LWB", "LB"],
      RWB: ["RWB", "RB"],
      DM: ["DM", "CM"],
      CM: ["CM", "DM", "CAM"],
      CAM: ["CAM", "CM"],
      LW: ["LW", "RW"],
      RW: ["RW", "LW"],
      ST: ["ST"]
    };

    const validPositions = positionMap[position] || [position];
    const available = players.filter(p => 
      validPositions.includes(p.position) && !used.has(p.id)
    );

    // Shuffle and take 2
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2).map(p => p.id);
  };

  const handleStage1Complete = () => {
    setStep("formation");
  };

  const startDraft = (formation: typeof formations[0]) => {
    setSelectedFormation(formation);
    setStep("stage2");
  };

  const handleStage2Complete = () => {
    // Generate slot order with position mapping
    const order = selectedFormation!.slots.map((pos, idx) => `${pos}-${idx}`);
    const used = new Set<string>();
    const candidates: Record<SlotId, PlayerId[]> = {};

    // Generate candidates for first slot
    const firstSlot = order[0];
    const firstPosition = selectedFormation!.slots[0] as Position;
    candidates[firstSlot] = generateCandidates(firstPosition, used);

    const state: DraftState = {
      formationId: selectedFormation!.id,
      order,
      candidates,
      picks: {},
      used,
      idx: 0
    };

    setDraftState(state);
    setStep("draft");
  };

  const handleStage3Complete = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate("/tactics");
  };

  const pickPlayer = (playerId: PlayerId) => {
    if (!draftState || !selectedFormation) return;

    const currentSlot = draftState.order[draftState.idx];
    const newUsed = new Set([...draftState.used, playerId]);
    const newPicks = { ...draftState.picks, [currentSlot]: playerId };
    const nextIdx = draftState.idx + 1;

    // If this was the last pick, show stage 3 transition
    if (nextIdx >= draftState.order.length) {
      setStep("stage3");
      return;
    }

    // Generate candidates for next slot
    const nextSlot = draftState.order[nextIdx];
    const nextPosition = selectedFormation.slots[nextIdx] as Position;
    const nextCandidates = generateCandidates(nextPosition, newUsed);

    const newState: DraftState = {
      ...draftState,
      picks: newPicks,
      used: newUsed,
      idx: nextIdx,
      candidates: {
        ...draftState.candidates,
        [nextSlot]: nextCandidates
      }
    };

    setDraftState(newState);
  };

  const getCurrentSlotPosition = () => {
    if (!draftState || !selectedFormation) return "";
    return selectedFormation.slots[draftState.idx];
  };

  const getPlayerById = (id: PlayerId) => players.find(p => p.id === id);

  const renderFormationPitch = (formation: typeof formations[0], mini = false) => {
    const size = mini ? 120 : 200;
    const positions = Object.entries(formation.positions).flatMap(([pos, coords]) =>
      coords.map((coord, idx) => ({
        position: pos,
        x: coord.x,
        y: coord.y,
        key: `${pos}-${idx}`
      }))
    );

    return (
      <div 
        className="relative bg-gradient-to-br from-stadium-primary/20 to-stadium-accent/10 rounded-xl border border-stadium-primary/30 backdrop-blur-sm"
        style={{ width: size, height: size * 0.7 }}
      >
        {/* Pitch lines */}
        <div className="absolute inset-0 border border-stadium-primary/20 rounded-xl" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-stadium-primary/30" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stadium-primary/30" />
        
        {positions.map((pos) => (
          <div
            key={pos.key}
            className="absolute w-4 h-4 bg-gradient-to-br from-stadium-light to-stadium-primary rounded-full border-2 border-stadium-accent shadow-lg"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>
    );
  };

  const TeamPreview = () => {
    if (!selectedFormation || !draftState) return null;

    const picks = Object.entries(draftState.picks).length;
    const total = draftState.order.length;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-gaming font-bold gaming-text-gradient mb-2">YOUR XI</h3>
          <p className="text-lg font-display text-stadium-light/80 mb-4">{picks} / {total} selected</p>
          
          {/* Progress Bar */}
          <div className="relative mb-4">
            <div className="gaming-progress h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-stadium-primary to-stadium-accent transition-all duration-500"
                style={{ width: `${(picks / total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            {renderFormationPitch(selectedFormation, true)}
            <div className="absolute inset-0 bg-gradient-to-t from-stadium-primary/20 to-transparent rounded-lg" />
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {draftState.order.map((slotId, idx) => {
            const position = selectedFormation.slots[idx];
            const playerId = draftState.picks[slotId];
            const player = playerId ? getPlayerById(playerId) : null;

            return (
              <div
                key={slotId}
                className={`flex justify-between items-center p-3 rounded-lg text-sm transition-all duration-300 ${
                  idx === draftState.idx 
                    ? 'gaming-card border border-stadium-accent/50 gaming-glow' 
                    : 'bg-muted/30 border border-border/30'
                }`}
              >
                <span className="font-display font-semibold text-stadium-light/90">{position}</span>
                <span className={`font-body ${player ? 'text-stadium-light' : 'text-stadium-light/50'}`}>
                  {player ? player.name : `— ${position} —`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Stage 1: Transition to Formation Selection
  if (step === "stage1") {
    return (
      <StageTransition
        key="stage1"
        isVisible={true}
        onComplete={handleStage1Complete}
        stageTitle="Select Your Formation"
        stageSubtitle="Choose your tactical foundation"
        stageNumber={1}
        theme="formation"
      />
    );
  }

  // Formation Selection
  if (step === "formation") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stadium-dark via-background to-stadium-primary/10" />
        
        {/* Ambient lighting effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stadium-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-stadium-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with Start Over button */}
            <div className="gaming-header rounded-2xl p-6 mb-12">
              <div className="flex justify-between items-center">
                <div className="flex-1" />
                <div className="text-center flex-1">
                  <h1 className="text-5xl md:text-7xl font-gaming font-bold gaming-text-gradient mb-4">
                    FORMATION SELECT
                  </h1>
                  <p className="text-xl font-display text-stadium-light/80 tracking-wide">
                    Choose your tactical foundation
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

            <div className="grid md:grid-cols-3 gap-8">
              {formations.map((formation, index) => (
                <div 
                  key={formation.id}
                  className="gaming-card rounded-2xl p-8 cursor-pointer transform transition-all duration-500 hover:scale-105 gaming-glow"
                  onClick={() => startDraft(formation)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <h3 className="text-4xl font-gaming font-bold gaming-text-gradient mb-2">
                        {formation.name}
                      </h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-stadium-primary to-stadium-accent mx-auto rounded-full" />
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="relative">
                        {renderFormationPitch(formation)}
                        <div className="absolute inset-0 bg-gradient-to-t from-stadium-primary/20 to-transparent rounded-lg" />
                      </div>
                    </div>
                    
                    <Button className="gaming-button w-full text-lg font-display font-semibold py-4">
                      SELECT FORMATION
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Stage 2: Transition to Draft
  if (step === "stage2") {
    return (
      <StageTransition
        key="stage2"
        isVisible={true}
        onComplete={handleStage2Complete}
        stageTitle="Draft Your Team"
        stageSubtitle="Select your players and build the ultimate squad"
        stageNumber={2}
        theme="draft"
      />
    );
  }

  // Draft Phase
  if (step === "draft" && draftState && selectedFormation) {
    const currentSlot = draftState.order[draftState.idx];
    const currentCandidates = draftState.candidates[currentSlot] || [];
    const position = getCurrentSlotPosition();
    const progress = ((draftState.idx + 1) / draftState.order.length) * 100;

    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stadium-dark via-background to-stadium-primary/10" />
        
        {/* Ambient lighting effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stadium-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-stadium-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        
        <div className="relative z-10 flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-96 gaming-header border-r border-border/30 p-6 sticky top-0 h-screen overflow-y-auto">
            <TeamPreview />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="gaming-header rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="lg:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button className="gaming-outline-button">
                          <Menu className="w-4 h-4 mr-2" />
                          Your XI ({Object.keys(draftState.picks).length}/{draftState.order.length})
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="h-[60vh] gaming-header">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-gaming font-semibold text-foreground text-xl">Your XI</h3>
                            <ConfirmResetDialog
                              onConfirm={resetApp}
                              className="gaming-outline-button"
                            />
                          </div>
                          <TeamPreview />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <div className="flex-1 lg:text-center">
                    <h2 className="text-4xl font-gaming font-bold gaming-text-gradient mb-2">SELECT {position}</h2>
                    <p className="text-xl font-display text-stadium-light/80 tracking-wide">
                      {draftState.idx + 1} / {draftState.order.length}
                    </p>
                  </div>
                  <div className="lg:flex hidden">
                    <ConfirmResetDialog
                      onConfirm={resetApp}
                      className="gaming-outline-button"
                    />
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative">
                  <div className="gaming-progress h-3 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-stadium-primary to-stadium-accent transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="absolute -top-8 right-0 text-sm font-display text-stadium-light/60">
                    {Math.round(progress)}%
                  </div>
                </div>
              </div>

              {/* Candidates */}
              <div className="grid md:grid-cols-2 gap-8">
                {currentCandidates.map((playerId, index) => {
                  const player = getPlayerById(playerId);
                  if (!player) return null;

                  return (
                    <div 
                      key={playerId}
                      className="gaming-card rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 gaming-glow"
                      onClick={() => pickPlayer(playerId)}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="space-y-4">
                        {/* Player Header */}
                        <div className="flex items-center justify-between">
                          <div className="gaming-badge px-3 py-1.5 rounded-full text-sm font-gaming font-bold">
                            {player.position}
                          </div>
                          <span className="text-sm font-display text-stadium-light/70 font-semibold">
                            {player.team}
                          </span>
                        </div>
                        
                        {/* Player Avatar */}
                        <div className="flex justify-center">
                          <div className="w-24 h-24 bg-gradient-to-br from-stadium-primary to-stadium-accent rounded-full flex items-center justify-center p-1">
                            <div className="w-full h-full bg-gradient-to-br from-stadium-light to-stadium-primary rounded-full flex items-center justify-center">
                              <span className="text-stadium-dark font-gaming font-bold text-2xl">
                                {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Player Info */}
                        <div className="text-center space-y-2">
                          <h3 className="text-2xl font-gaming font-bold gaming-text-gradient">
                            {player.name}
                          </h3>
                          <p className="text-lg font-display text-stadium-light/80">
                            {player.team}
                          </p>
                          <div className="w-16 h-0.5 bg-gradient-to-r from-stadium-primary to-stadium-accent mx-auto rounded-full" />
                        </div>
                        
                        {/* Select Button */}
                        <Button className="gaming-button w-full text-lg font-display font-semibold py-4">
                          SELECT PLAYER
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Stage 3: Transition to Tactics
  if (step === "stage3") {
    return (
      <StageTransition
        key="stage3"
        isVisible={true}
        onComplete={handleStage3Complete}
        stageTitle="Assemble Your Tactics"
        stageSubtitle="Master the art of tactical warfare"
        stageNumber={3}
        theme="tactics"
      />
    );
  }

  return null;
};

export default Draft;
