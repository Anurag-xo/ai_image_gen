"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { promptSuggestions } from "@/lib/prompt-suggestions";

const formSchema = z.object({
  prompt: z
    .string()
    .min(3, { message: "Prompt must be at least 3 characters long" })
    .max(1000, { message: "Prompt is too long (max 1000 characters)" }),
});

type FormValues = z.infer<typeof formSchema>;

type PromptFormProps = {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
};

export function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values.prompt);
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    }
  };

  const applyPromptSuggestion = (suggestion: string) => {
    form.setValue("prompt", suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Describe the image you want to generate..."
                    className="min-h-24 resize-none text-base p-4 bg-background border-border shadow-sm focus-visible:ring-2 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="w-full sm:w-auto"
            >
              {showSuggestions ? "Hide Suggestions" : "Need Ideas?"}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset()}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              Clear
            </Button>
          </div>
        </form>
      </Form>

      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mt-4 p-4 bg-muted/50 backdrop-blur-sm rounded-lg border border-border shadow-sm"
        >
          <h3 className="font-medium mb-2">Prompt Suggestions</h3>
          <div className="grid grid-cols-1 gap-2">
            {promptSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                className="justify-start h-auto py-2 px-3 text-left text-sm hover:bg-background"
                onClick={() => applyPromptSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}