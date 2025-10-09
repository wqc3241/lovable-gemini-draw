import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, Sparkles, Download, Upload, Image as ImageIcon, ChevronLeft, ChevronRight, FileText, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState("auto");
  const [imageCount, setImageCount] = useState(1);
  const [mode, setMode] = useState<"generate" | "edit" | "prompt">("generate");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [analyzedPrompt, setAnalyzedPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [promptImage, setPromptImage] = useState<string | null>(null);
  const [pastedImages, setPastedImages] = useState<string[]>([]);
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

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    // Check if clipboard contains an image
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.startsWith('image/')) {
        e.preventDefault(); // Prevent default paste behavior for images
        
        const file = item.getAsFile();
        if (!file) continue;

        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          setPastedImages(prev => [...prev, imageData]);
          toast.success("Image pasted! It will be included with your prompt.");
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemovePastedImage = (index: number) => {
    setPastedImages(prev => prev.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  const handleGenerate = async () => {
    if (mode === "edit" && !uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    setCurrentImageIndex(0);

    console.log(`🎨 Starting parallel generation of ${imageCount} image(s)`);

    try {
      // Create an array of promises for parallel generation
      const generatePromises = Array.from({ length: imageCount }, async (_, i) => {
        console.log(`📸 Starting generation ${i + 1} of ${imageCount}`);
        
        try {
          const { data, error } = await supabase.functions.invoke("generate-image", {
            body: { 
              prompt,
              imageData: mode === "edit" ? uploadedImage : null,
              aspectRatio,
              pastedImages: pastedImages.length > 0 ? pastedImages : null,
            },
          });
          
          return { index: i, data, error };
        } catch (innerError) {
          console.error(`❌ Image ${i + 1} unexpected error:`, innerError);
          return { index: i, data: null, error: innerError };
        }
      });

      // Wait for all images to generate in parallel
      const results = await Promise.allSettled(generatePromises);

      // Process all results
      const newImages: string[] = [];
      let successCount = 0;
      let failCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { data, error } = result.value;
          
          if (!error && data?.imageUrl) {
            newImages.push(data.imageUrl);
            successCount++;
            console.log(`✅ Image ${index + 1} generated successfully`);
          } else {
            failCount++;
            console.error(`❌ Image ${index + 1} failed:`, error || 'No imageUrl');
            
            // Show detailed error for single image generation
            if (imageCount === 1) {
              if (data?.error && data?.details) {
                toast.error(data.error, {
                  description: data.details,
                  duration: 10000,
                });
              } else {
                toast.error(error?.message || "Failed to generate image");
              }
            }
          }
        } else {
          failCount++;
          console.error(`❌ Image ${index + 1} rejected:`, result.reason);
        }
      });

      setGeneratedImages(newImages);

      if (successCount > 0) {
        toast.success(
          imageCount === 1 
            ? (mode === "edit" ? "Image edited successfully!" : "Image generated successfully!")
            : `Successfully generated ${successCount} of ${imageCount} images!`
        );
        setPastedImages([]); // Clear pasted images after successful generation
      }
      
      if (failCount > 0 && imageCount > 1) {
        toast.error(`${failCount} image(s) failed to generate`);
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsGenerating(false);
      console.log("🏁 handleGenerate finished");
    }
  };

  const handleTouchGenerate = (e: React.TouchEvent) => {
    e.preventDefault();
    handleGenerate();
  };

  // Helper function to convert base64 data URL to Blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(parts[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleDownloadAll = async () => {
    if (generatedImages.length === 0 || isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      if (generatedImages.length === 1) {
        // Single image - download directly (no ZIP needed)
        let blob: Blob;
        let blobUrl: string;
        
        // Check if it's a base64 data URL
        if (generatedImages[0].startsWith('data:')) {
          console.log('🔄 Converting base64 image to blob');
          blob = dataURLtoBlob(generatedImages[0]);
          blobUrl = URL.createObjectURL(blob);
        } else {
          const response = await fetch(generatedImages[0]);
          blob = await response.blob();
          blobUrl = URL.createObjectURL(blob);
        }
        
        if (isMobile) {
          window.open(blobUrl, '_blank');
          toast.success("Image opened in new tab. Long press to save!");
        } else {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `ai-generated-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Image downloaded!");
        }
        
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } else {
        // Multiple images - create ZIP file
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        const timestamp = Date.now();
        
        console.log(`📦 Creating ZIP with ${generatedImages.length} images`);
        
        // Fetch all images in parallel and add to ZIP
        const imagePromises = generatedImages.map(async (imageUrl, index) => {
          try {
            let blob: Blob;
            
            // Check if it's a base64 data URL
            if (imageUrl.startsWith('data:')) {
              console.log(`🔄 Converting base64 image ${index + 1} to blob`);
              blob = dataURLtoBlob(imageUrl);
            } else {
              // Regular HTTP URL - fetch it
              console.log(`📥 Fetching image ${index + 1} from URL`);
              const response = await fetch(imageUrl);
              blob = await response.blob();
            }
            
            const filename = `ai-generated-${timestamp}-${index + 1}.png`;
            zip.file(filename, blob);
            console.log(`✅ Added ${filename} to ZIP (${(blob.size / 1024).toFixed(1)} KB)`);
          } catch (error) {
            console.error(`❌ Failed to process image ${index + 1}:`, error);
            throw error;
          }
        });
        
        // Wait for all images to be added
        await Promise.all(imagePromises);
        
        // Generate ZIP file
        console.log('🗜️ Compressing ZIP file...');
        const zipBlob = await zip.generateAsync({ 
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 }
        });
        
        console.log(`✅ ZIP created: ${(zipBlob.size / 1024 / 1024).toFixed(2)} MB`);
        
        // Download ZIP file
        const blobUrl = URL.createObjectURL(zipBlob);
        const zipFilename = `ai-images-${timestamp}.zip`;
        
        if (isMobile) {
          window.open(blobUrl, '_blank');
          toast.success(`ZIP file ready! (${generatedImages.length} images)`, {
            description: "Tap to download",
            duration: 5000
          });
        } else {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = zipFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success(`${generatedImages.length} images downloaded!`, {
            description: `Saved as ${zipFilename}`,
            duration: 5000
          });
        }
        
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download images. Please try again.");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleTouchDownload = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDownloadAll();
  };

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

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : generatedImages.length - 1);
    } else {
      setCurrentImageIndex((prev) => prev < generatedImages.length - 1 ? prev + 1 : 0);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!promptImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setAnalyzedPrompt("");

    try {
      console.log('🔍 Starting image analysis...');
      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: { imageData: promptImage }
      });

      if (error) throw error;

      if (data?.prompt) {
        setAnalyzedPrompt(data.prompt);
        toast.success("Prompt generated successfully!");
      } else {
        throw new Error("No prompt returned");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(analyzedPrompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy prompt");
    }
  };

  const handleUsePromptInGenerate = () => {
    setPrompt(analyzedPrompt);
    setMode("generate");
    toast.success("Prompt loaded in Generate tab!");
  };

  const handleCopyPromptText = async () => {
    if (!prompt.trim()) {
      toast.error("No prompt to copy");
      return;
    }

    try {
      // Use Clipboard API (works on all modern browsers including mobile)
      await navigator.clipboard.writeText(prompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      // Fallback method for older browsers or if clipboard API fails
      try {
        const textArea = document.createElement("textarea");
        textArea.value = prompt;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        toast.success("Prompt copied to clipboard!");
      } catch (fallbackError) {
        console.error("Failed to copy:", fallbackError);
        toast.error("Failed to copy prompt");
      }
    }
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
            <Tabs value={mode} onValueChange={(v) => { setMode(v as "generate" | "edit" | "prompt"); setPastedImages([]); }} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="generate" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="edit" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="prompt" className="gap-2">
                <FileText className="h-4 w-4" />
                Image Prompt
              </TabsTrigger>
            </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="image-count" className="mb-2 block text-sm font-medium">
                      Number of Images
                    </Label>
                    <Select value={imageCount.toString()} onValueChange={(v) => setImageCount(parseInt(v))}>
                      <SelectTrigger id="image-count" className="bg-background">
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="1">1 Image</SelectItem>
                        <SelectItem value="3">3 Images</SelectItem>
                        <SelectItem value="5">5 Images</SelectItem>
                        <SelectItem value="9">9 Images</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="prompt" className="text-sm font-medium">
                      Prompt
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPromptText}
                      disabled={!prompt.trim()}
                      className="h-7 gap-1.5 text-xs"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy Prompt
                    </Button>
                  </div>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the image you want to generate... (You can paste images here with Ctrl+V)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onPaste={handlePaste}
                    className="min-h-[120px] resize-none bg-background"
                  />

                  {/* Display pasted images */}
                  {pastedImages.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Pasted images ({pastedImages.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pastedImages.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img}
                              alt={`Pasted ${idx + 1}`}
                              className="h-20 w-20 rounded border border-border object-cover"
                            />
                            <button
                              onClick={() => handleRemovePastedImage(idx)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="image-count-edit" className="mb-2 block text-sm font-medium">
                      Number of Images
                    </Label>
                    <Select value={imageCount.toString()} onValueChange={(v) => setImageCount(parseInt(v))}>
                      <SelectTrigger id="image-count-edit" className="bg-background">
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="1">1 Image</SelectItem>
                        <SelectItem value="3">3 Images</SelectItem>
                        <SelectItem value="5">5 Images</SelectItem>
                        <SelectItem value="9">9 Images</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="edit-prompt" className="text-sm font-medium">
                      Edit Instructions
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyPromptText}
                      disabled={!prompt.trim()}
                      className="h-7 gap-1.5 text-xs"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy Prompt
                    </Button>
                  </div>
                  <Textarea
                    id="edit-prompt"
                    placeholder="Describe how you want to edit the image... (You can paste reference images here with Ctrl+V)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onPaste={handlePaste}
                    className="min-h-[120px] resize-none bg-background"
                  />

                  {/* Display pasted images */}
                  {pastedImages.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Reference images ({pastedImages.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pastedImages.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img}
                              alt={`Reference ${idx + 1}`}
                              className="h-20 w-20 rounded border border-border object-cover"
                            />
                            <button
                              onClick={() => handleRemovePastedImage(idx)}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

              <TabsContent value="prompt" className="space-y-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    Upload Image to Analyze
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith("image/")) {
                          toast.error("Please upload an image file");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setPromptImage(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                      id="prompt-image-upload"
                    />
                    <label
                      htmlFor="prompt-image-upload"
                      className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-8 transition-colors hover:border-primary hover:bg-accent"
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Click to upload an image for analysis
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {promptImage && (
                    <div className="mt-4">
                      <img
                        src={promptImage}
                        alt="Image to analyze"
                        className="w-full rounded-lg border border-border"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleAnalyzeImage}
                  disabled={isAnalyzing || !promptImage}
                  className="w-full bg-gradient-to-r from-primary to-accent-foreground text-primary-foreground hover:opacity-90"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Prompt from Image
                    </>
                  )}
                </Button>

                {analyzedPrompt && (
                  <div className="mt-6 space-y-3">
                    <Label className="text-sm font-medium">Generated Prompt:</Label>
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {analyzedPrompt}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyPrompt}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Prompt
                      </Button>
                      <Button
                        onClick={handleUsePromptInGenerate}
                        className="flex-1 bg-gradient-to-r from-primary to-accent-foreground"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Use in Generate
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Output Section */}
          <Card className="border-border bg-card p-6 shadow-lg">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">
                  Result {generatedImages.length > 1 && `(${currentImageIndex + 1}/${generatedImages.length})`}
                </h2>
                {generatedImages.length > 0 && (
                  <Button
                    onClick={handleDownloadAll}
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
                        Save {generatedImages.length > 1 ? 'All' : 'Image'}
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {/* Thumbnail carousel */}
              {generatedImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {generatedImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary ring-2 ring-primary/50' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div 
              className="relative w-full overflow-hidden rounded-lg bg-muted/30 border border-border"
              style={
                generatedImages[currentImageIndex] && aspectRatio !== "auto"
                  ? { aspectRatio: getAspectRatioStyle(aspectRatio) }
                  : { minHeight: "400px" }
              }
            >
              {isGenerating ? (
            <div className="flex h-full min-h-[400px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Generating {imageCount} {imageCount === 1 ? 'image' : 'images'}...
                </p>
              </div>
            </div>
              ) : generatedImages.length > 0 ? (
                <div className="w-full h-full cursor-pointer group relative">
                  <img
                    src={generatedImages[currentImageIndex]}
                    alt={`Generated ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    onClick={() => setIsFullscreenOpen(true)}
                  />
                  
                  {/* Navigation arrows */}
                  {generatedImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage('prev');
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage('next');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
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
          <div className="relative w-full h-full flex items-center justify-center">
            {generatedImages[currentImageIndex] && (
              <>
                <img
                  src={generatedImages[currentImageIndex]}
                  alt="Generated fullscreen"
                  className="max-w-full max-h-[95vh] object-contain"
                  onClick={() => setIsFullscreenOpen(false)}
                />
                
                {/* Navigation in fullscreen */}
                {generatedImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-3"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-3"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/70 px-4 py-2 rounded-full">
                      {currentImageIndex + 1} / {generatedImages.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
