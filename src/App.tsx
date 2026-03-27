import { useState, useEffect } from 'react';
import { db, type Challenge } from './db';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, Terminal, CheckCircle, Lightbulb, Zap } from 'lucide-react';

export default function App() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [showClues, setShowClues] = useState(false);
  const challenges = useLiveQuery(() => db.challenges.toArray());

  useEffect(() => {
    const seed = async () => {
      const count = await db.challenges.count();
      if (count > 0) return;

      await db.challenges.bulkAdd([
        {
          title: "The S3 Ghost Outage",
          system: "Cloud Storage / Asset Pipeline",
          symptom: "Images are 404ing globally, but the S3 dashboard shows 'Service Operational'.",
          chaosFactor: "An accidental lifecycle policy applied a 'delete-marker' to the root bucket.",
          solutionClues: ["Check Versioning", "Audit Lifecycle Policies", "IAM Permission drift"],
          level: "Staff"
        },
        {
          title: "The Partitioned Leader",
          system: "Etcd / Kubernetes Control Plane",
          symptom: "K8s API is unresponsive. Nodes are flapping between Ready and NotReady.",
          chaosFactor: "Network latency between master nodes exceeded the Raft heartbeat timeout.",
          solutionClues: ["Quorum checks", "Etcd Peer Latency", "Network Partitions"],
          level: "Principal"
        },
        {
          title: "The Postgres Connection Exhaustion",
          system: "Relational DB / Serverless",
          symptom: "DB CPU is at 10%, but the API throws 'Could not connect' errors.",
          chaosFactor: "Lambda scaling rapidly without a connection bouncer like PgBouncer.",
          solutionClues: ["Connection Pooling", "Zombie connections", "Max_connections limits"],
          level: "Senior"
        },
        {
          title: "The Redis OOM Panic",
          system: "Caching Layer",
          symptom: "Writes fail with 'OOM command not allowed'. Eviction is not happening.",
          chaosFactor: "The 'maxmemory-policy' was set to 'noeviction' for a volatile cache.",
          level: "Senior",
          solutionClues: ["Allkeys-lru vs Noeviction", "TTL Analysis", "Memory Fragmentation"]
        }
      ]);
    };
    seed();
  }, []);

  const triggerDuel = () => {
    if (!challenges || challenges.length === 0) return;
    const random = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge(random);
    setShowClues(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono selection:bg-emerald-500/30">
      <header className="mb-10 flex justify-between items-center border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Terminal className="text-emerald-400" size={30} /> ARCHITECT DUEL
        </h1>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Node_Online</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {!currentChallenge ? (
          <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-slate-800 rounded-3xl group hover:border-emerald-900/50 transition-colors">
            <p className="text-slate-500 mb-8 text-center px-6">System state: Nominal.<br/>Ready for architectural stress test?</p>
            <button 
              onClick={triggerDuel}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-4 rounded-full font-black text-lg transition-all active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.4)] cursor-pointer">
              INJECT CHAOS
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-red-950/10 border border-red-900/30 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle size={80} />
              </div>
              
              <div className="flex items-center gap-2 text-red-500 font-bold mb-4 text-xs tracking-widest uppercase">
                <Zap size={14} fill="currentColor" /> Incident Detected: {currentChallenge.level} Level
              </div>
              
              <h2 className="text-2xl font-bold mb-6 leading-tight">{currentChallenge.symptom}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block uppercase text-[10px] mb-1">Component</span>
                  <span className="font-semibold text-emerald-400">{currentChallenge.system}</span>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block uppercase text-[10px] mb-1">Context</span>
                  <span className="font-semibold text-slate-200">{currentChallenge.chaosFactor}</span>
                </div>
              </div>

              {showClues && (
                <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm animate-in slide-in-from-top-2">
                  <p className="font-bold mb-2 flex items-center gap-2"><Lightbulb size={14}/> Consultant Audit Clues:</p>
                  <ul className="list-disc pl-5 space-y-1 opacity-80">
                    {currentChallenge.solutionClues.map((clue, i) => <li key={i}>{clue}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setCurrentChallenge(null)}
                className="w-full py-4 bg-slate-100 text-slate-950 font-bold rounded-2xl hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> INCIDENT RESOLVED
              </button>
              
              <button 
                onClick={() => setShowClues(!showClues)}
                className="w-full py-3 text-slate-500 hover:text-slate-300 text-[11px] uppercase tracking-widest transition-colors"
              >
                {showClues ? "Hide Audit Clues" : "Request Consultant Clues"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}