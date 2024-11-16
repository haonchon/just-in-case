import { db } from "@/server/db/db";
import { players, rooms, rounds, Votes } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function addVote(
  roomId: string,
  currentPlayerId: string,
  playerId: string
) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: true,
    },
  });

  if (!room) throw new Error("Room not found");

  if (currentPlayerId === playerId) {
    throw new Error("You cannot vote for yourself");
  }

  const roomVotes = room.votes || {}; // Use empty object if votes are undefined

  // Initialize votes for the current round if not already set
  if (
    Object.keys(roomVotes).length === 0 ||
    room.currentRound > Object.values(roomVotes)[0]?.round
  ) {
    room.players.forEach((player) => {
      roomVotes[player.id] = { round: room.currentRound, vote: 0 };
    });
  }

  if (!roomVotes[playerId]) {
    throw new Error("Invalid player ID for voting");
  }

  // Increment the vote count for the specified player
  roomVotes[playerId].vote += 1;

  // Update the votes in the room record
  await db.update(rooms).set({ votes: roomVotes }).where(eq(rooms.id, roomId));

  // Check if all votes have been cast (assuming one vote per player per round)
  const totalVotes = Object.values(roomVotes).reduce(
    (sum, { vote }) => sum + vote,
    0
  );

  if (totalVotes >= room.players.length) {
    // Determine the player with the highest votes
    const playerToEliminate = Object.entries(roomVotes).reduce(
      (highest, [id, voteData]) =>
        voteData.vote > highest.vote ? { id, vote: voteData.vote } : highest,
      { id: "", vote: 0 }
    ).id;

    if (playerToEliminate) {
      await eliminatePlayer(roomId, playerToEliminate);

      // Reset votes for the next round
      const resetVotes: Votes = {};
      room.players
        .filter((player) => player.id !== playerToEliminate)
        .forEach((player) => {
          resetVotes[player.id] = { round: room.currentRound + 1, vote: 0 };
        });

      await db.update(rooms).set({ votes: resetVotes }).where(eq(rooms.id, roomId));
    }
  }
}
export async function startGame(roomId: string) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: true,
    },
  });

  if (!room || room.players.length !== 4) {
    throw new Error("Invalid room state");
  }

  // Randomly select initial capital holder
  const randomPlayer =
    room.players[Math.floor(Math.random() * room.players.length)];

  // Update room and player states
  await db.transaction(async (tx) => {
    await tx
      .update(rooms)
      .set({
        gameStatus: "ongoing",
        currentRound: 1,
        currentCapitalHolderId: randomPlayer.id,
      })
      .where(eq(rooms.id, roomId));

    await tx
      .update(players)
      .set({ hasCapital: true })
      .where(eq(players.id, randomPlayer.id));
    await tx.update(players)
      .set({ playerStatus: "active" })
      .where(eq(players.roomId, roomId));

    await tx.insert(rounds).values({
      roomId: roomId,
      roundNumber: 1,
      capitalHolderId: randomPlayer.id,
    });
  });
}

export async function eliminatePlayer(roomId: string, playerId: string) {
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      players: {
        where: eq(players.playerStatus, "active"),
      },
    },
  });

  if (!room) throw new Error("Room not found");

  const eliminatedPlayer = room.players.find((p) => p.id === playerId);
  if (!eliminatedPlayer) throw new Error("Player not found");

  await db.transaction(async (tx) => {
    // Update player status
    await tx
      .update(players)
      .set({
        playerStatus: eliminatedPlayer.hasCapital ? "winner" : "idle",
        eliminatedInRound: room.currentRound,
      })
      .where(eq(players.id, playerId));

    // If player had capital and was eliminated, they win
    if (eliminatedPlayer.hasCapital) {
      await tx
        .update(rooms)
        .set({
          gameStatus: "ended",
          winnerId: playerId,
        })
        .where(eq(rooms.id, roomId));
      return;
    }

    // If only one player remains, they win
    if (room.players.length <= 2) {
      const winner = room.players.find((p) => p.id !== playerId);
      if (winner) {
        await tx
          .update(rooms)
          .set({
            gameStatus: "ended",
            winnerId: winner.id,
          })
          .where(eq(rooms.id, roomId));
        return;
      }
    }

    // Start next round
    const remainingPlayers = room.players.filter((p) => p.id !== playerId);
    const newCapitalHolder =
      remainingPlayers[Math.floor(Math.random() * remainingPlayers.length)];

    // Update round
    await tx
      .update(rounds)
      .set({
        completed: true,
        eliminatedPlayerId: playerId,
      })
      .where(
        and(
          eq(rounds.roomId, roomId),
          eq(rounds.roundNumber, room.currentRound)
        )
      );

    // Create new round
    await tx.insert(rounds).values({
      roomId: roomId,
      roundNumber: room.currentRound + 1,
      capitalHolderId: newCapitalHolder.id,
    });

    // Update room state
    await tx
      .update(rooms)
      .set({
        currentRound: room.currentRound + 1,
        currentCapitalHolderId: newCapitalHolder.id,
      })
      .where(eq(rooms.id, roomId));

    // Reset capital holder
    await tx
      .update(players)
      .set({ hasCapital: false })
      .where(eq(players.roomId, roomId));

    await tx
      .update(players)
      .set({ hasCapital: true })
      .where(eq(players.id, newCapitalHolder.id));
  });
}
