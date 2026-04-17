import { useState } from "react";
import { useListTickets, useCreateTicket } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/react";
import { LifeBuoy, Clock, CheckCircle, HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateTicketBodyCategory } from "@workspace/api-client-react";

export default function Support() {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const { data: ticketsData, refetch, isLoading } = useListTickets();
  const createTicket = useCreateTicket();

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<CreateTicketBodyCategory | "">("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast({ title: "Authentication required", variant: "destructive" });
      return;
    }
    if (!category) {
      toast({ title: "Please select a category", variant: "destructive" });
      return;
    }

    createTicket.mutate({
      data: {
        subject,
        category: category as CreateTicketBodyCategory,
        message,
        submitterName: user.username || user.firstName || "Player"
      }
    }, {
      onSuccess: () => {
        toast({ title: "Ticket created successfully" });
        setSubject("");
        setCategory("");
        setMessage("");
        refetch();
      },
      onError: () => {
        toast({ title: "Failed to create ticket", variant: "destructive" });
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <HelpCircle className="w-4 h-4 text-blue-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <LifeBuoy className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/50 glow-box">
          <LifeBuoy className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          Support Center
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Need help? Found a bug? Create a ticket and our staff will assist you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-card border-border glow-box sticky top-24">
            <CardHeader>
              <CardTitle>Create New Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              {!isSignedIn ? (
                <div className="p-6 bg-muted/50 border border-border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-4">You must be signed in to create a support ticket.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      required 
                      placeholder="Brief description of the issue"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(v) => setCategory(v as CreateTicketBodyCategory)}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account / Payment</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="gameplay">Gameplay Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      className="min-h-[150px]" 
                      required 
                      placeholder="Provide as much detail as possible..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={createTicket.isPending}>
                    {createTicket.isPending ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Your Tickets</h2>
          
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-4 w-1/4 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (!ticketsData?.tickets || ticketsData.tickets.length === 0) ? (
            <div className="p-12 text-center border border-border bg-card/50 rounded-lg text-muted-foreground">
              You haven't created any support tickets.
            </div>
          ) : (
            ticketsData.tickets.map((ticket) => (
              <Card key={ticket.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                    <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border">
                      {getStatusIcon(ticket.status)}
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground font-mono">
                    <span>ID: #{ticket.id}</span>
                    <span>Category: {ticket.category}</span>
                    <span>Date: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
                  
                  {ticket.adminNote && (
                    <div className="mt-4 bg-muted/50 p-4 rounded-lg border border-border">
                      <div className="text-xs font-bold uppercase text-primary tracking-wider mb-2">Staff Response</div>
                      <p className="text-sm">{ticket.adminNote}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}