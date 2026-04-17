import { useState } from "react";
import { useCreateApplication } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/react";
import { ShieldCheck } from "lucide-react";

export default function Apply() {
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const createApplication = useCreateApplication();

  const [applicantName, setApplicantName] = useState("");
  const [position, setPosition] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [whyJoin, setWhyJoin] = useState("");
  const [availability, setAvailability] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast({ title: "Authentication required", variant: "destructive" });
      return;
    }

    if (!position) {
      toast({ title: "Please select a position", variant: "destructive" });
      return;
    }

    createApplication.mutate({
      data: {
        applicantName,
        position,
        age: parseInt(age),
        experience,
        whyJoin,
        availability
      }
    }, {
      onSuccess: () => {
        toast({ title: "Application submitted successfully" });
        setApplicantName("");
        setPosition("");
        setAge("");
        setExperience("");
        setWhyJoin("");
        setAvailability("");
      },
      onError: () => {
        toast({ title: "Failed to submit application", variant: "destructive" });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/50 glow-box">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          Join The Team
        </h1>
        <p className="text-muted-foreground text-lg">
          We are looking for dedicated individuals to help run techy Network.
        </p>
      </div>

      <Card className="bg-card border-border glow-box">
        <CardHeader className="text-center border-b border-border pb-6">
          <CardTitle>Staff Application Form</CardTitle>
          <CardDescription>Please answer all questions honestly and with detail.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          {!isSignedIn ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You must be signed in to submit a staff application.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="applicantName">Minecraft IGN</Label>
                  <Input 
                    id="applicantName" 
                    required 
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    required 
                    min="13" 
                    max="99"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Desired Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helper">Helper (Chat Moderation)</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="builder">Builder</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability (Hours/Week & Timezone)</Label>
                <Input 
                  id="availability" 
                  required 
                  placeholder="e.g. 15 hours/week, EST"
                  value={availability}
                  onChange={e => setAvailability(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Past Experience</Label>
                <Textarea 
                  id="experience" 
                  className="min-h-[100px]" 
                  required 
                  placeholder="Detail any previous moderation or relevant experience..."
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whyJoin">Why do you want to join techy Network?</Label>
                <Textarea 
                  id="whyJoin" 
                  className="min-h-[150px]" 
                  required 
                  placeholder="What makes you a good fit for our team?"
                  value={whyJoin}
                  onChange={e => setWhyJoin(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg glow-box" disabled={createApplication.isPending}>
                  {createApplication.isPending ? "Submitting..." : "Submit Application"}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  By submitting this application, you agree that you meet our minimum age requirement (13+) and have read the server rules.
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}