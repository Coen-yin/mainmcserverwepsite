import { useState } from "react";
import { useListForumCategories, useCreateForumThread } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/react";

export default function NewThread() {
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const defaultCategory = searchParams.get("category");
  
  const [, setLocation] = useLocation();
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  
  const { data: categories, isLoading } = useListForumCategories();
  const createThread = useCreateForumThread();
  
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(defaultCategory || "");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast({ title: "Must be signed in", variant: "destructive" });
      return;
    }
    if (!categoryId) {
      toast({ title: "Please select a category", variant: "destructive" });
      return;
    }

    createThread.mutate({
      data: {
        title,
        categoryId: parseInt(categoryId),
        content
      }
    }, {
      onSuccess: (thread) => {
        toast({ title: "Thread created successfully" });
        setLocation(`/forums/thread/${thread.id}`);
      },
      onError: () => {
        toast({ title: "Failed to create thread", variant: "destructive" });
      }
    });
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        You must be signed in to create a thread.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2 glow-text uppercase tracking-wider">
          Create New Thread
        </h1>
      </div>

      <Card className="bg-card border-border glow-box">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Thread Title</Label>
              <Input 
                id="title" 
                required 
                placeholder="Keep it descriptive..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea 
                id="content" 
                required 
                placeholder="Write your post here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] bg-background border-border font-sans"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => setLocation(defaultCategory ? `/forums/category/${defaultCategory}` : "/forums")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={createThread.isPending}>
                {createThread.isPending ? "Creating..." : "Create Thread"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}