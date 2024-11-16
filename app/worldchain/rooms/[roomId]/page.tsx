import GameRoom from "@/components/game/GameRoom";

export default async function RoomPage({
  params: { roomId },
}: {
  params: { roomId: string };
}) {

  return (
    <div>
      <GameRoom roomId={roomId}  />
    </div>
  );
}