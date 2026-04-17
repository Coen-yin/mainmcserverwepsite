import { useState } from "react";
import { useGetForumThread, useCreateForumPost } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link, useRoute } from "wouter";
import { MessageSquare, Pin, Lock, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/react";
import { useToast } from "@/hooks/use-toast";

export default function Thread() {
  const [, params] = useRoute("/forums/thread/:threadId");
  const threadId = params?.threadId ? parseInt(params.threadId) : 0;
  
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  
  const { data: threadData, isLoading, refetch } = useGetForumThread(threadId.toString(), {
    query: { enabled: !!threadId }
  });
  
  const createPost = useCreateForumPost();
  const [replyContent, setReplyContent] = useState("");

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast({ title: "Must be signed in to reply", variant: "destructive" });
      return;
    }
    if (!replyContent.trim()) return;

    createPost.mutate({
      data: { content: replyContent }
    }, {
      onSuccess: () => {
        toast({ title: "Reply posted" });
        setReplyContent("");
        refetch();
      },
      onError: () => {
        toast({ title: "Failed to post reply", variant: "destructive" });
      }
    });
  };

  const getRankBadge = (rank: string | undefined) => {
    if (!rank) return null;
    const rankColors: Record<string, string> = {
      player: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      vip: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
      mvp: "bg-cyan-500/20 text-cyan-500 border-cyan-500/50",
      moderator: "bg-blue-500/20 text-blue-500 border-blue-500/50",
      admin: "bg-red-500/20 text-red-500 border-red-500/50",
      owner: "bg-purple-500/20 text-purple-500 border-purple-500/50 glow-box"
    };
    
    return (
      <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border mt-1 inline-block ${rankColors[rank] || rankColors.player}`}>
        {rank}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Card className="bg-card border-border"><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (!threadData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        Thread not found.
      </div>
    );
  }

  const { thread, posts } = threadData;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2 font-bold uppercase tracking-wider">
          <Link href="/forums" className="hover:text-primary transition-colors">Forums</Link>
          <span>/</span>
          <Link href={`/forums/category/${thread.categoryId}`} className="hover:text-primary transition-colors">{thread.categoryName || "Category"}</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px] sm:max-w-xs">{thread.title}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            {thread.isLocked && <Lock className="w-6 h-6 text-destructive" />}
            {thread.isPinned && <Pin className="w-6 h-6 text-primary" />}
            {thread.title}
          </h1>
          <div className="text-sm text-muted-foreground font-mono bg-card px-3 py-1 rounded border border-border">
            {new Date(thread.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-12">
        {posts.map((post, index) => (
          <Card key={post.id} className="bg-card border-border overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Author Sidebar */}
              <div className="w-full sm:w-48 sm:shrink-0 bg-muted/20 p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-border flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
                <img 
                  src={`https://minotar.net/helm/${post.authorName}/64.png`} 
                  alt="" 
                  className="w-16 h-16 rounded bg-background border-2 border-border"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div>
                  <div className="font-bold text-lg text-foreground">{post.authorName}</div>
                  {getRankBadge(post.authorRank)}
                </div>
              </div>
              
              {/* Post Content */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 sm:px-6 sm:py-3 border-b border-border/50 text-xs text-muted-foreground flex justify-between">
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                  <span className="font-mono">#{index + 1}</span>
                </div>
                <div className="p-4 sm:p-6 prose prose-invert max-w-none whitespace-pre-wrap">
                  {post.content}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {thread.isLocked ? (
        <div className="p-6 bg-destructive/10 border border-destructive/30 rounded-lg text-center text-destructive flex items-center justify-center gap-2 font-bold">
          <Lock className="w-5 h-5" /> This thread has been locked by a moderator.
        </div>
      ) : isSignedIn ? (
        <Card className="bg-card border-border glow-box">
          <CardHeader>
            <CardTitle className="text-lg">Reply to Thread</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReply} className="space-y-4">
              <Textarea 
                placeholder="Write your reply..." 
                className="min-h-[150px] bg-background border-border"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8" disabled={createPost.isPending}>
                  {createPost.isPending ? "Posting..." : "Post Reply"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="p-8 text-center border border-border bg-card rounded-lg">
          <p className="text-muted-foreground mb-4">You must be signed in to reply to this thread.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      )}
    </div>
  );
}