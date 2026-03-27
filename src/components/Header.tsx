import { Terminal } from "lucide-react";

interface HeaderProps {
  resolvedCount: number;
  totalCount: number;
  onReset: () => void;
}

export const Header = ({ resolvedCount, totalCount, onReset }: HeaderProps) => (
  <header className="max-w-2xl mx-auto mb-8 flex justify-between items-end border-b border-slate-800 pb-4">
    <div>
      <h1 className="text-xl font-bold flex items-center gap-2 text-white">
        <Terminal className="text-emerald-400" size={24} /> ARCHITECT DUEL
      </h1>
      <div className="flex gap-4 items-center mt-1">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest">
          Mastery: {resolvedCount} / {totalCount}
        </p>
        <button
          onClick={onReset}
          className="text-[9px] text-red-500/30 hover:text-red-500 font-bold uppercase cursor-pointer transition-colors"
        >
          [ Reset Logs ]
        </button>
      </div>
    </div>
    <div className="flex flex-col items-end gap-1">
      <div className="h-1.5 w-24 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-1000 ease-in-out"
          style={{ width: `${(resolvedCount / (totalCount || 1)) * 100}%` }}
        />
      </div>
      <span className="text-[8px] text-emerald-500/40 uppercase font-black">
        Link Active
      </span>
    </div>
  </header>
);
