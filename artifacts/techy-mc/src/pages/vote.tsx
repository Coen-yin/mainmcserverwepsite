import { useListVoteSites, useRecordVote } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, Check, Clock, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/react";

export default function Vote() {
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const { data: voteData, isLoading, refetch } = useListVoteSites();
  const recordVote = useRecordVote();

  const handleVote = (siteId: number, url: string) => {
    if (!isSignedIn) {
      toast({ title: "Please sign in to earn rewards", variant: "default" });
      window.open(url, "_blank");
      return;
    }

    window.open(url, "_blank");
    
    // Optimistically record vote after a short delay
    setTimeout(() => {
      recordVote.mutate({ data: { siteId } }, {
        onSuccess: () => {
          toast({ title: "Vote recorded!", description: "Rewards have been sent to your account in-game." });
          refetch();
        }
      });
    }, 5000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/50 glow-box">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          Support The Server
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Vote daily to help us grow and earn exclusive in-game rewards, keys, and ranks!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-card border-border glow-box col-span-1 md:col-span-3 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Your Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-muted-foreground">Votes Today</span>
              <span className="font-mono text-xl text-primary font-bold">{voteData?.totalVotesToday || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-mono text-xl text-primary font-bold">{voteData?.myVotesThisMonth || 0}</span>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-3 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="bg-card/50 border-border">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-6" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            voteData?.sites.map((site) => (
              <Card key={site.id} className={`bg-card border-border transition-all ${site.canVote ? 'hover:border-primary/50 glow-box' : 'opacity-70'}`}>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-1">{site.name}</h3>
                  <p className="text-sm text-primary mb-6">Reward: {site.reward}</p>
                  
                  <Button 
                    onClick={() => handleVote(site.id, site.url)}
                    className="w-full"
                    variant={site.canVote ? "default" : "secondary"}
                    disabled={!site.canVote}
                  >
                    {site.canVote ? (
                      <>
                        Vote Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Cooldown ({site.cooldownHours}h)
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}