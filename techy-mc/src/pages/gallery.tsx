import { useListGalleryImages } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera } from "lucide-react";

export default function Gallery() {
  const { data: gallery, isLoading } = useListGalleryImages();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6 border border-primary/50 glow-box">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-display font-bold text-primary mb-4 glow-text uppercase tracking-wider">
          Community Gallery
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Epic builds, intense battles, and memorable moments captured by our players.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array(8).fill(0).map((_, i) => (
            <Card key={i} className="bg-card border-border overflow-hidden">
              <Skeleton className="w-full aspect-video" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : gallery?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground border border-border rounded-lg bg-card/50">
            No screenshots have been uploaded yet.
          </div>
        ) : (
          gallery?.map((image) => (
            <Card key={image.id} className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-all glow-box">
              <div className="aspect-video overflow-hidden bg-muted relative">
                <img 
                  src={image.imageUrl} 
                  alt={image.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    By {image.uploadedBy}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold mb-1 truncate">{image.title}</h3>
                {image.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{image.description}</p>
                )}
                <div className="text-xs text-muted-foreground mt-3">
                  {new Date(image.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}