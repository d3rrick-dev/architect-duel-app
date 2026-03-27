import { AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { type Challenge } from "../db";

interface ChallengeCardProps {
  challenge: Challenge;
  showClues: boolean;
  onToggleClues: () => void;
  onResolve: () => void;
  onCancel: () => void;
}

export const ChallengeCard = ({
  challenge,
  showClues,
  onToggleClues,
  onResolve,
  onCancel,
}: ChallengeCardProps) => (
  <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-300">
    <div className="bg-red-950/10 border border-red-900/30 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500 animate-pulse">
        <AlertTriangle size={100} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="bg-red-500/10 text-red-500 text-[9px] px-2 py-0.5 rounded border border-red-500/20 uppercase font-bold">
          {challenge.category}
        </span>
        <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
          {challenge.subTopic}
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-6 leading-tight text-white">
        {challenge.symptom}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailBox
          label="Tech Stack"
          value={challenge.system}
          color="text-emerald-400"
        />
        <DetailBox
          label="Root Context"
          value={challenge.chaosFactor}
          color="text-slate-200"
        />
      </div>

      {showClues && (
        <div className="mt-6 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-emerald-300 text-sm animate-in zoom-in-95">
          <p className="font-bold mb-3 flex items-center gap-2 text-[10px] uppercase tracking-widest">
            <Lightbulb size={14} /> Knowledge Retrieval:
          </p>
          <ul className="space-y-2 opacity-90">
            {challenge.solutionClues.map((clue, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-500">•</span> {clue}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="flex flex-col gap-3">
      <button
        onClick={onResolve}
        className="w-full py-4 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <CheckCircle size={18} /> CONFIRM RESOLUTION
      </button>
      <div className="flex gap-2">
        <button
          onClick={onToggleClues}
          className="flex-1 py-3 bg-slate-900 text-slate-400 hover:text-white rounded-xl text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-all"
        >
          {showClues ? "Hide Clues" : "Request Clues"}
        </button>
        <button
          onClick={onCancel}
          className="px-8 py-3 border border-slate-800 text-slate-500 hover:text-white rounded-xl text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-all"
        >
          Back
        </button>
      </div>
    </div>
  </div>
);

const DetailBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 shadow-inner">
    <span className="text-slate-600 block uppercase text-[9px] mb-1 font-black tracking-widest">
      {label}
    </span>
    <span className={`font-semibold text-xs leading-relaxed ${color}`}>
      {value}
    </span>
  </div>
);
