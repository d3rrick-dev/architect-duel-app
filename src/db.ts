import Dexie, { type Table } from 'dexie';

export interface Challenge {
  id?: number;
  title: string;
  system: string;
  symptom: string;
  chaosFactor: string;
  solutionClues: string[];
  level: 'Senior' | 'Staff' | 'Principal';
}

export class ArchitectDatabase extends Dexie {
  challenges!: Table<Challenge>;

  constructor() {
    super('ArchitectDuelDB');
    this.version(1).stores({
      challenges: '++id, level, system' 
    });
  }
}

export const db = new ArchitectDatabase();