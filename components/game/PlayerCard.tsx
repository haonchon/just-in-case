interface PlayerCardProps {
    player: {
      id: string;
      name: string;
      hasCapital: boolean;
      playerStatus: string;
    };
    onEliminate?: (playerId: string) => void;
    isGameActive: boolean;
  }
  
  export function PlayerCard({ player, onEliminate, isGameActive }: PlayerCardProps) {
    return (
      <div
        className={`p-4 rounded-lg border ${
          player.hasCapital ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
        } ${player.playerStatus === "eliminated" ? "opacity-50" : ""}`}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{player.name}</h3>
            <p className="text-sm text-gray-600">Status: {player.playerStatus}</p>
            {player.hasCapital && (
              <span className="text-yellow-600 text-sm">Has Capital 💰</span>
            )}
          </div>
          {isGameActive && player.playerStatus === "active" && onEliminate && (
            <button
              onClick={() => onEliminate(player.id)}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Eliminate
            </button>
          )}
        </div>
      </div>
    );
  }