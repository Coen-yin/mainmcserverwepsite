import { useListAnnouncements } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Pin } from "lucide-react";

export default function Announcements() {
  const { data: announcementsData, isLoading } = useListAnnouncements({ limit: 50 });

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'important': return 'bg-destructive/20 text-destructive border-destructive/50';
      case 'update': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'event': return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      default: return 'bg-primary/20 text-primary border-primary/50';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          Server Transmissions
        </h1>
        <p className="text-muted-foreground text-lg">
          Latest news, updates, and events from the techy Network team.
        </p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/4 mb-4" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : announcementsData?.announcements.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card/50">
            No announcements found. Check back later!
          </div>
        ) : (
          announcementsData?.announcements.map((announcement) => (
            <Card 
              key={announcement.id} 
              className={`bg-card border-border ${announcement.pinned ? 'border-primary/50 glow-box' : ''}`}
            >
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {announcement.pinned && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary flex items-center gap-1">
                      <Pin className="w-3 h-3" /> Pinned
                    </Badge>
                  )}
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${getTypeColor(announcement.type)}`}>
                    {announcement.type}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground gap-1 ml-auto">
                    <Calendar className="w-4 h-4" />
                    {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-foreground">{announcement.title}</h2>
                
                <div className="prose prose-invert max-w-none text-muted-foreground mb-6 whitespace-pre-wrap">
                  {announcement.content}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center border border-border">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Posted by</div>
                    <div className="text-sm font-bold text-primary">{announcement.authorName}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}