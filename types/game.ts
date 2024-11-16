import { PairSelect, PairsWithPlayerAndCaseHolder } from "@/server/db/schema";



export enum GameStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  ENDED = 'ended'
}

export enum PlayerStatus {
  ACTIVE = 'active',
  IDLE = 'idle'
}

export enum CaseType {
  SAFE = 'SAFE',
  ELIMINATE = 'ELIMINATE'
}

// Add these new types
export type PlayerCount = 2 | 4 | 8;

export type RoundsMap = {
  [key in PlayerCount]: number;
};

export interface GameConfig {
  PLAYERS_PER_ROOM: PlayerCount;
  ROUNDS_MAP: RoundsMap;
} 