export function GameInstructions() {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Game starts with 4 players</li>
          <li>One player randomly receives the capital</li>
          <li>Each round, one player must be eliminated</li>
          <li>If the eliminated player has the capital, they win!</li>
          <li>If not, capital is randomly reassigned to remaining players</li>
          <li>Game continues until someone wins</li>
        </ul>
      </div>
    );
  }