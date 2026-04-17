import { useState } from "react";
import { useListForumThreads, useGetMyProfile, useListForumCategories } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useRoute } from "wouter";
import { MessageSquare, Pin, Lock, User, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/react";

export default function Category() {
  const [, params] = useRoute("/forums/category/:categoryId");
  const categoryId = params?.categoryId ? parseInt(params.categoryId) : 0;
  
  const { isSignedIn } = useUser();
  const { data: threadsData, isLoading } = useListForumThreads({ categoryId, limit: 50 });
  const { data: categories } = useListForumCategories();
  
  const category = categories?.find(c => c.id === categoryId);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2 font-bold uppercase tracking-wider">
            <Link href="/forums" className="hover:text-primary transition-colors">Forums</Link>
            <span>/</span>
            <span className="text-foreground">{category?.name || "Category"}</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-primary glow-text uppercase tracking-wider">
            {category?.name || "Loading..."}
          </h1>
          <p className="text-muted-foreground mt-1">
            {category?.description || ""}
          </p>
        </div>
        
        {isSignedIn && (
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground glow-box shrink-0">
            <Link href={`/forums/new?category=${categoryId}`}>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Thread
            </Link>
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Thread</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs w-32 text-center">Replies</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs w-32 text-center">Views</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs w-48 text-right">Latest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-48 mb-2" /><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-5 w-8 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-5 w-8 mx-auto" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-4 w-24 ml-auto mb-1" /><Skeleton className="h-3 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : threadsData?.threads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No threads found in this category.
                  </td>
                </tr>
              ) : (
                threadsData?.threads.map((thread) => (
                  <tr key={thread.id} className="hover:bg-muted/20 transition-colors group cursor-pointer" onClick={() => window.location.href=`/forums/thread/${thread.id}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 shrink-0">
                          {thread.isLocked ? (
                            <Lock className="w-4 h-4 text-destructive" />
                          ) : thread.isPinned ? (
                            <Pin className="w-4 h-4 text-primary" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        <div>
                          <Link href={`/forums/thread/${thread.id}`} className="font-bold text-lg group-hover:text-primary transition-colors inline-block mb-1">
                            {thread.title}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{thread.authorName}</span>
                            <span>•</span>
                            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                      {thread.replyCount}
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-muted-foreground">
                      {thread.viewCount}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="text-muted-foreground mb-1">
                        {new Date(thread.lastReplyAt || thread.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}