"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type HistoryItem = {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: Date;
};

type ImageHistoryProps = {
  history: HistoryItem[];
  onSelectImage: (item: HistoryItem) => void;
};

export function ImageHistory({ history, onSelectImage }: ImageHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-2xl mx-auto mt-8 border border-border rounded-lg overflow-hidden bg-card/50 backdrop-blur-sm shadow-sm"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-4 h-auto"
        >
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>Previously Generated Images ({history.length})</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ScrollArea className="h-64 w-full p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square rounded-md overflow-hidden cursor-pointer group"
                onClick={() => onSelectImage(item)}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.prompt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 150px, 200px"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-white text-xs line-clamp-2">
                    {item.prompt}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}