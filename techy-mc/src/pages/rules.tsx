import { useListRules } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, AlertTriangle, ShieldAlert, Gavel } from "lucide-react";

export default function Rules() {
  const { data: rules, isLoading } = useListRules();

  // Group rules by category
  const rulesByCategory = rules?.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, typeof rules>);

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'minor': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'moderate': return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      case 'major': return <Gavel className="w-4 h-4 text-red-500" />;
      case 'permanent': return <Gavel className="w-4 h-4 text-destructive animate-pulse" />;
      default: return null;
    }
  };

  const getSeverityText = (severity: string) => {
    switch(severity) {
      case 'minor': return <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider">Warning / Kick</span>;
      case 'moderate': return <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">Temp Ban (1-7 Days)</span>;
      case 'major': return <span className="text-red-500 text-xs font-bold uppercase tracking-wider">Temp Ban (30 Days)</span>;
      case 'permanent': return <span className="text-destructive text-xs font-bold uppercase tracking-wider">Permanent Ban</span>;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/50 glow-box">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          The Codex
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          To maintain an elite gaming environment, all players must adhere to these rules. 
          Ignorance is not an excuse.
        </p>
      </div>

      <div className="space-y-8">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : Object.keys(rulesByCategory || {}).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card/50">
            No rules have been established yet. Behave yourself!
          </div>
        ) : (
          Object.entries(rulesByCategory || {}).map(([category, categoryRules]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-foreground border-b border-border pb-2 capitalize">
                {category} Rules
              </h2>
              <div className="grid gap-4">
                {categoryRules.sort((a, b) => a.order - b.order).map((rule, index) => (
                  <Card key={rule.id} className="bg-card/50 border-border hover:bg-card transition-colors">
                    <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="text-3xl font-display text-primary/30 font-bold shrink-0">
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-foreground">{rule.title}</h3>
                          <div className="flex items-center gap-1.5 ml-auto bg-background px-3 py-1 rounded-full border border-border">
                            {getSeverityIcon(rule.severity)}
                            {getSeverityText(rule.severity)}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {rule.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 p-6 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
        <h3 className="text-lg font-bold text-destructive mb-2">Rule Enforcement</h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Staff members reserve the right to interpret these rules and apply punishments at their discretion. 
          Attempting to bypass rules using loopholes will result in harsher punishments.
        </p>
      </div>
    </div>
  );
}