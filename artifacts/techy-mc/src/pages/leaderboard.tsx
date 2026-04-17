import { useState } from "react";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, Swords, Skull, Clock, Coins, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { GetLeaderboardType } from "@workspace/api-client-react";

export default function Leaderboard() {
  const [type, setType] = useState<GetLeaderboardType>("money");
  const { data: leaderboard, isLoading } = useGetLeaderboard({ type, limit: 50 });

  const getIcon = (type: string) => {
    switch(type) {
      case 'kills': return <Swords className="w-4 h-4 mr-2" />;
      case 'deaths': return <Skull className="w-4 h-4 mr-2" />;
      case 'playtime': return <Clock className="w-4 h-4 mr-2" />;
      case 'votes': return <Award className="w-4 h-4 mr-2" />;
      case 'money': return <Coins className="w-4 h-4 mr-2" />;
      default: return <Trophy className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/50 glow-box">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          Hall of Fame
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The most dedicated and powerful players on techy Network.
        </p>
      </div>

      <Tabs defaultValue="money" onValueChange={(v) => setType(v as GetLeaderboardType)} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8 bg-card border border-border h-auto p-1">
          <TabsTrigger value="money" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Coins className="w-4 h-4 mr-2 hidden sm:block" /> Wealth
          </TabsTrigger>
          <TabsTrigger value="kills" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Swords className="w-4 h-4 mr-2 hidden sm:block" /> Kills
          </TabsTrigger>
          <TabsTrigger value="deaths" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Skull className="w-4 h-4 mr-2 hidden sm:block" /> Deaths
          </TabsTrigger>
          <TabsTrigger value="playtime" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="w-4 h-4 mr-2 hidden sm:block" /> Playtime
          </TabsTrigger>
          <TabsTrigger value="votes" className="py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Award className="w-4 h-4 mr-2 hidden sm:block" /> Votes
          </TabsTrigger>
        </TabsList>

        <Card className="bg-card border-border overflow-hidden glow-box">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs w-24">Rank</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Player</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-8" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-24 ml-auto" /></td>
                    </tr>
                  ))
                ) : leaderboard?.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                      No records found for this category.
                    </td>
                  </tr>
                ) : (
                  leaderboard?.map((entry) => (
                    <tr key={`${entry.rank}-${entry.playerName}`} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center font-bold font-display
                          ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 glow-box' : 
                            entry.rank === 2 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/50' : 
                            entry.rank === 3 ? 'bg-orange-600/20 text-orange-600 border border-orange-600/50' : 
                            'bg-secondary text-muted-foreground'}
                        `}>
                          {entry.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground flex items-center gap-3">
                        <img 
                          src={`https://minotar.net/helm/${entry.playerName}/32.png`} 
                          alt="" 
                          className="w-8 h-8 rounded bg-background"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className={entry.rank <= 3 ? "text-lg glow-text" : ""}>{entry.playerName}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-primary text-lg">
                        {entry.displayValue}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Tabs>
    </div>
  );
}