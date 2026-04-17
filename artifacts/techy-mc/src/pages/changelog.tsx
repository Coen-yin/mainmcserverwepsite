import { useListChangelogs } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileCode2, Plus, PenLine, Trash2, Wrench } from "lucide-react";

export default function Changelog() {
  const { data: changelogData, isLoading } = useListChangelogs({ limit: 50 });

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'added': return { icon: <Plus className="w-4 h-4 text-green-500" />, color: "text-green-500" };
      case 'changed': return { icon: <PenLine className="w-4 h-4 text-blue-500" />, color: "text-blue-500" };
      case 'fixed': return { icon: <Wrench className="w-4 h-4 text-yellow-500" />, color: "text-yellow-500" };
      case 'removed': return { icon: <Trash2 className="w-4 h-4 text-red-500" />, color: "text-red-500" };
      default: return { icon: <Plus className="w-4 h-4 text-primary" />, color: "text-primary" };
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/50 glow-box">
          <FileCode2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          Changelog
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Track the evolution of techy Network. See what's new, changed, and fixed.
        </p>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                <div className="w-3 h-3 bg-muted rounded-full"></div>
              </div>
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border-border">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-6" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            </div>
          ))
        ) : changelogData?.changelogs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card/50 z-10 relative">
            No changelogs recorded yet.
          </div>
        ) : (
          changelogData?.changelogs.map((log) => (
            <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary/50 bg-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 glow-box z-10">
                <div className="w-3 h-3 bg-primary rounded-full glow-box"></div>
              </div>
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-border">
                    <h2 className="text-xl font-bold font-display text-primary">{log.version}</h2>
                    <span className="text-xs text-muted-foreground font-mono">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold mb-4">{log.title}</h3>
                  <ul className="space-y-3">
                    {log.changes.map((change, i) => {
                      const style = getTypeStyle(change.type);
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0 bg-secondary p-1 rounded border border-border">
                            {style.icon}
                          </div>
                          <div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${style.color} block mb-0.5`}>
                              {change.type}
                            </span>
                            <span className="text-sm text-muted-foreground block leading-snug">
                              {change.description}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}