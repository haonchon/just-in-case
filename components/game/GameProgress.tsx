import { PairsWithPlayerAndCaseHolder } from "@/server/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Trophy, Eye } from "lucide-react"
import { useSession } from "next-auth/react"

interface GameProgressProps {
  currentRound: number
  totalRounds: number
  pairs: PairsWithPlayerAndCaseHolder[]
  isLoading?: boolean
}

export default function GameProgress({ currentRound, totalRounds, pairs, isLoading }: GameProgressProps) {
  const session = useSession()
  
  // Group pairs by round
  const pairsByRound = pairs.reduce((acc, pair) => {
    const round = pair.roundId
    if (!acc[round]) {
      acc[round] = []
    }
    acc[round].push(pair)
    return acc
  }, {} as Record<number, PairsWithPlayerAndCaseHolder[]>)

  const isUserInPair = (pair: PairsWithPlayerAndCaseHolder) => {
    return pair.player1?.id === session.data?.user.id || 
           pair.player2?.id === session.data?.user.id
  }

  const getUserStatus = (pair: PairsWithPlayerAndCaseHolder) => {
    if (pair.pairStatus === 'ongoing') {
      if (isUserInPair(pair)) {
        return <span className="text-sm font-medium text-blue-600">(Your Turn)</span>
      }
      return <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
        <Eye className="w-4 h-4" />
        (Spectating)
      </span>
    }
    return null
  }

  const formatPlayerName = (playerId: string | undefined, playerName: string | undefined) => {
    if (playerId === session.data?.user.id) {
      return <span className="font-medium text-blue-600">{playerName} (You)</span>
    }
    return playerName
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tournament Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tournament Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(pairsByRound).map(([round, roundPairs]) => (
            <div key={round} className="mb-8 last:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Round {round}</h3>
                {currentRound === Number(round) && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Current Round
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {roundPairs.map((pair) => (
                  <div 
                    key={pair.id} 
                    className={`p-4 rounded-lg border ${
                      pair.pairStatus === 'ongoing' 
                        ? 'border-blue-500 bg-blue-50' 
                        : pair.pairStatus === 'ended'
                        ? 'border-gray-200 bg-gray-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center flex-wrap">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{formatPlayerName(pair.player1?.id, pair.player1?.name)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>vs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{formatPlayerName(pair.player2?.id, pair.player2?.name)}</span>
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>{getUserStatus(pair)}</div>
                        {pair.winnerId && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Winner: {formatPlayerName(
                                pair.winnerId,
                                pair.winnerId === pair.player1?.id 
                                  ? pair.player1?.name 
                                  : pair.player2?.name
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}