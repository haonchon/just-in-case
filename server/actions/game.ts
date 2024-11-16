"use server";

import { db } from "@/server/db/db";
import { rooms, players } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { startGame, eliminatePlayer ,addVote} from "@/utils/gameLogic";

export async function handleAddVote(roomId: string, playerId: string,currentPlayerId:string) {
  try {
    console.log("roomId",roomId,"playerId",playerId,"currentPlayerId",currentPlayerId);
    await addVote(roomId, playerId,currentPlayerId);
    return { success: true };
  } catch (error) {
    console.error("Failed to add vote:", error);
    return { success: false, error: "Failed to add vote" };
  }
}
export async function handleStartGame(roomId: string) {
  try {
    await startGame(roomId);
    return { success: true };
  } catch (error) {
    console.error("Failed to start game:", error);
    return { success: false, error: "Failed to start game" };
  }
}

export async function handleEliminatePlayer(roomId: string, playerId: string) {
  try {
    await eliminatePlayer(roomId, playerId);
    return { success: true };
  } catch (error) {
    console.error("Failed to eliminate player:", error);
    return { success: false, error: "Failed to eliminate player" };
  }
}

export async function getRoomState(roomId: string) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: true,
      rounds: {
        orderBy: (rounds, { desc }) => [desc(rounds.roundNumber)],
      },
    },
  });
  return room;
}