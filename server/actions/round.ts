"use server";

import { db } from "@/server/db/db";
import {  players, rooms } from "@/server/db/schema";
import { PlayerStatus } from "@/types/game";
import { processPairResult, startGame } from "@/utils/gameLogic";
import { eq } from "drizzle-orm";
import { GAME_CONFIG } from "@/config/gameConfig";



export async function getRoom({ roomId }: { roomId: string }) {
  console.log(roomId, "roomId");
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      winner: true,
      players: true,
      pairs: {
        with: {
          caseHolder: true,
          player1: true,
          player2: true,
        },
      },
    },
  });
  console.log(room, "room");
  return room;
}

export async function joinRoom(roomId: string, playerId: string) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: true,
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.players.length >= GAME_CONFIG.PLAYERS_PER_ROOM) {
    throw new Error("Room is full");
  }

  // Update player
  await db
    .update(players)
    .set({
      roomId: room.id,
      playerStatus: PlayerStatus.ACTIVE,
    })
    .where(eq(players.id, playerId));

  // Start game if room is full
  if (room.players.length === GAME_CONFIG.PLAYERS_PER_ROOM - 1) {
    await startGame(room.id);
  }

  // Fetch updated room data
  const updatedRoom = await getRoom({ roomId });
  return updatedRoom;
}

export async function makeDecision(pairId: string, takeCase: boolean) {
  await processPairResult(pairId, takeCase);
  return pairId;
}

