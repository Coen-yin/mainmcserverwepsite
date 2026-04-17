import { useState } from "react";
import { useGetMyProfile, useUpdateMyProfile } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Save } from "lucide-react";

export default function Profile() {
  const { data: profile, refetch } = useGetMyProfile();
  const updateProfile = useUpdateMyProfile();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [minecraftUsername, setMinecraftUsername] = useState(profile?.minecraftUsername || "");
  const [bio, setBio] = useState(profile?.bio || "");

  // Update local state when profile loads
  useState(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setMinecraftUsername(profile.minecraftUsername || "");
      setBio(profile.bio || "");
    }
  });

  const handleSave = () => {
    updateProfile.mutate({
      data: {
        displayName,
        minecraftUsername,
        bio
      }
    }, {
      onSuccess: () => {
        toast({ title: "Profile updated successfully" });
        refetch();
      },
      onError: (err) => {
        toast({ title: "Failed to update profile", variant: "destructive" });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-primary mb-2">Your Profile</h1>
        <p className="text-muted-foreground">Manage your public persona and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card border-border glow-box">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-lg bg-secondary border-2 border-primary/50 overflow-hidden mb-4 relative group">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-display text-muted-foreground">
                    {profile?.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold">{profile?.displayName || profile?.username}</h3>
              <div className="mt-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary/20 text-primary">
                  {profile?.rank || "PLAYER"}
                </span>
              </div>
              
              <div className="w-full mt-6 space-y-2 text-sm text-left">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Member Since</span>
                  <span>{profile ? new Date(profile.joinedAt).toLocaleDateString() : '-'}</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Forum Posts</span>
                  <span>{profile?.postCount || 0}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className={profile?.isBanned ? "text-destructive" : "text-primary"}>
                    {profile?.isBanned ? "Banned" : "Active"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-card border-border h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username (Fixed)</Label>
                <Input id="username" value={profile?.username || ""} disabled className="bg-muted/50" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  placeholder="How you want to be called"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minecraftUsername">Minecraft IGN</Label>
                <Input 
                  id="minecraftUsername" 
                  value={minecraftUsername} 
                  onChange={(e) => setMinecraftUsername(e.target.value)} 
                  placeholder="Your in-game name"
                />
                <p className="text-xs text-muted-foreground">Required to receive rewards from voting and the store.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  placeholder="Tell the community about yourself..."
                  className="min-h-[120px]"
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={updateProfile.isPending}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {updateProfile.isPending ? "Saving..." : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}