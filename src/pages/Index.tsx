import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Sparkles, Download, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("auto");
  const [mode, setMode] = useState<"generate" | "edit">("generate");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const isMobile = useIsMobile();

  const examplePrompts = [
    "A serene mountain landscape at sunset with vibrant orange and purple skies",
    "A futuristic city with flying cars and neon lights",
    "A cute robot playing with a kitten in a garden full of flowers",
    "An underwater scene with colorful coral reefs and tropical fish",
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      setMode("edit");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    console.log("🚀 handleGenerate called - Start");
    console.log("📝 Mode:", mode);
    console.log("📝 Prompt:", prompt);
    console.log("📝 Has uploaded image:", !!uploadedImage);
    console.log("📝 Aspect ratio:", aspectRatio);

    // Haptic feedback for iOS
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (!prompt.trim()) {
      console.log("❌ No prompt entered");
      toast.error("Please enter a prompt");
      return;
    }

    if (mode === "edit" && !uploadedImage) {
      console.log("❌ Edit mode but no image uploaded");
      toast.error("Please upload an image to edit");
      return;
    }

    console.log("✅ Validation passed, starting generation");
    setIsGenerating(true);
    setImageUrl(null);

    try {
      console.log("📡 Calling edge function...");
      const startTime = Date.now();

      // Add timeout handling
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timeout")), 60000)
      );

      const functionCall = supabase.functions.invoke("generate-image", {
        body: { 
          prompt,
          imageData: mode === "edit" ? uploadedImage : null,
          aspectRatio,
        },
      });

      const { data, error } = await Promise.race([
        functionCall,
        timeoutPromise
      ]) as any;

      const duration = Date.now() - startTime;
      console.log(`⏱️ Function completed in ${duration}ms`);

      if (error) {
        console.error("❌ Function error:", error);
        
        // Check if error has details (from edge function)
        if (data?.error && data?.details) {
          toast.error(data.error, {
            description: data.details,
            duration: 10000, // Longer duration for detailed message
          });
        } else {
          toast.error(error.message || "Failed to generate image");
        }
        return;
      }

      console.log("📦 Response data:", data ? "received" : "empty");
      
      if (data?.imageUrl) {
        console.log("✅ Image URL received, length:", data.imageUrl.length);
        setImageUrl(data.imageUrl);
        toast.success(mode === "edit" ? "Image edited successfully!" : "Image generated successfully!");
      } else {
        console.log("❌ No imageUrl in response");
        
        // Check if we have error details from edge function
        if (data?.error && data?.details) {
          toast.error(data.error, {
            description: data.details,
            duration: 10000,
          });
        } else {
          toast.error("No image was generated. Please try again.");
        }
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error details:", errorMessage);
      
      if (errorMessage === "Request timeout") {
        toast.error("Request timed out. Please check your connection and try again.");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      console.log("🏁 handleGenerate completed");
      setIsGenerating(false);
    }
  };

  // iOS-specific touch handler
  const handleTouchGenerate = (e: React.TouchEvent) => {
    console.log("👆 Touch event detected on iOS");
    e.preventDefault();
    handleGenerate();
  };

  const handleDownload = async () => {
    if (!imageUrl || isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // Convert data URL to Blob for better mobile compatibility
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      if (isMobile) {
        // Mobile strategy: Open in new tab
        window.open(blobUrl, '_blank');
        toast.success("Image opened in new tab. Long press to save!");
      } else {
        // Desktop strategy: Trigger download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `ai-generated-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Image downloaded!");
      }
      
      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image. Please try again.");
    } finally {
      // Reset download state after cooldown
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleTouchDownload = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDownload();
  };

  // Convert aspect ratio string to CSS aspect-ratio value
  const getAspectRatioStyle = (ratio: string) => {
    const ratioMap: Record<string, string> = {
      "1:1": "1/1",
      "2:3": "2/3",
      "3:2": "3/2",
      "3:4": "3/4",
      "4:3": "4/3",
      "4:5": "4/5",
      "5:4": "5/4",
      "9:16": "9/16",
      "16:9": "16/9",
      "21:9": "21/9",
    };
    return ratioMap[ratio];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Powered by Free Gemini AI
          </div>
          <h1 className="mb-3 bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            AI Image Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Transform your ideas into stunning images with AI
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="border-border bg-card p-6 shadow-lg">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "generate" | "edit")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="generate" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="edit" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Edit
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <div>
                  <Label htmlFor="aspect-ratio" className="mb-2 block text-sm font-medium">
                    Aspect Ratio
                  </Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger id="aspect-ratio" className="bg-background">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      <SelectItem value="2:3">2:3 (Portrait)</SelectItem>
                      <SelectItem value="3:2">3:2 (Landscape)</SelectItem>
                      <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                      <SelectItem value="4:3">4:3 (Landscape)</SelectItem>
                      <SelectItem value="4:5">4:5 (Portrait)</SelectItem>
                      <SelectItem value="5:4">5:4 (Landscape)</SelectItem>
                      <SelectItem value="9:16">9:16 (Tall)</SelectItem>
                      <SelectItem value="16:9">16:9 (Wide)</SelectItem>
                      <SelectItem value="21:9">21:9 (Ultra Wide)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="prompt" className="mb-2 block text-sm font-medium">
                    Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the image you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none bg-background"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  onTouchEnd={handleTouchGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-primary to-accent-foreground text-primary-foreground hover:opacity-90 active:scale-95 transition-transform touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
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
                <div className="mt-4">
                  <p className="mb-3 text-sm font-medium text-muted-foreground">Try these examples:</p>
                  <div className="space-y-2">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(example)}
                        className="w-full rounded-lg border border-border bg-background p-3 text-left text-sm transition-colors hover:border-primary hover:bg-accent"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="space-y-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Upload Image to Edit
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-8 transition-colors hover:border-primary hover:bg-accent"
                    >
                      {uploadedImage ? (
                        <img src={uploadedImage} alt="Uploaded" className="max-h-48 rounded-lg" />
                      ) : (
                        <>
                          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload an image</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="aspect-ratio-edit" className="mb-2 block text-sm font-medium">
                    Aspect Ratio
                  </Label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger id="aspect-ratio-edit" className="bg-background">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      <SelectItem value="2:3">2:3 (Portrait)</SelectItem>
                      <SelectItem value="3:2">3:2 (Landscape)</SelectItem>
                      <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                      <SelectItem value="4:3">4:3 (Landscape)</SelectItem>
                      <SelectItem value="4:5">4:5 (Portrait)</SelectItem>
                      <SelectItem value="5:4">5:4 (Landscape)</SelectItem>
                      <SelectItem value="9:16">9:16 (Tall)</SelectItem>
                      <SelectItem value="16:9">16:9 (Wide)</SelectItem>
                      <SelectItem value="21:9">21:9 (Ultra Wide)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-prompt" className="mb-2 block text-sm font-medium">
                    Edit Instructions
                  </Label>
                  <Textarea
                    id="edit-prompt"
                    placeholder="Describe how you want to edit the image..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none bg-background"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  onTouchEnd={handleTouchGenerate}
                  disabled={isGenerating || !uploadedImage}
                  className="w-full bg-gradient-to-r from-primary to-accent-foreground text-primary-foreground hover:opacity-90 active:scale-95 transition-transform touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Editing...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Edit Image
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Output Section */}
          <Card className="border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Result</h2>
              {imageUrl && (
                <Button
                  onClick={handleDownload}
                  onTouchEnd={handleTouchDownload}
                  disabled={isDownloading}
                  size="default"
                  className="gap-2"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Save Image
                    </>
                  )}
                </Button>
              )}
            </div>

            <div 
              className="relative w-full overflow-hidden rounded-lg bg-muted/30 border border-border"
              style={
                imageUrl && aspectRatio !== "auto"
                  ? { aspectRatio: getAspectRatioStyle(aspectRatio) }
                  : { minHeight: "400px" }
              }
            >
              {isGenerating ? (
                <div className="flex h-full min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {mode === "edit" ? "Editing your image..." : "Creating your image..."}
                    </p>
                  </div>
                </div>
              ) : imageUrl ? (
                <div 
                  className="w-full h-full cursor-pointer group relative"
                  onClick={() => setIsFullscreenOpen(true)}
                >
                  <img
                    src={imageUrl}
                    alt="Generated"
                    className="w-full h-full object-contain transition-opacity group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                    <p className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                      Click to view fullscreen
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[400px] items-center justify-center text-muted-foreground">
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

      {/* Fullscreen Image Dialog */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0">
          <div 
            className="relative w-full h-full cursor-pointer flex items-center justify-center"
            onClick={() => setIsFullscreenOpen(false)}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Generated fullscreen"
                className="max-w-full max-h-[95vh] object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
