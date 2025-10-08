import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const examplePrompts = [
    "A serene mountain landscape at sunset with vibrant orange and purple skies",
    "A futuristic city with flying cars and neon lights",
    "A cute robot playing with a kitten in a garden full of flowers",
    "An underwater scene with colorful coral reefs and tropical fish",
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setImageUrl(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt },
      });

      if (error) {
        console.error("Function error:", error);
        toast.error(error.message || "Failed to generate image");
        return;
      }

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        toast.success("Image generated successfully!");
      } else {
        toast.error("No image was generated");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Powered by Free Gemini AI
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            AI Image Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Transform your ideas into stunning images with AI
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-semibold">Enter Your Prompt</h2>
            
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mb-4 min-h-[120px] resize-none bg-background/50"
            />

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
              size="lg"
            >
              {isGenerating ? (
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

            {/* Example Prompts */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-muted-foreground">Try these examples:</p>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="w-full rounded-lg border border-border/50 bg-background/50 p-3 text-left text-sm transition-colors hover:border-primary/50 hover:bg-background"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Generated Image</h2>
              {imageUrl && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>

            <div className="relative aspect-square overflow-hidden rounded-lg bg-background/50">
              {isGenerating ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Creating your image...</p>
                  </div>
                </div>
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Sparkles className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    <p className="text-sm">Your generated image will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Info Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>All Gemini models are free to use until October 13, 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
