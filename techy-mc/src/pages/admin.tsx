import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Shield, LayoutDashboard, Users, Gavel, FileWarning, LifeBuoy,
  ScrollText, MessageSquare, ShoppingBag, Image as ImageIcon, BookOpen,
  FileClock, Megaphone, Plus, Trash2, Pin, Lock, Ban, UserCheck,
  RefreshCw, Search, CheckCircle, XCircle, ChevronDown, LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ADMIN_PASSWORD = "Carronshore93";
const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
const api = (path: string) => `${BASE}/api${path}`;

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(api(path), {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function RankBadge({ rank }: { rank: string }) {
  const colors: Record<string, string> = {
    owner: "bg-red-500/20 text-red-400 border-red-500/40",
    admin: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    moderator: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    elite: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    mvp: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    vip: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    player: "bg-gray-500/20 text-gray-400 border-gray-500/40",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${colors[rank] || colors.player}`}>
      {rank}
    </span>
  );
}

function StatCard({ label, value, color = "text-primary" }: { label: string; value: number | string; color?: string }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold font-display ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function OverviewTab({ data }: { data: any }) {
  if (!data) return <div className="text-muted-foreground text-center py-12">Loading dashboard...</div>;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Users" value={data.totalUsers} />
        <StatCard label="New Today" value={data.newUsersToday} color="text-emerald-400" />
        <StatCard label="Active Bans" value={data.activeBans} color="text-red-400" />
        <StatCard label="Pending Appeals" value={data.pendingAppeals} color="text-yellow-400" />
        <StatCard label="Staff Apps" value={data.pendingApplications} color="text-blue-400" />
        <StatCard label="Open Tickets" value={data.openTickets} color="text-purple-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Forum Posts" value={data.totalForumPosts} />
        <StatCard label="Players Online" value={data.currentPlayers} color="text-emerald-400" />
      </div>
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentActivity?.map((act: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-sm pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[10px] font-bold uppercase tracking-wider text-primary">{act.type}</span>
                  <span className="text-muted-foreground">{act.description}</span>
                </div>
                <span className="text-muted-foreground font-mono text-xs shrink-0">{new Date(act.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [promoting, setPromoting] = useState<number | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/users?limit=50${search ? `&search=${encodeURIComponent(search)}` : ""}`);
      setUsers(data.users || []);
    } catch { toast({ title: "Failed to load users", variant: "destructive" }); }
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const promote = async (userId: number, rank: string) => {
    setPromoting(userId);
    try {
      await apiFetch(`/users/${userId}/promote`, { method: "POST", body: JSON.stringify({ rank }) });
      toast({ title: `Rank updated to ${rank}` });
      load();
    } catch { toast({ title: "Failed to update rank", variant: "destructive" }); }
    setPromoting(null);
  };

  const banUser = async (userId: number, banned: boolean) => {
    try {
      await apiFetch(`/users/${userId}/${banned ? "unban" : "ban"}`, { method: "POST" });
      toast({ title: banned ? "User unbanned" : "User banned" });
      load();
    } catch { toast({ title: "Action failed", variant: "destructive" }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 bg-background border-border"
            placeholder="Search by username or Minecraft IGN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
      </div>
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">User</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">IGN</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Rank</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Posts</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Joined</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No users found</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="p-3">
                    <div className="font-medium">{u.displayName || u.username}</div>
                    <div className="text-xs text-muted-foreground">{u.username}</div>
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">{u.minecraftUsername || "-"}</td>
                  <td className="p-3"><RankBadge rank={u.rank || "player"} /></td>
                  <td className="p-3 font-mono text-xs">{u.postCount || 0}</td>
                  <td className="p-3 text-xs text-muted-foreground">{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : "-"}</td>
                  <td className="p-3">
                    {u.isBanned ? (
                      <span className="text-xs font-bold text-red-400 uppercase">Banned</span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 uppercase">Active</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Select onValueChange={(rank) => promote(u.id, rank)} disabled={promoting === u.id}>
                        <SelectTrigger className="h-7 text-xs w-28 bg-background border-border">
                          <SelectValue placeholder="Set rank" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {["player","vip","mvp","elite","moderator","admin","owner"].map(r => (
                            <SelectItem key={r} value={r} className="text-xs capitalize">{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-7 text-xs px-2 ${u.isBanned ? "border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10" : "border-red-500/50 text-red-400 hover:bg-red-500/10"}`}
                        onClick={() => banUser(u.id, u.isBanned)}
                      >
                        {u.isBanned ? <UserCheck className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function BansTab() {
  const [bans, setBans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ playerName: "", reason: "", duration: "", isPermanent: false });
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/bans?limit=50");
      setBans(data.bans || []);
    } catch { toast({ title: "Failed to load bans", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createBan = async () => {
    if (!form.playerName || !form.reason) return toast({ title: "Fill in player name and reason", variant: "destructive" });
    try {
      await apiFetch("/bans", { method: "POST", body: JSON.stringify(form) });
      toast({ title: `${form.playerName} has been banned` });
      setForm({ playerName: "", reason: "", duration: "", isPermanent: false });
      load();
    } catch { toast({ title: "Failed to create ban", variant: "destructive" }); }
  };

  const unban = async (banId: number, name: string) => {
    try {
      await apiFetch(`/bans/${banId}/unban`, { method: "POST" });
      toast({ title: `${name} has been unbanned` });
      load();
    } catch { toast({ title: "Failed to unban", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4" /> Issue New Ban</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input placeholder="Player Name" value={form.playerName} onChange={e => setForm(f => ({ ...f, playerName: e.target.value }))} className="bg-background border-border" />
            <Input placeholder="Reason" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className="bg-background border-border" />
            <Input placeholder="Duration (e.g. 7d, 30d, or leave empty)" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className="bg-background border-border" />
            <Button onClick={createBan} className="bg-red-600 hover:bg-red-700 text-white"><Gavel className="w-4 h-4 mr-2" /> Ban Player</Button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <input type="checkbox" id="permanent" checked={form.isPermanent} onChange={e => setForm(f => ({ ...f, isPermanent: e.target.checked }))} className="w-4 h-4" />
            <label htmlFor="permanent" className="text-sm text-muted-foreground">Permanent ban</label>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Active Bans</CardTitle>
          <Button variant="outline" size="icon" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Player</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Reason</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Banned</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : bans.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No active bans</td></tr>
              ) : bans.map(b => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="p-3 font-medium">{b.playerName}</td>
                  <td className="p-3 text-muted-foreground">{b.reason}</td>
                  <td className="p-3 text-xs">
                    {b.isPermanent ? <span className="text-red-400 font-bold">PERMANENT</span> : (b.duration || "Temporary")}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="p-3">
                    <Button variant="outline" size="sm" className="h-7 text-xs border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10" onClick={() => unban(b.id, b.playerName)}>
                      <UserCheck className="w-3 h-3 mr-1" /> Unban
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function AppealsTab() {
  const [appeals, setAppeals] = useState<any[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/appeals${filter !== "all" ? `?status=${filter}` : ""}`);
      setAppeals(data.appeals || []);
    } catch { toast({ title: "Failed to load appeals", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const review = async (id: number, status: string) => {
    try {
      await apiFetch(`/appeals/${id}/review`, { method: "POST", body: JSON.stringify({ status, adminNote: notes[id] || "" }) });
      toast({ title: `Appeal ${status}` });
      load();
    } catch { toast({ title: "Failed to review", variant: "destructive" }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["pending", "accepted", "rejected", "all"].map(s => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" className="capitalize" onClick={() => setFilter(s)}>
            {s}
          </Button>
        ))}
        <Button variant="outline" size="icon" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : appeals.length === 0 ? (
        <Card className="bg-card border-border"><CardContent className="py-12 text-center text-muted-foreground">No {filter} appeals</CardContent></Card>
      ) : appeals.map(a => (
        <Card key={a.id} className="bg-card border-border">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold">{a.playerName}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    a.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" :
                    a.status === "accepted" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" :
                    "bg-red-500/20 text-red-400 border-red-500/40"
                  }`}>{a.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">Submitted {a.createdAt ? new Date(a.createdAt).toLocaleString() : ""}</p>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                <div className="font-medium text-foreground mb-1">Ban reason:</div>
                {a.reason}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Player statement:</div>
              <p className="text-sm bg-background rounded p-3 border border-border">{a.explanation}</p>
            </div>
            {a.adminNote && (
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Admin note:</div>
                <p className="text-sm bg-background rounded p-3 border border-border text-muted-foreground">{a.adminNote}</p>
              </div>
            )}
            {a.status === "pending" && (
              <div className="space-y-2">
                <Input
                  placeholder="Admin note (optional)"
                  value={notes[a.id] || ""}
                  onChange={e => setNotes(n => ({ ...n, [a.id]: e.target.value }))}
                  className="bg-background border-border text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => review(a.id, "accepted")}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Accept Appeal
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => review(a.id, "rejected")}>
                    <XCircle className="w-3 h-3 mr-1" /> Reject Appeal
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ApplicationsTab() {
  const [apps, setApps] = useState<any[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/applications${filter !== "all" ? `?status=${filter}` : ""}`);
      setApps(data.applications || []);
    } catch { toast({ title: "Failed to load applications", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const review = async (id: number, status: string) => {
    try {
      await apiFetch(`/applications/${id}/review`, { method: "POST", body: JSON.stringify({ status, adminNote: notes[id] || "" }) });
      toast({ title: `Application ${status}` });
      load();
    } catch { toast({ title: "Failed to review", variant: "destructive" }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["pending", "accepted", "rejected", "all"].map(s => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" className="capitalize" onClick={() => setFilter(s)}>{s}</Button>
        ))}
        <Button variant="outline" size="icon" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : apps.length === 0 ? (
        <Card className="bg-card border-border"><CardContent className="py-12 text-center text-muted-foreground">No {filter} applications</CardContent></Card>
      ) : apps.map(a => (
        <Card key={a.id} className="bg-card border-border">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold">{a.applicantName}</span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{a.position}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    a.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" :
                    a.status === "accepted" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" :
                    "bg-red-500/20 text-red-400 border-red-500/40"
                  }`}>{a.status}</span>
                </div>
                <p className="text-xs text-muted-foreground">Age: {a.age} · Availability: {a.availability} · {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}</p>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Experience:</div>
              <p className="text-sm bg-background rounded p-3 border border-border">{a.experience}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Why they want to join:</div>
              <p className="text-sm bg-background rounded p-3 border border-border">{a.whyJoin}</p>
            </div>
            {a.status === "pending" && (
              <div className="space-y-2">
                <Input
                  placeholder="Note to applicant (optional)"
                  value={notes[a.id] || ""}
                  onChange={e => setNotes(n => ({ ...n, [a.id]: e.target.value }))}
                  className="bg-background border-border text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => review(a.id, "accepted")}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => review(a.id, "rejected")}>
                    <XCircle className="w-3 h-3 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TicketsTab() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState("open");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/tickets${filter !== "all" ? `?status=${filter}` : ""}`);
      setTickets(data.tickets || []);
    } catch { toast({ title: "Failed to load tickets", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const close = async (id: number) => {
    try {
      await apiFetch(`/tickets/${id}/close`, { method: "POST" });
      toast({ title: "Ticket closed" });
      load();
    } catch { toast({ title: "Failed to close ticket", variant: "destructive" }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["open", "closed", "all"].map(s => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" className="capitalize" onClick={() => setFilter(s)}>{s}</Button>
        ))}
        <Button variant="outline" size="icon" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
      </div>
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">#</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Subject</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Submitter</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No {filter} tickets</td></tr>
              ) : tickets.map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="p-3 font-mono text-xs text-muted-foreground">#{t.id}</td>
                  <td className="p-3 font-medium max-w-[200px] truncate">{t.subject}</td>
                  <td className="p-3 text-xs text-muted-foreground capitalize">{t.category}</td>
                  <td className="p-3 text-xs">{t.submitterName || "Anonymous"}</td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      t.status === "open" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-gray-500/20 text-gray-400 border-gray-500/40"
                    }`}>{t.status}</span>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="p-3">
                    {t.status === "open" && (
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => close(t.id)}>Close</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function AnnouncementsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "general", pinned: false });
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/announcements?limit=50");
      setItems(data.announcements || []);
    } catch { toast({ title: "Failed to load", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title || !form.content) return toast({ title: "Fill in title and content", variant: "destructive" });
    try {
      await apiFetch("/announcements", { method: "POST", body: JSON.stringify(form) });
      toast({ title: "Announcement posted" });
      setForm({ title: "", content: "", type: "general", pinned: false });
      load();
    } catch { toast({ title: "Failed to post", variant: "destructive" }); }
  };

  const del = async (id: number) => {
    try {
      await apiFetch(`/announcements/${id}`, { method: "DELETE" });
      toast({ title: "Deleted" });
      load();
    } catch { toast({ title: "Failed to delete", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4" /> Post Announcement</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-background border-border" />
          <Textarea placeholder="Content..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="bg-background border-border min-h-[100px]" />
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger className="w-40 bg-background border-border"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                {["general","important","update","event"].map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} className="w-4 h-4" />
              Pin to top
            </label>
            <Button onClick={create}><Megaphone className="w-4 h-4 mr-2" /> Post</Button>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {loading ? <div className="text-center py-8 text-muted-foreground">Loading...</div> : items.map(a => (
          <Card key={a.id} className="bg-card border-border">
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium truncate">{a.title}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                    a.type === "important" ? "bg-red-500/20 text-red-400 border-red-500/40" :
                    a.type === "update" ? "bg-blue-500/20 text-blue-400 border-blue-500/40" :
                    a.type === "event" ? "bg-purple-500/20 text-purple-400 border-purple-500/40" :
                    "bg-gray-500/20 text-gray-400 border-gray-500/40"
                  }`}>{a.type}</span>
                  {a.pinned && <span className="text-[10px] text-yellow-400 font-bold uppercase">Pinned</span>}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-400 shrink-0" onClick={() => del(a.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ForumsAdminTab() {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/forums/threads?limit=50");
      setThreads(data.threads || []);
    } catch { toast({ title: "Failed to load", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const pin = async (id: number) => {
    try { await apiFetch(`/forums/threads/${id}/pin`, { method: "POST" }); toast({ title: "Toggled pin" }); load(); }
    catch { toast({ title: "Failed", variant: "destructive" }); }
  };
  const lock = async (id: number) => {
    try { await apiFetch(`/forums/threads/${id}/lock`, { method: "POST" }); toast({ title: "Toggled lock" }); load(); }
    catch { toast({ title: "Failed", variant: "destructive" }); }
  };
  const del = async (id: number) => {
    if (!confirm("Delete this thread and all its posts?")) return;
    try { await apiFetch(`/forums/threads/${id}`, { method: "DELETE" }); toast({ title: "Thread deleted" }); load(); }
    catch { toast({ title: "Failed", variant: "destructive" }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="icon" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
      </div>
      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/30">
              <tr>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Thread</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Author</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Replies</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
              ) : threads.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No threads</td></tr>
              ) : threads.map(t => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="p-3 max-w-[250px] truncate font-medium">{t.title}</td>
                  <td className="p-3 text-xs text-muted-foreground">{t.authorName}</td>
                  <td className="p-3 font-mono text-xs">{t.replyCount || 0}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {t.isPinned && <span className="text-[10px] font-bold text-yellow-400 uppercase">Pinned</span>}
                      {t.isLocked && <span className="text-[10px] font-bold text-red-400 uppercase">Locked</span>}
                      {!t.isPinned && !t.isLocked && <span className="text-[10px] text-muted-foreground">Normal</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-yellow-400 hover:bg-yellow-400/10" title="Toggle Pin" onClick={() => pin(t.id)}>
                        <Pin className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-orange-400 hover:bg-orange-400/10" title="Toggle Lock" onClick={() => lock(t.id)}>
                        <Lock className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:bg-red-400/10" title="Delete Thread" onClick={() => del(t.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StoreTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "rank", featured: false, imageUrl: "" });
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/store/items");
      setItems(Array.isArray(data) ? data : []);
    } catch { toast({ title: "Failed to load", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name || !form.price) return toast({ title: "Fill in name and price", variant: "destructive" });
    try {
      await apiFetch("/store/items", { method: "POST", body: JSON.stringify({ ...form, price: parseFloat(form.price) }) });
      toast({ title: "Item added" });
      setForm({ name: "", description: "", price: "", category: "rank", featured: false, imageUrl: "" });
      load();
    } catch { toast({ title: "Failed to add", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4" /> Add Store Item</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Item name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-background border-border" />
            <Input placeholder="Price (USD)" type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="bg-background border-border" />
            <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
              <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                {["rank","cosmetic","booster","bundle"].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Image URL (optional)" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="bg-background border-border" />
          </div>
          <Textarea placeholder="Description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-background border-border min-h-[80px]" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4" />
              Featured item
            </label>
            <Button onClick={create}><ShoppingBag className="w-4 h-4 mr-2" /> Add Item</Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <div className="col-span-3 text-center py-8 text-muted-foreground">Loading...</div> :
          items.map(item => (
            <Card key={item.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{item.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary font-mono">${Number(item.price).toFixed(2)}</div>
                    {item.featured && <div className="text-[10px] text-yellow-400 font-bold uppercase">Featured</div>}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
            </Card>
          ))
        }
      </div>
    </div>
  );
}

function RulesTab() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", severity: "medium" });
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/rules");
      setRules(Array.isArray(data) ? data : []);
    } catch { toast({ title: "Failed to load", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title) return toast({ title: "Enter a rule title", variant: "destructive" });
    try {
      await apiFetch("/rules", { method: "POST", body: JSON.stringify(form) });
      toast({ title: "Rule added" });
      setForm({ title: "", description: "", category: "", severity: "medium" });
      load();
    } catch { toast({ title: "Failed to add rule", variant: "destructive" }); }
  };

  const del = async (id: number) => {
    try {
      await apiFetch(`/rules/${id}`, { method: "DELETE" });
      toast({ title: "Rule deleted" });
      load();
    } catch { toast({ title: "Failed", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4" /> Add Rule</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Rule title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-background border-border" />
            <Input placeholder="Category (e.g. General, PvP)" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="bg-background border-border" />
            <Select value={form.severity} onValueChange={v => setForm(f => ({ ...f, severity: v }))}>
              <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                {["low","medium","high","critical"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Textarea placeholder="Rule description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-background border-border min-h-[80px]" />
          <Button onClick={create}><BookOpen className="w-4 h-4 mr-2" /> Add Rule</Button>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {loading ? <div className="text-center py-8 text-muted-foreground">Loading...</div> :
          rules.map(r => (
            <Card key={r.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{r.title}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      r.severity === "critical" ? "bg-red-500/20 text-red-400 border-red-500/40" :
                      r.severity === "high" ? "bg-orange-500/20 text-orange-400 border-orange-500/40" :
                      r.severity === "medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40" :
                      "bg-gray-500/20 text-gray-400 border-gray-500/40"
                    }`}>{r.severity}</span>
                    {r.category && <span className="text-[10px] text-muted-foreground">{r.category}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-400 shrink-0" onClick={() => del(r.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        }
      </div>
    </div>
  );
}

function ChangelogTab() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ version: "", title: "", changes: [{ type: "feature", description: "" }] });
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/changelog?limit=50");
      setEntries(data.changelogs || []);
    } catch { toast({ title: "Failed to load", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addChange = () => setForm(f => ({ ...f, changes: [...f.changes, { type: "feature", description: "" }] }));
  const updateChange = (i: number, field: string, val: string) =>
    setForm(f => ({ ...f, changes: f.changes.map((c, j) => j === i ? { ...c, [field]: val } : c) }));

  const create = async () => {
    if (!form.version || !form.title) return toast({ title: "Enter version and title", variant: "destructive" });
    const validChanges = form.changes.filter(c => c.description.trim());
    try {
      await apiFetch("/changelog", { method: "POST", body: JSON.stringify({ version: form.version, title: form.title, changes: validChanges }) });
      toast({ title: "Changelog entry added" });
      setForm({ version: "", title: "", changes: [{ type: "feature", description: "" }] });
      load();
    } catch { toast({ title: "Failed to add", variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4" /> Add Changelog Entry</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Version (e.g. 1.2.5)" value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} className="bg-background border-border" />
            <Input placeholder="Title (e.g. Spring Update)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-background border-border" />
          </div>
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Changes:</div>
            {form.changes.map((c, i) => (
              <div key={i} className="flex gap-2">
                <Select value={c.type} onValueChange={v => updateChange(i, "type", v)}>
                  <SelectTrigger className="w-32 bg-background border-border text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {["feature","fix","balance","improvement","removed"].map(t => <SelectItem key={t} value={t} className="text-xs capitalize">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input placeholder="Description of change..." value={c.description} onChange={e => updateChange(i, "description", e.target.value)} className="bg-background border-border text-sm flex-1" />
              </div>
            ))}
            <Button variant="outline" size="sm" className="text-xs" onClick={addChange}><Plus className="w-3 h-3 mr-1" /> Add Change</Button>
          </div>
          <Button onClick={create}><FileClock className="w-4 h-4 mr-2" /> Post Entry</Button>
        </CardContent>
      </Card>
      <div className="space-y-3">
        {loading ? <div className="text-center py-8 text-muted-foreground">Loading...</div> :
          entries.map(e => (
            <Card key={e.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-bold font-mono text-primary">{e.version}</span>
                  <span className="font-medium">{e.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{e.createdAt ? new Date(e.createdAt).toLocaleDateString() : ""}</span>
                </div>
                {Array.isArray(e.changes) && e.changes.length > 0 && (
                  <ul className="space-y-1">
                    {e.changes.map((c: any, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className={`shrink-0 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded mt-0.5 ${
                          c.type === "fix" ? "bg-red-500/20 text-red-400" :
                          c.type === "balance" ? "bg-yellow-500/20 text-yellow-400" :
                          c.type === "removed" ? "bg-gray-500/20 text-gray-400" :
                          c.type === "improvement" ? "bg-blue-500/20 text-blue-400" :
                          "bg-emerald-500/20 text-emerald-400"
                        }`}>{c.type}</span>
                        <span className="text-muted-foreground">{c.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))
        }
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const verified = localStorage.getItem("techy_admin_verified");
    if (verified === "true") setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiFetch("/admin/dashboard")
      .then(setDashboardData)
      .catch(() => {});
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch("/admin/verify", { method: "POST", body: JSON.stringify({ password }) });
      if (res.valid) {
        localStorage.setItem("techy_admin_verified", "true");
        setIsAuthenticated(true);
        toast({ title: "Access granted. Welcome to the admin terminal." });
      } else {
        toast({ title: "Invalid password", variant: "destructive" });
      }
    } catch {
      toast({ title: "Verification failed", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("techy_admin_verified");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.08)_0%,_transparent_70%)]">
        <Card className="w-full max-w-sm bg-card border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <CardTitle className="text-2xl font-display text-red-400 uppercase tracking-wider">Admin Terminal</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Restricted access. Authorized personnel only.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Master password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-background border-red-500/20 focus-visible:ring-red-500/50 text-center text-lg tracking-widest"
                autoFocus
              />
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white h-11 text-base font-bold uppercase tracking-wider">
                Initialize Terminal
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tabs = [
    { value: "dashboard", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { value: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { value: "bans", label: "Bans", icon: <Gavel className="w-4 h-4" /> },
    { value: "appeals", label: "Appeals", icon: <FileWarning className="w-4 h-4" /> },
    { value: "applications", label: "Applications", icon: <ScrollText className="w-4 h-4" /> },
    { value: "tickets", label: "Tickets", icon: <LifeBuoy className="w-4 h-4" /> },
    { value: "announcements", label: "Announcements", icon: <Megaphone className="w-4 h-4" /> },
    { value: "forums", label: "Forums", icon: <MessageSquare className="w-4 h-4" /> },
    { value: "store", label: "Store", icon: <ShoppingBag className="w-4 h-4" /> },
    { value: "rules", label: "Rules", icon: <BookOpen className="w-4 h-4" /> },
    { value: "changelog", label: "Changelog", icon: <FileClock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-red-500/20 bg-card/80 backdrop-blur sticky top-16 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-400 font-display font-bold text-lg uppercase tracking-wider">
            <Shield className="w-5 h-5" /> Admin Terminal
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-red-400 gap-2">
            <LogOut className="w-4 h-4" /> Lock
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard">
          <div className="mb-8 overflow-x-auto pb-2">
            <TabsList className="bg-card border border-border h-auto inline-flex flex-wrap gap-1 p-1 min-w-full md:min-w-0">
              {tabs.map(t => (
                <TabsTrigger key={t.value} value={t.value} className="flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs px-3 py-2">
                  {t.icon} <span className="hidden sm:inline">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">System Overview</h2>
            <OverviewTab data={dashboardData} />
          </TabsContent>
          <TabsContent value="users" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <UsersTab />
          </TabsContent>
          <TabsContent value="bans" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">Ban Management</h2>
            <BansTab />
          </TabsContent>
          <TabsContent value="appeals" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">Ban Appeals</h2>
            <AppealsTab />
          </TabsContent>
          <TabsContent value="applications" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">Staff Applications</h2>
            <ApplicationsTab />
          </TabsContent>
          <TabsContent value="tickets" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">Support Tickets</h2>
            <TicketsTab />
          </TabsContent>
          <TabsContent value="announcements" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">Announcements</h2>
            <AnnouncementsTab />
          </TabsContent>
          <TabsContent value="forums" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">Forum Management</h2>
            <ForumsAdminTab />
          </TabsContent>
          <TabsContent value="store" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">Store Management</h2>
            <StoreTab />
          </TabsContent>
          <TabsContent value="rules" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">Rules Management</h2>
            <RulesTab />
          </TabsContent>
          <TabsContent value="changelog" className="mt-0">
            <h2 className="text-2xl font-bold mb-6">Changelog</h2>
            <ChangelogTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
