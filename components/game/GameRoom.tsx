"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleStartGame, getRoomState, handleAddVote } from "@/server/actions/game";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { GameInstructions } from "./GameInstructions";

interface Player {
  id: string;
  name: string;
  hasCapital: boolean;
  playerStatus: "active" | "eliminated" | "winner";
}

interface GameRoomProps {
  roomId: string;
}

export default function GameRoom({ roomId }: GameRoomProps) {
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [votingDisabled, setVotingDisabled] = useState(false);
  const router = useRouter();
  const session = useSession();
  const currentUserId = session.data?.user?.id;

  const fetchRoomState = async () => {
    const updatedRoom = await getRoomState(roomId);
    if(!updatedRoom) {
      throw new Error("Room not found");
    }
    setRoom(updatedRoom);
    setLoading(false);
    
    // Check if current user has already voted this round
    if (updatedRoom.votes && currentUserId) {
      const userVote = updatedRoom.votes[currentUserId];
      setVotingDisabled(userVote?.round === updatedRoom.currentRound && userVote.vote > 0);
    } else {
      setVotingDisabled(false);
    }
  };

  useEffect(() => {
    fetchRoomState();
    const interval = setInterval(fetchRoomState, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handleStart = async () => {
    const result = await handleStartGame(roomId);
    if (result.success) {
      fetchRoomState();
    }
  };

  const handleVote = async (playerId: string) => {
    try {
      await handleAddVote(roomId, playerId,currentUserId ?? 
        "jsd"
      );
      setVotingDisabled(true);
      fetchRoomState();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <GameInstructions />
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Game Room: {roomId}</h1>
        <p className="text-gray-600">
          Status: {room.gameStatus} | Round: {room.currentRound}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {room.players.map((player: Player) => (
          <div
            key={player.id}
            className={`p-4 rounded-lg border ${
              player.hasCapital && player.id === currentUserId ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{player.name}</h3>
                <p className="text-sm text-gray-600">Status: {player.playerStatus}</p>
                {player.hasCapital && player.id === currentUserId && (
                  <span className="text-yellow-600 text-sm">Has Capital</span>
                )}
              </div>
              {room.gameStatus === "ongoing" && 
               player.playerStatus === "active" && 
               player.id !== currentUserId && (
                <Button
                  onClick={() => handleVote(player.id)}
                  variant="secondary"
                  size="sm"
                  disabled={votingDisabled}
                >
                  Vote
                </Button>
              )}
            </div>
            {room.votes && room.votes[player.id] && (
              <p className="text-sm text-gray-500 mt-2">
                Votes: {room.votes[player.id].vote}
              </p>
            )}
          </div>
        ))}
      </div>

      {room.gameStatus === "pending" && room.players.length === 4 && (
        <Button onClick={handleStart} className="w-full">
          Start Game
        </Button>
      )}

      {room.gameStatus === "ended" && (
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <h2 className="text-xl font-bold">Game Over!</h2>
          <p>
            Winner:{" "}
            {room.players.find((p: Player) => p.playerStatus === "winner")?.name}
          </p>
        </div>
      )}
    </div>
  );
}