import { useState } from "react";
import { useListStoreItems } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star, Crown, Sparkles, Zap, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Store() {
  const [category, setCategory] = useState<string>("all");
  const { data: storeItems, isLoading } = useListStoreItems();

  const filteredItems = category === "all" 
    ? storeItems 
    : storeItems?.filter(item => item.category === category);

  const featuredItems = storeItems?.filter(item => item.featured) || [];

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'rank': return <Crown className="w-4 h-4" />;
      case 'cosmetic': return <Sparkles className="w-4 h-4" />;
      case 'booster': return <Zap className="w-4 h-4" />;
      case 'bundle': return <Package className="w-4 h-4" />;
      default: return <ShoppingCart className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/50 glow-box">
          <ShoppingCart className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          Server Store
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Support the server and get epic perks, ranks, and cosmetics in return.
        </p>
      </div>

      {featuredItems.length > 0 && category === "all" && (
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2 text-yellow-500">
            <Star className="fill-current" /> Featured Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map(item => (
              <Card key={item.id} className="bg-card border-yellow-500/50 glow-box overflow-hidden relative">
                <div className="absolute top-4 right-4 bg-yellow-500 text-yellow-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 shadow-lg">
                  Popular
                </div>
                {item.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-display text-yellow-500">{item.name}</CardTitle>
                  <div className="text-3xl font-bold font-mono">${item.price.toFixed(2)}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  {item.features && item.features.length > 0 && (
                    <ul className="space-y-2">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-950 font-bold text-lg h-12 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                    Purchase
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <Tabs defaultValue="all" onValueChange={setCategory}>
          <TabsList className="bg-card border border-border h-auto p-1 flex flex-wrap justify-center gap-2">
            <TabsTrigger value="all" className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Items</TabsTrigger>
            <TabsTrigger value="rank" className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Ranks</TabsTrigger>
            <TabsTrigger value="cosmetic" className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Cosmetics</TabsTrigger>
            <TabsTrigger value="booster" className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Boosters</TabsTrigger>
            <TabsTrigger value="bundle" className="px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Bundles</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => (
            <Card key={i} className="bg-card border-border">
              <div className="aspect-video w-full bg-muted animate-pulse" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-8 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : filteredItems?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground border border-border rounded-lg bg-card/50">
            No items found in this category.
          </div>
        ) : (
          filteredItems?.filter(item => !item.featured || category !== "all").map(item => (
            <Card key={item.id} className="bg-card border-border hover:border-primary/50 transition-colors flex flex-col">
              {item.imageUrl && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-secondary text-muted-foreground border-border flex items-center gap-1 uppercase tracking-wider text-[10px]">
                    {getCategoryIcon(item.category)} {item.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                <div className="text-2xl font-bold font-mono text-primary">${item.price.toFixed(2)}</div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Need Check icon for featured features
function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}