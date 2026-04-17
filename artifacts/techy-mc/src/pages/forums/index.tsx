import { useListForumCategories, useGetForumStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { MessageSquare, Users, Activity, MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForumsIndex() {
  const { data: categories, isLoading: catsLoading } = useListForumCategories();
  const { data: stats, isLoading: statsLoading } = useGetForumStats();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-primary mb-2 glow-text uppercase tracking-wider">
          Community Forums
        </h1>
        <p className="text-muted-foreground text-lg">
          Join the discussion with other players.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {catsLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                </CardContent>
              </Card>
            ))
          ) : categories?.length === 0 ? (
            <div className="p-12 text-center border border-border bg-card/50 rounded-lg text-muted-foreground">
              No categories found.
            </div>
          ) : (
            categories?.map((category) => (
              <Card key={category.id} className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="p-6 flex-1 flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <Link href={`/forums/category/${category.id}`}>
                        <h2 className="text-xl font-bold font-display hover:text-primary transition-colors cursor-pointer inline-block mb-1">
                          {category.name}
                        </h2>
                      </Link>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 border-t md:border-t-0 md:border-l border-border p-4 md:p-6 md:w-64 flex flex-row md:flex-col justify-between md:justify-center items-center text-center gap-4">
                    <div className="flex flex-row md:flex-col gap-4 md:gap-1 w-full justify-around md:justify-center">
                      <div>
                        <div className="font-mono font-bold text-lg">{category.threadCount}</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Threads</div>
                      </div>
                      <div>
                        <div className="font-mono font-bold text-lg">{category.postCount}</div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Messages</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border glow-box">
            <CardHeader className="pb-4 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Forum Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {statsLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Threads
                    </span>
                    <span className="font-mono font-bold">{stats?.totalThreads || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Posts
                    </span>
                    <span className="font-mono font-bold">{stats?.totalPosts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" /> Members
                    </span>
                    <span className="font-mono font-bold">{stats?.totalMembers || 0}</span>
                  </div>
                  {stats?.newestMember && (
                    <div className="pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">Newest Member</span>
                      <span className="text-sm font-medium text-primary">{stats.newestMember}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}