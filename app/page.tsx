"use client";

import { useState, useEffect } from "react";
import { nanoid } from "@/lib/utils";
import { toast } from "sonner";

import { Header } from "@/components/layout/header";
import { PromptForm } from "@/components/prompt-form";
import { ImageDisplay } from "@/components/image-display";
import { ImageHistory, type HistoryItem } from "@/components/image-history";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("imageHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
        setHistory(parsedHistory);
      } catch (error) {
        console.error("Failed to parse history:", error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("imageHistory", JSON.stringify(history));
  }, [history]);

  const generateImage = async (userPrompt: string) => {
    setPrompt(userPrompt);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate image");
      }

      const data = await response.json();
      setImageUrl(`${data.imageUrl}`);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: nanoid(),
        imageUrl: data.imageUrl,
        prompt: userPrompt,
        createdAt: new Date(),
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setImageUrl(item.imageUrl);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container py-8 md:py-12">
        <div className="mx-auto flex max-w-[980px] flex-col items-center">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl mb-3">
            AI Image Generator
          </h1>
          <p className="text-center text-muted-foreground max-w-[700px] mb-8">
            Create stunning images with AI. Just describe what you want to see,
            and watch the magic happen.
          </p>

          <PromptForm onSubmit={generateImage} isLoading={isLoading} />
          <ImageDisplay
            imageUrl={imageUrl}
            prompt={prompt}
            isLoading={isLoading}
          />
          <ImageHistory
            history={history}
            onSelectImage={handleSelectFromHistory}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
