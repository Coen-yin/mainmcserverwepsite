import { useState } from "react";
import { useListAppeals, useCreateAppeal } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/react";
import { FileWarning, CheckCircle, XCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Appeals() {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const { data: appealsData, refetch, isLoading } = useListAppeals();
  const createAppeal = useCreateAppeal();

  const [playerName, setPlayerName] = useState("");
  const [reason, setReason] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast({ title: "You must be signed in to submit an appeal", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    createAppeal.mutate({
      data: { playerName, reason, explanation }
    }, {
      onSuccess: () => {
        toast({ title: "Appeal submitted successfully" });
        setPlayerName("");
        setReason("");
        setExplanation("");
        refetch();
      },
      onError: () => {
        toast({ title: "Failed to submit appeal", variant: "destructive" });
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-destructive" />;
      default: return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          Ban Appeals
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          If you believe you were unfairly banned, you can submit an appeal here. Be honest, detailed, and respectful.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <Card className="bg-card border-border glow-box h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-display">Submit New Appeal</CardTitle>
            </CardHeader>
            <CardContent>
              {!isSignedIn ? (
                <div className="p-6 bg-muted/50 border border-border rounded-lg text-center">
                  <FileWarning className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-bold mb-2">Authentication Required</h3>
                  <p className="text-sm text-muted-foreground">You must sign in to submit a ban appeal.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="playerName">Minecraft Username</Label>
                    <Input 
                      id="playerName" 
                      placeholder="Your exact in-game name" 
                      required
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Ban Reason</Label>
                    <Input 
                      id="reason" 
                      placeholder="What does the ban screen say?" 
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="explanation">Your Explanation</Label>
                    <Textarea 
                      id="explanation" 
                      placeholder="Explain what happened and why you should be unbanned..." 
                      className="min-h-[150px]"
                      required
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Appeal"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Your Appeals</h2>
          
          {isLoading ? (
            Array(2).fill(0).map((_, i) => (
              <Card key={i} className="bg-card/50 border-border">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : (!appealsData?.appeals || appealsData.appeals.length === 0) ? (
            <div className="p-8 text-center border border-border bg-card/50 rounded-lg text-muted-foreground">
              You haven't submitted any appeals.
            </div>
          ) : (
            appealsData.appeals.map((appeal) => (
              <Card key={appeal.id} className="bg-card border-border">
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Appeal for {appeal.playerName}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(appeal.status)}
                      <span className="text-sm font-bold uppercase tracking-wider capitalize">
                        {appeal.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Submitted on {new Date(appeal.createdAt).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Ban Reason</span>
                    <p className="text-sm mt-1">{appeal.reason}</p>
                  </div>
                  {appeal.adminNote && (
                    <div className="bg-muted p-3 rounded border border-border">
                      <span className="text-xs font-bold uppercase text-primary tracking-wider">Admin Response</span>
                      <p className="text-sm mt-1">{appeal.adminNote}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}