import { useState } from "react";
import { useListBans } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Gavel, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function Bans() {
  const [search, setSearch] = useState("");
  // In a real app we might debounce the search before triggering API call
  // Or handle filtering client side if the list is small. 
  // Let's just fetch standard list for now.
  const { data: bansData, isLoading } = useListBans({ limit: 50 });

  const filteredBans = bansData?.bans.filter(b => 
    b.playerName.toLowerCase().includes(search.toLowerCase()) || 
    b.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-destructive mb-2 glow-text uppercase tracking-wider">
            Ban Records
          </h1>
          <p className="text-muted-foreground text-lg">
            Public record of disciplined players.
          </p>
        </div>
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-10 bg-card border-border" 
            placeholder="Search player or reason..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Player</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Reason</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Banned By</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-48" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                  </tr>
                ))
              ) : filteredBans?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <ShieldAlert className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No ban records found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBans?.map((ban) => (
                  <tr key={ban.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground flex items-center gap-3">
                      <img 
                        src={`https://minotar.net/helm/${ban.playerName}/32.png`} 
                        alt="" 
                        className="w-8 h-8 rounded bg-background"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      {ban.playerName}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate" title={ban.reason}>
                      {ban.reason}
                    </td>
                    <td className="px-6 py-4 text-primary font-medium">{ban.bannedBy}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(ban.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {ban.isActive ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-destructive/20 text-destructive border border-destructive/30">
                          {ban.isPermanent ? 'Permanent' : 'Active'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-muted text-muted-foreground border border-border">
                          Expired/Unbanned
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center bg-card/50 border border-border rounded-lg p-6">
        <h3 className="font-bold mb-2">Think you were falsely banned?</h3>
        <p className="text-muted-foreground text-sm mb-4">You can submit an appeal and our staff team will review your case.</p>
        <Button variant="outline" asChild>
          <Link href="/appeals">Submit Ban Appeal</Link>
        </Button>
      </div>
    </div>
  );
}