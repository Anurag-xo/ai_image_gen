"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

type ImageDisplayProps = {
  imageUrl: string | null;
  prompt: string;
  isLoading: boolean;
};

export function ImageDisplay({ imageUrl, prompt, isLoading }: ImageDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;
    
    try {
      setIsDownloading(true);
      
      // Fetch the image and convert to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `ai-image-${Date.now()}.png`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Image downloaded successfully");
    } catch (error) {
      toast.error("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: "AI Generated Image",
          text: prompt,
          url: imageUrl,
        });
      } else {
        await navigator.clipboard.writeText(imageUrl);
        toast.success("Image URL copied to clipboard");
      }
    } catch (error) {
      toast.error("Failed to share image");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border">
        <CardContent className="p-0">
          <AspectRatio ratio={1}>
            {imageUrl ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <Image
                  src={imageUrl}
                  alt={prompt || "Generated image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? "Downloading..." : "Download"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-muted/30">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-32 h-32">
                      <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
                      <div className="absolute inset-3 rounded-full border-t-2 border-primary/70 animate-spin animation-delay-150"></div>
                      <div className="absolute inset-6 rounded-full border-t-2 border-primary/40 animate-spin animation-delay-300"></div>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Creating your masterpiece...
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">
                      Your generated image will appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </AspectRatio>
        </CardContent>
      </Card>
      
      {imageUrl && prompt && (
        <div className="mt-3 text-sm text-muted-foreground">
          <p className="italic">"{prompt}"</p>
        </div>
      )}
    </div>
  );
}