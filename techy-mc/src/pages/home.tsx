import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetServerStatus, useListAnnouncements, useGetForumStats } from "@workspace/api-client-react";
import { Shield, Swords, Zap, Users, Trophy, MessageSquare, ShoppingBag, Vote, Copy, Check, ArrowRight } from "lucide-react";
import { useState } from "react";

function ServerIp() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText("play.techy.network");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-card/80 backdrop-blur border border-primary/30 rounded-lg px-5 py-3.5 flex items-center gap-4 min-w-[260px]">
      <div className="flex-1 text-left">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Server IP</div>
        <div className="font-mono font-bold text-primary text-lg tracking-wide">vortexsmp.tech</div>
      </div>
      <Button variant="secondary" size="sm" onClick={copy} className="shrink-0 gap-1.5">
        {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
      </Button>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: "Anti-Cheat System",
    description: "Custom anti-cheat with machine-learning detection. Play fair, every match, every time."
  },
  {
    icon: <Swords className="w-10 h-10 text-primary" />,
    title: "Custom Enchants",
    description: "Hundreds of unique enchantments to power up gear, unlock abilities, and dominate in combat."
  },
  {
    icon: <Zap className="w-10 h-10 text-primary" />,
    title: "Zero Lag",
    description: "Powered by top-tier dedicated servers with NVMe SSDs and 10Gbps uplink connections."
  },
  {
    icon: <Trophy className="w-10 h-10 text-primary" />,
    title: "Player Economy",
    description: "Full in-game economy with shops, auctions, jobs, and a dynamic stock market."
  },
  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: "Active Community",
    description: "Thousands of players, active forums, weekly events, and a welcoming staff team."
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-primary" />,
    title: "Custom Plugins",
    description: "Dozens of custom-coded plugins built exclusively for vortexsmp, unavailable anywhere else."
  },
];

const ANNOUNCEMENT_TYPE_STYLES: Record<string, string> = {
  important: "bg-red-500/20 text-red-400 border-red-500/30",
  update: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  event: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  general: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function Home() {
  const { data: status } = useGetServerStatus();
  const { data: announcementsData } = useListAnnouncements({ limit: 3 });
  const { data: forumStats } = useGetForumStats();

  return (
    <div className="flex flex-col gap-0 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607513746994-51f730a44832?q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-background/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent h-24" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />

        <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-widest mb-8">
            <div className={`w-2 h-2 rounded-full ${status?.online ? 'bg-primary animate-pulse' : 'bg-destructive'}`} />
            {status?.online ? `${status.playerCount || 0} players online now` : "Server offline"}
          </div>

          <h1 className="text-6xl md:text-8xl font-bold font-display glow-text text-primary mb-6 uppercase tracking-wider leading-none">
            vortex<br />NETWORK
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
            The most advanced survival and creative experience. Join thousands of players in an epic world of building, economy, and community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-16">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 h-12 glow-box shadow-[0_0_25px_rgba(34,197,94,0.35)] font-bold" asChild>
              <Link href="/sign-up">
                Start Your Journey <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <ServerIp />
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full">
            {[
              { label: "Players Online", value: status?.playerCount || 0, color: "text-primary" },
              { label: "Version", value: status?.version || "1.21.4", color: "text-primary" },
              { label: "Forum Members", value: (forumStats?.totalMembers || 0).toLocaleString(), color: "text-primary" },
              { label: "Forum Posts", value: (forumStats?.totalPosts || 0).toLocaleString(), color: "text-primary" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-4 text-center">
                <div className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Why vortexsmp?</div>
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">Built Different</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Experience gameplay like never before with custom-coded systems and dedicated hardware built from the ground up.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <Card key={f.title} className="bg-card border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="pt-6 pb-6">
                <div className="mb-5 p-3 w-fit rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Announcements */}
      <section className="bg-card/30 border-y border-border/40 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Stay Updated</div>
              <h2 className="text-3xl font-display font-bold text-foreground">Latest News</h2>
            </div>
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link href="/announcements">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {announcementsData?.announcements?.length ? announcementsData.announcements.map(a => (
              <Card key={a.id} className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${ANNOUNCEMENT_TYPE_STYLES[a.type] || ANNOUNCEMENT_TYPE_STYLES.general}`}>
                      {a.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{a.content}</p>
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">{a.authorName || "Staff"}</span>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">No announcements yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative rounded-2xl border border-primary/20 bg-card overflow-hidden p-10 md:p-16 text-center shadow-[0_0_60px_rgba(34,197,94,0.06)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.06)_0%,_transparent_70%)]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4 glow-text">Ready to Play?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">Create your account, set up your profile, and join thousands of players on vortex Network.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 shadow-[0_0_25px_rgba(34,197,94,0.35)]" asChild>
                <Link href="/sign-up"><UserPlus className="w-4 h-4 mr-2" /> Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link href="/store"><ShoppingBag className="w-4 h-4 mr-2" /> Browse Store</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function UserPlus({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" x2="19" y1="8" y2="14"/>
      <line x1="22" x2="16" y1="11" y2="11"/>
    </svg>
  );
}
