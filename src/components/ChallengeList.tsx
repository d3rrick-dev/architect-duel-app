import { Search, Zap, Target, ChevronRight } from "lucide-react";
import type { Challenge } from "../db";

interface ChallengeListProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
  categories: readonly string[];
  filteredChallenges: Challenge[];
  onSelect: (c: Challenge) => void;
  onNext: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const ChallengeList = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
  filteredChallenges,
  onSelect,
  onNext,
  onKeyDown,
}: ChallengeListProps) => {

  // Handle the form submission (covers mobile 'Search' button and desktop 'Enter')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // CRITICAL: Prevents the page refresh
    
    if (searchQuery.trim() !== "" && filteredChallenges.length > 0) {
      onSelect(filteredChallenges[0]);
    } else {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Wrapped in a form for proper mobile behavior */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors"
            size={16}
          />
          <input
            type="text"
            inputMode="search" // Forces 'Search' keyboard on mobile
            enterKeyHint="search" // Labels the enter key as 'Search'
            placeholder="Find anomaly... (Enter to start)"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 text-slate-200 transition-all"
            value={searchQuery}
            onKeyDown={onKeyDown}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            autoComplete="off"
          />
        </div>
        <button
          type="submit" // Allows the button to trigger the form submit
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-4 rounded-xl font-black text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Zap size={16} fill="currentColor" /> NEXT
        </button>
      </form>

      {/* Categories Row */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button" // Explicitly mark as button to avoid form submission
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? "bg-emerald-500 text-slate-950 border-emerald-500"
                : "border-slate-800 text-slate-500 hover:border-slate-600"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 gap-2 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((c) => (
            <button
              key={c.id}
              type="button" // Important: Don't submit form when selecting an item
              onClick={() => onSelect(c)}
              className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all group cursor-pointer text-left ${
                c.isResolved
                  ? "bg-slate-900/30 border-slate-900 opacity-60"
                  : "bg-slate-900 border-slate-800 hover:border-emerald-500/50"
              }`}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Target
                    size={12}
                    className={
                      c.isResolved ? "text-emerald-500" : "text-slate-600"
                    }
                  />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">
                    {c.title}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 uppercase pl-5 tracking-widest">
                  {c.category} // {c.subTopic}
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-700 group-hover:text-emerald-500"
              />
            </button>
          ))
        ) : (
          <p className="text-center py-20 text-slate-600 text-sm">
            No matching anomalies found.
          </p>
        )}
      </div>
    </div>
  );
};