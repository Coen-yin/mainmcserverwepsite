import { useGetMyProfile, useGetServerStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { User, Activity, Award, MessageSquare, History, ShieldAlert } from "lucide-react";

export default function Dashboard() {
  const { data: profile } = useGetMyProfile();
  const { data: status } = useGetServerStatus();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-primary mb-2">Headquarters</h1>
        <p className="text-muted-foreground">Welcome back, {profile?.displayName || profile?.username}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card border-border glow-box col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-lg bg-secondary border border-border overflow-hidden">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-display text-muted-foreground">
                    {profile?.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <h3 className="text-2xl font-bold">{profile?.displayName || profile?.username}</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">Rank:</span>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary">
                      {profile?.rank}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  <div className="bg-secondary px-3 py-1.5 rounded border border-border">
                    <span className="text-xs text-muted-foreground block">Posts</span>
                    <span className="font-mono">{profile?.postCount || 0}</span>
                  </div>
                  <div className="bg-secondary px-3 py-1.5 rounded border border-border">
                    <span className="text-xs text-muted-foreground block">Joined</span>
                    <span className="font-mono">{profile ? new Date(profile.joinedAt).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
                <div className="pt-2 flex gap-2 justify-center sm:justify-start">
                  <Button variant="outline" asChild size="sm">
                    <Link href="/profile">Edit Profile</Link>
                  </Button>
                  {profile?.isAdmin && (
                    <Button variant="destructive" asChild size="sm" className="bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/50">
                      <Link href="/admin">Admin Panel</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-muted-foreground text-sm">Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${status?.online ? 'bg-primary animate-pulse' : 'bg-destructive'}`} />
                <span className="font-medium text-sm">{status?.online ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-muted-foreground text-sm">Players</span>
              <span className="font-mono font-medium">{status?.playerCount || 0} / {status?.maxPlayers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">IP</span>
              <span className="font-mono font-medium text-primary">play.techy.network</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/vote">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold">Vote for Server</h3>
              <p className="text-sm text-muted-foreground">Earn rewards and rank up</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/forums">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold">Community Forums</h3>
              <p className="text-sm text-muted-foreground">Join the discussion</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/appeals">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-bold">Ban Appeals</h3>
              <p className="text-sm text-muted-foreground">Submit or track appeals</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/store">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary">
                <History className="w-6 h-6" />
              </div>
              <h3 className="font-bold">Server Store</h3>
              <p className="text-sm text-muted-foreground">Ranks and cosmetics</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
