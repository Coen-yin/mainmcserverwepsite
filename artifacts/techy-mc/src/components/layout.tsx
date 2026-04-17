import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useUser, useClerk, Show } from "@clerk/react";
import {
  Menu, LogOut, LayoutDashboard, MessageSquare, ShoppingBag,
  BookOpen, Gavel, Trophy, Shield, Megaphone, Image, FileText,
  LifeBuoy, Vote, UserPlus, ScrollText, ChevronDown, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useGetMyProfile } from "@workspace/api-client-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function NavLink({ href, children, onClick }: { href: string; children: ReactNode; onClick?: () => void }) {
  const [location] = useLocation();
  const active = location === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`transition-colors hover:text-primary flex items-center gap-1.5 text-sm font-medium whitespace-nowrap ${active ? "text-primary" : "text-muted-foreground"}`}
    >
      {children}
    </Link>
  );
}

function NavDropdown({ label, icon, items }: {
  label: string;
  icon: ReactNode;
  items: { href: string; label: string; icon: ReactNode }[];
}) {
  const [location] = useLocation();
  const isAnyActive = items.some(i => location === i.href);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${isAnyActive ? "text-primary" : "text-muted-foreground"}`}>
          {icon}
          {label}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border shadow-lg shadow-black/50 min-w-[180px]" align="start">
        {items.map(item => (
          <DropdownMenuItem key={item.href} asChild className="cursor-pointer hover:bg-secondary focus:bg-secondary">
            <Link href={item.href} className="flex items-center gap-2 text-sm py-2">
              <span className="text-primary">{item.icon}</span>
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu({ profile }: { profile: any }) {
  const { signOut } = useClerk();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm group-hover:border-primary/60 transition-colors">
            {profile?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-foreground leading-none">{profile?.displayName || profile?.username}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{profile?.rank || "player"}</div>
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border shadow-lg shadow-black/50 min-w-[180px]" align="end">
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-secondary focus:bg-secondary">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm py-2">
            <LayoutDashboard className="w-4 h-4 text-primary" /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-secondary focus:bg-secondary">
          <Link href="/profile" className="flex items-center gap-2 text-sm py-2">
            <Star className="w-4 h-4 text-primary" /> Edit Profile
          </Link>
        </DropdownMenuItem>
        {profile?.isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10">
              <Link href="/admin" className="flex items-center gap-2 text-sm py-2 text-red-400">
                <Shield className="w-4 h-4" /> Admin Panel
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          className="cursor-pointer hover:bg-secondary focus:bg-secondary text-muted-foreground text-sm py-2"
          onClick={() => signOut({ redirectUrl: basePath || "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);
  const { isSignedIn } = useUser();
  const { data: profile } = useGetMyProfile({ query: { enabled: !!isSignedIn } });
  const { signOut } = useClerk();

  const communityLinks = [
    { href: "/forums", label: "Forums", icon: <MessageSquare className="w-4 h-4" /> },
    { href: "/announcements", label: "Announcements", icon: <Megaphone className="w-4 h-4" /> },
    { href: "/gallery", label: "Gallery", icon: <Image className="w-4 h-4" /> },
    { href: "/leaderboard", label: "Leaderboard", icon: <Trophy className="w-4 h-4" /> },
    { href: "/vote", label: "Vote", icon: <Vote className="w-4 h-4" /> },
  ];

  const infoLinks = [
    { href: "/rules", label: "Rules", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/bans", label: "Ban List", icon: <Gavel className="w-4 h-4" /> },
    { href: "/changelog", label: "Changelog", icon: <FileText className="w-4 h-4" /> },
    { href: "/apply", label: "Staff Apply", icon: <UserPlus className="w-4 h-4" /> },
    { href: "/support", label: "Support", icon: <LifeBuoy className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full text-foreground bg-background dark">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/" className="flex items-center gap-3 mr-4 transition-transform hover:scale-105 shrink-0">
            <img src={`${window.location.origin}${basePath}/logo.svg`} alt="techy Logo" className="h-8 w-8 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            <span className="font-display font-bold text-xl tracking-tight glow-text text-primary">vortex</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium flex-1">
            <NavLink href="/store"><ShoppingBag className="w-4 h-4" /> Store</NavLink>
            <NavDropdown
              label="Community"
              icon={<MessageSquare className="w-4 h-4" />}
              items={communityLinks}
            />
            <NavDropdown
              label="Info"
              icon={<BookOpen className="w-4 h-4" />}
              items={infoLinks}
            />
            <NavLink href="/appeals"><ScrollText className="w-4 h-4" /> Appeals</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Show when="signed-in">
              <UserMenu profile={profile} />
            </Show>
            <Show when="signed-out">
              <div className="hidden md:flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(34,197,94,0.4)]" asChild>
                  <Link href="/sign-up">Join Now</Link>
                </Button>
              </div>
            </Show>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-border dark w-72 overflow-y-auto">
                <div className="flex flex-col gap-1 mt-8">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">Main</div>
                  <MobileNavLink href="/store" onClick={closeMenu}><ShoppingBag className="w-4 h-4" /> Store</MobileNavLink>
                  
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mt-4 mb-2">Community</div>
                  {communityLinks.map(l => (
                    <MobileNavLink key={l.href} href={l.href} onClick={closeMenu}>{l.icon} {l.label}</MobileNavLink>
                  ))}

                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mt-4 mb-2">Info & Help</div>
                  {infoLinks.map(l => (
                    <MobileNavLink key={l.href} href={l.href} onClick={closeMenu}>{l.icon} {l.label}</MobileNavLink>
                  ))}
                  <MobileNavLink href="/appeals" onClick={closeMenu}><ScrollText className="w-4 h-4" /> Appeals</MobileNavLink>

                  <hr className="border-border my-4" />

                  <Show when="signed-in">
                    <div className="flex flex-col gap-1">
                      <MobileNavLink href="/dashboard" onClick={closeMenu}><LayoutDashboard className="w-4 h-4" /> Dashboard</MobileNavLink>
                      <MobileNavLink href="/profile" onClick={closeMenu}><Star className="w-4 h-4" /> Edit Profile</MobileNavLink>
                      {profile?.isAdmin && (
                        <Link href="/admin" onClick={closeMenu} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                          <Shield className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        className="w-full justify-start mt-2 text-muted-foreground"
                        onClick={() => { signOut({ redirectUrl: basePath || "/" }); closeMenu(); }}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </Button>
                    </div>
                  </Show>
                  <Show when="signed-out">
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" className="w-full" asChild onClick={closeMenu}>
                        <Link href="/sign-in">Sign In</Link>
                      </Button>
                      <Button className="w-full bg-primary hover:bg-primary/90" asChild onClick={closeMenu}>
                        <Link href="/sign-up">Join Now</Link>
                      </Button>
                    </div>
                  </Show>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t border-border/40 py-10 bg-card mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={`${window.location.origin}${basePath}/logo.svg`} alt="techy Logo" className="h-6 w-6 opacity-70" />
                <span className="font-display font-bold text-primary">vortex</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The most advanced Minecraft survival and creative network. Join thousands of players worldwide.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Play</div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-muted-foreground font-mono">vortexsmp.tech</span>
                <Link href="/store" className="text-xs text-muted-foreground hover:text-primary transition-colors">Store</Link>
                <Link href="/vote" className="text-xs text-muted-foreground hover:text-primary transition-colors">Vote for Server</Link>
                <Link href="/leaderboard" className="text-xs text-muted-foreground hover:text-primary transition-colors">Leaderboards</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Community</div>
              <div className="flex flex-col gap-2">
                <Link href="/forums" className="text-xs text-muted-foreground hover:text-primary transition-colors">Forums</Link>
                <Link href="/gallery" className="text-xs text-muted-foreground hover:text-primary transition-colors">Gallery</Link>
                <Link href="/announcements" className="text-xs text-muted-foreground hover:text-primary transition-colors">Announcements</Link>
                <Link href="/changelog" className="text-xs text-muted-foreground hover:text-primary transition-colors">Changelog</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Help</div>
              <div className="flex flex-col gap-2">
                <Link href="/rules" className="text-xs text-muted-foreground hover:text-primary transition-colors">Server Rules</Link>
                <Link href="/support" className="text-xs text-muted-foreground hover:text-primary transition-colors">Support Tickets</Link>
                <Link href="/appeals" className="text-xs text-muted-foreground hover:text-primary transition-colors">Ban Appeals</Link>
                <Link href="/apply" className="text-xs text-muted-foreground hover:text-primary transition-colors">Staff Applications</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} techy Network. Not affiliated with Mojang AB.
            </p>
            <p className="text-xs text-muted-foreground">Version 1.21.4 · Java Edition</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: ReactNode; onClick?: () => void }) {
  const [location] = useLocation();
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        location === href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}
