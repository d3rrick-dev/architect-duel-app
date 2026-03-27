import Dexie, { type Table } from 'dexie';

export interface Challenge {
  id?: number;
  title: string;
  category: 'System' | 'Frontend' | 'Security' | 'DevOps' | 'AI';  
  subTopic: string;
  system: string; 
  symptom: string;
  chaosFactor: string;
  solutionClues: string[];
  level: 'Senior';
  isResolved?: boolean;
}

export class ArchitectDatabase extends Dexie {
  challenges!: Table<Challenge>;

  constructor() {
    super('ArchitectDuelDB');
    this.version(1).stores({
      challenges: '++id, category, level, isResolved, subTopic' 
    });
  }
}

export const db = new ArchitectDatabase();