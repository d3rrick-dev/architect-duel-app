import { useDuel } from "./hooks/useDuel";
import { Header } from "./components/Header";
import { ChallengeList } from "./components/ChallengeList";
import { ChallengeCard } from "./components/ChallengeCard";

const CATEGORIES = ["All", "System", "Frontend", "Security", "DevOps", "AI"] as const;

export default function App() {
  const duel = useDuel();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !duel.currentChallenge) {
      if (duel.searchQuery.trim() !== "" && duel.filteredChallenges.length > 0) {
        duel.selectChallenge(duel.filteredChallenges[0]);
      } else {
        duel.triggerNextUnresolved();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono">
      <Header 
        resolvedCount={duel.resolvedCount} 
        totalCount={duel.totalCount} 
        onReset={duel.resetSystem} 
      />
      
      <main className="max-w-2xl mx-auto">
        {!duel.currentChallenge ? (
          <ChallengeList 
            searchQuery={duel.searchQuery} 
            setSearchQuery={duel.setSearchQuery}
            activeCategory={duel.activeCategory} 
            setActiveCategory={duel.setActiveCategory}
            categories={CATEGORIES} 
            filteredChallenges={duel.filteredChallenges}
            onSelect={duel.selectChallenge}
            onNext={duel.triggerNextUnresolved} 
            onKeyDown={handleKeyDown}
          />
        ) : (
          <ChallengeCard 
            challenge={duel.currentChallenge} 
            showClues={duel.showClues} 
            onToggleClues={() => duel.setShowClues(!duel.showClues)} 
            onResolve={duel.resolveCurrent} 
            onCancel={() => duel.setCurrentChallenge(null)} 
          />
        )}
      </main>
    </div>
  );
}