import { GameConfig } from "@/types/game";

export const GAME_CONFIG: GameConfig = {
  PLAYERS_PER_ROOM: 4 as const, // Can be changed to 2, 4, or 8
  ROUNDS_MAP: {
    2: 1,
    4: 2,
    8: 3
  }
}; 