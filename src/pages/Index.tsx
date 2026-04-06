import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Loader2,
  Sparkles,
  Download,
  Upload,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  Copy,
  Zap,
  Crown,
  Check,
  X,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import cinellyLogoImg from "@/assets/cinely-logo.png";
import ImageSlideshow from "@/components/ImageSlideshow";
import UserMenu from "@/components/UserMenu";
import UpgradeDialog from "@/components/UpgradeDialog";
import AuthDialog from "@/components/AuthDialog";
import { SEO } from "@/components/SEO";
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
  const [model, setModel] = useState("google/gemini-2.5-flash-image-preview");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"credit_limit" | "model_restricted" | "batch_restricted">("credit_limit");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null); // pricing checkout state
  const isMobile = useIsMobile();
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const [session, setSessionState] = useState<any>(null);
  const [monthlyCredits, setMonthlyCredits] = useState<{ remaining: number; total: number } | null>(null);

  // Track auth state for UI gating
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => setSessionState(s));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => setSessionState(s));
    return () => subscription.unsubscribe();
  }, []);

  // Fetch monthly credits when logged in
  const fetchCredits = useCallback(async () => {
    if (!session) { setMonthlyCredits(null); return; }
    try {
      const { data, error } = await supabase.functions.invoke("check-credits", {
        body: { action: "check", model, imageCount: 1, generationType: mode },
      });
      if (!error && data) {
        setMonthlyCredits({ remaining: data.creditsRemaining, total: data.creditsTotal });
      }
    } catch { /* ignore */ }
  }, [session, model, mode]);

  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  // Real-time public stats
  const [stats, setStats] = useState<{ total_users: number; total_images: number }>({ total_users: 0, total_images: 0 });

  const fetchStats = useCallback(async () => {
    const { data } = await supabase.rpc("get_public_stats" as any);
    if (data) setStats(data as { total_users: number; total_images: number });
  }, []);

  useEffect(() => {
    fetchStats();
    const channel = supabase
      .channel("public-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "generation_history" }, fetchStats)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchStats]);

  const scrollToResults = () => {
    if (isMobile && resultSectionRef.current) {
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    }
  };
  // Full pool of example prompts
  const ALL_EXAMPLE_PROMPTS = [
    "A serene mountain landscape at sunset with vibrant orange and purple skies",
    "A futuristic city with flying cars and neon lights",
    "A cute robot playing with a kitten in a garden full of flowers",
    "An underwater scene with colorful coral reefs and tropical fish",
    "A mystical forest with glowing mushrooms and fairy lights",
    "A steampunk airship flying through cloudy Victorian skies",
    "A cozy coffee shop on a rainy autumn day with warm lighting",
    "A majestic dragon perched on a crystalline mountain peak",
    "A cyberpunk street market with holographic advertisements",
    "A peaceful Japanese garden with cherry blossoms and koi pond",
    "A space station orbiting a colorful nebula with distant planets",
    "A medieval castle on a cliff overlooking stormy seas",
    "A tropical beach at golden hour with palm trees and turquoise water",
    "An enchanted library filled with floating books and magical artifacts",
    "A vintage diner from the 1950s with neon signs and classic cars",
    "A bioluminescent alien jungle with exotic plants and creatures",
    "A snow-covered village during Christmas with twinkling lights",
    "A surreal desert landscape with melting clocks and impossible geometry",
  ];

  // Randomly select 4 prompts on each page load
  const examplePrompts = useMemo(() => {
    const shuffled = [...ALL_EXAMPLE_PROMPTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);
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
      if (item.type.startsWith("image/")) {
        e.preventDefault(); // Prevent default paste behavior for images

        const file = item.getAsFile();
        if (!file) continue;

        // Convert to base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          setPastedImages((prev) => [...prev, imageData]);
          toast.success("Image pasted! It will be included with your prompt.");
        };
        reader.readAsDataURL(file);
      }
    }
  };
  const handleRemovePastedImage = (index: number) => {
    setPastedImages((prev) => prev.filter((_, i) => i !== index));
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

    // Check auth — unauthenticated users can only use example prompts
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const isExamplePrompt = ALL_EXAMPLE_PROMPTS.some(
        (ex) => ex.toLowerCase() === prompt.trim().toLowerCase()
      );
      if (!isExamplePrompt) {
        toast.error("Create a free account to generate with custom prompts", {
          action: {
            label: "Sign Up",
            onClick: () => setAuthDialogOpen(true),
          },
        });
        return;
      }
    }
    if (session) {
      try {
        const { data: creditData, error: creditError } = await supabase.functions.invoke("check-credits", {
          body: { action: "check", model, imageCount, generationType: mode },
        });
        if (creditError) {
          console.error("Credit check error:", creditError);
          toast.error("Failed to check credits. Please try again.");
          return;
        }
        if (!creditData?.allowed) {
          // Determine reason
          if (creditData?.reason === "model_restricted") {
            setUpgradeReason("model_restricted");
          } else if (creditData?.reason === "batch_restricted") {
            setUpgradeReason("batch_restricted");
          } else {
            setUpgradeReason("credit_limit");
          }
          setUpgradeOpen(true);
          return;
        }
      } catch (err) {
        console.error("Credit check failed:", err);
      }
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    setCurrentImageIndex(0);
    console.log(`🎨 Starting parallel generation of ${imageCount} image(s)`);
    try {
      // Create an array of promises for parallel generation
      const generatePromises = Array.from(
        {
          length: imageCount,
        },
        async (_, i) => {
          console.log(`📸 Starting generation ${i + 1} of ${imageCount}`);
          try {
            const { data, error } = await supabase.functions.invoke("generate-image", {
              body: {
                prompt,
                imageData: mode === "edit" ? uploadedImage : null,
                aspectRatio,
                pastedImages: pastedImages.length > 0 ? pastedImages : null,
                model,
              },
            });
            return {
              index: i,
              data,
              error,
            };
          } catch (innerError) {
            console.error(`❌ Image ${i + 1} unexpected error:`, innerError);
            return {
              index: i,
              data: null,
              error: innerError,
            };
          }
        },
      );

      // Wait for all images to generate in parallel
      const results = await Promise.allSettled(generatePromises);

      // Process all results and apply watermarks
      const newImages: string[] = [];
      let successCount = 0;
      let failCount = 0;

      // Process watermarks in parallel
      const watermarkPromises = results.map(async (result, index) => {
        if (result.status === "fulfilled") {
          const { data, error } = result.value;
          if (!error && data?.imageUrl) {
            try {
              const watermarkedImage = await addWatermark(data.imageUrl);
              console.log(`✅ Image ${index + 1} generated and watermarked successfully`);
              return {
                success: true,
                image: watermarkedImage,
                index,
              };
            } catch (watermarkError) {
              console.error(`⚠️ Image ${index + 1} watermark failed, using original:`, watermarkError);
              return {
                success: true,
                image: data.imageUrl,
                index,
              };
            }
          } else {
            console.error(`❌ Image ${index + 1} failed:`, error || "No imageUrl");

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
            return {
              success: false,
              error,
              index,
            };
          }
        } else {
          console.error(`❌ Image ${index + 1} rejected:`, result.reason);
          return {
            success: false,
            error: result.reason,
            index,
          };
        }
      });
      const watermarkResults = await Promise.all(watermarkPromises);

      // Collect results
      watermarkResults.forEach((result) => {
        if (result.success && result.image) {
          newImages.push(result.image);
          successCount++;
        } else {
          failCount++;
        }
      });
      setGeneratedImages(newImages);
      if (successCount > 0) {
        toast.success(
          imageCount === 1
            ? mode === "edit"
              ? "Image edited successfully!"
              : "Image generated successfully!"
            : `Successfully generated ${successCount} of ${imageCount} images!`,
        );
        setPastedImages([]); // Clear pasted images after successful generation
        scrollToResults(); // Auto-scroll to results on mobile

        // Save to history and decrement credits if logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            // Decrement credits
            supabase.functions.invoke("check-credits", {
              body: { action: "decrement", model, imageCount: successCount, generationType: mode },
            }).then(({ error }) => {
              if (error) console.error("Failed to decrement credits:", error);
            });

            // Save to history
            newImages.forEach((imageUrl) => {
              supabase.from("generation_history").insert({
                user_id: session.user.id,
                prompt,
                model,
                aspect_ratio: aspectRatio,
                image_url: imageUrl,
                mode,
              }).then(({ error }) => {
                if (error) console.error("Failed to save history:", error);
              });
            });
          }
        });
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
    const parts = dataURL.split(",");
    const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(parts[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], {
      type: mime,
    });
  };

  // Add watermark to generated images
  const addWatermark = async (imageDataUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const logo = new Image();
      img.crossOrigin = "anonymous";
      logo.crossOrigin = "anonymous";
      let imagesLoaded = 0;
      const totalImages = 2;
      const onImageLoad = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          applyWatermark();
        }
      };
      const applyWatermark = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Calculate logo size (15% of image width)
        const logoWidthPercentage = 0.15;
        const logoWidth = img.width * logoWidthPercentage;
        const logoAspectRatio = logo.width / logo.height;
        const logoHeight = logoWidth / logoAspectRatio;

        // Position in bottom-right with padding
        const padding = Math.max(20, Math.floor(img.width * 0.02));
        const x = canvas.width - logoWidth - padding;
        const y = canvas.height - logoHeight - padding;

        // Apply 50% transparency
        ctx.globalAlpha = 0.5;

        // Draw logo with native transparency
        ctx.drawImage(logo, x, y, logoWidth, logoHeight);

        // Reset alpha
        ctx.globalAlpha = 1.0;

        // Convert to data URL
        resolve(canvas.toDataURL("image/png", 1.0));
      };
      img.onload = onImageLoad;
      logo.onload = onImageLoad;
      img.onerror = () => reject(new Error("Failed to load source image"));
      logo.onerror = () => reject(new Error("Failed to load watermark logo"));
      img.src = imageDataUrl;
      logo.src = cinellyLogoImg;
    });
  };
  const handleDownloadAll = async () => {
    if (generatedImages.length === 0 || isDownloading) return;
    setIsDownloading(true);
    
    // Helper function to format date as MM/DD/YY
    const formatDate = (timestamp: number) => {
      const date = new Date(timestamp);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${day}/${year}`;
    };
    
    try {
      if (generatedImages.length === 1) {
        // Single image - download directly (no ZIP needed)
        let blob: Blob;
        let blobUrl: string;

        // Check if it's a base64 data URL
        if (generatedImages[0].startsWith("data:")) {
          console.log("🔄 Converting base64 image to blob");
          blob = dataURLtoBlob(generatedImages[0]);
          blobUrl = URL.createObjectURL(blob);
        } else {
          const response = await fetch(generatedImages[0]);
          blob = await response.blob();
          blobUrl = URL.createObjectURL(blob);
        }
        if (isMobile) {
          window.open(blobUrl, "_blank");
          toast.success("Image opened in new tab. Long press to save!");
        } else {
          const link = document.createElement("a");
          link.href = blobUrl;
          const timestamp = Date.now();
          link.download = `cinely_generated_${formatDate(timestamp)}_${timestamp}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Image downloaded!");
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } else {
        // Multiple images - create ZIP file
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        const timestamp = Date.now();
        console.log(`📦 Creating ZIP with ${generatedImages.length} images`);

        // Fetch all images in parallel and add to ZIP
        const imagePromises = generatedImages.map(async (imageUrl, index) => {
          try {
            let blob: Blob;

            // Check if it's a base64 data URL
            if (imageUrl.startsWith("data:")) {
              console.log(`🔄 Converting base64 image ${index + 1} to blob`);
              blob = dataURLtoBlob(imageUrl);
            } else {
              // Regular HTTP URL - fetch it
              console.log(`📥 Fetching image ${index + 1} from URL`);
              const response = await fetch(imageUrl);
              blob = await response.blob();
            }
            const filename = `cinely_generated_${formatDate(timestamp)}_${timestamp}_${index + 1}.png`;
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
        console.log("🗜️ Compressing ZIP file...");
        const zipBlob = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: {
            level: 6,
          },
        });
        console.log(`✅ ZIP created: ${(zipBlob.size / 1024 / 1024).toFixed(2)} MB`);

        // Download ZIP file
        const blobUrl = URL.createObjectURL(zipBlob);
        const zipFilename = `ai-images-${timestamp}.zip`;
        if (isMobile) {
          window.open(blobUrl, "_blank");
          toast.success(`ZIP file ready! (${generatedImages.length} images)`, {
            description: "Tap to download",
            duration: 5000,
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
            duration: 5000,
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
  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : generatedImages.length - 1));
    } else {
      setCurrentImageIndex((prev) => (prev < generatedImages.length - 1 ? prev + 1 : 0));
    }
  };
  const handleAnalyzeImage = async () => {
    if (!promptImage) {
      toast.error("Please upload an image first");
      return;
    }

    // Check credits for authenticated users (counts as 1 generation)
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession) {
      try {
        const { data: creditData, error: creditError } = await supabase.functions.invoke("check-credits", {
          body: { action: "check", generationType: "prompt", imageCount: 1 },
        });
        if (creditError) {
          console.error("Credit check error:", creditError);
          toast.error("Failed to check credits. Please try again.");
          return;
        }
        if (!creditData?.allowed) {
          setUpgradeReason(creditData?.reason === "model_restricted" ? "model_restricted" : "credit_limit");
          setUpgradeOpen(true);
          return;
        }
      } catch (err) {
        console.error("Credit check failed:", err);
      }
    }

    setIsAnalyzing(true);
    setAnalyzedPrompt("");
    try {
      console.log("🔍 Starting image analysis...");
      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: {
          imageData: promptImage,
        },
      });
      if (error) throw error;
      if (data?.prompt) {
        setAnalyzedPrompt(data.prompt);
        toast.success("Prompt generated successfully!");

        // Decrement credits and refresh counter if logged in
        if (currentSession) {
          supabase.functions.invoke("check-credits", {
            body: { action: "decrement", generationType: "prompt", imageCount: 1 },
          }).then(({ error }) => {
            if (error) console.error("Failed to decrement credits:", error);
            fetchPromptCredits();
          });
        }
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
        document.execCommand("copy");
        textArea.remove();
        toast.success("Prompt copied to clipboard!");
      } catch (fallbackError) {
        console.error("Failed to copy:", fallbackError);
        toast.error("Failed to copy prompt");
      }
    }
  };
  return (
    <>
      <SEO 
        keywords={['AI image generator', 'text to image', 'AI art', 'image editing', 'AI tools', 'batch image processing', 'prompt engineering', 'AI visual studio', 'cinematic AI images']}
        url="https://cinely.ai"
      />
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8 overflow-x-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center px-4 relative">
          <div className="absolute right-0 top-0">
            <UserMenu />
          </div>
          {/* Logo/Brand Name */}
          <div className="mb-4">
            <h1 className="mb-2 text-primary text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter font-display">
              Cinely.AI
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform ideas into stunning images in batch
          </p>

          {/* Image Slideshow */}
          <ImageSlideshow />
        </header>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 mb-12 w-full max-w-full">
          {/* Input Section */}
          <Card className="bg-card border-0 p-6 shadow-ambient rounded-lg">
            <Tabs
              value={mode}
              onValueChange={(v) => {
                setMode(v as "generate" | "edit" | "prompt");
                setPastedImages([]);
              }}
              className="w-full"
            >
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
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="model-select" className="mb-2 block text-sm font-medium">
                      Model
                    </Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger id="model-select" className="bg-background">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="google/gemini-2.5-flash-image-preview">Nano Banana (Fast)</SelectItem>
                        <SelectItem value="google/gemini-3.1-flash-image-preview">Nano Banana 2 (Balanced)</SelectItem>
                        <SelectItem value="google/gemini-3-pro-image-preview">Pro (Best Quality)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                        <SelectItem value="7">7 Images</SelectItem>
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
                      <p className="text-xs text-muted-foreground mb-2">Pasted images ({pastedImages.length}):</p>
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

                {!session && !ALL_EXAMPLE_PROMPTS.some((ex) => ex.toLowerCase() === prompt.trim().toLowerCase()) && prompt.trim() && (
                  <p className="text-xs text-muted-foreground text-center">
                    <button onClick={() => setAuthDialogOpen(true)} className="text-primary underline underline-offset-2 hover:opacity-80">Sign up</button> to generate with custom prompts
                  </p>
                )}

                <Button
                  onClick={handleGenerate}
                  onTouchEnd={handleTouchGenerate}
                  disabled={isGenerating}
                  className="w-full ai-pulse text-primary-foreground border-0 hover:opacity-90 active:scale-95 transition-transform touch-manipulation rounded-md shadow-glow"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
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
                        className="w-full rounded-lg bg-surface-high p-3 text-left text-sm text-foreground hover:bg-surface-highest border-0"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="edit" className="space-y-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">Upload Image to Edit</Label>
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
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/30 bg-surface-lowest p-8 hover:border-primary/40 hover:bg-surface-low"
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="model-select-edit" className="mb-2 block text-sm font-medium">
                      Model
                    </Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger id="model-select-edit" className="bg-background">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="google/gemini-2.5-flash-image-preview">Nano Banana (Fast)</SelectItem>
                        <SelectItem value="google/gemini-3.1-flash-image-preview">Nano Banana 2 (Balanced)</SelectItem>
                        <SelectItem value="google/gemini-3-pro-image-preview">Pro (Best Quality)</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="7">7 Images</SelectItem>
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
                      <p className="text-xs text-muted-foreground mb-2">Reference images ({pastedImages.length}):</p>
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
                  className="w-full ai-pulse text-primary-foreground border-0 hover:opacity-90 active:scale-95 transition-transform touch-manipulation rounded-md shadow-glow"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
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
                {session && promptCredits && (
                  <div className="flex items-center justify-between rounded-md bg-surface-high px-3 py-2">
                    <span className="text-xs text-muted-foreground">Prompt analyses today</span>
                    <span className="text-xs font-semibold text-foreground">
                      {promptCredits.limit === "unlimited"
                        ? `${promptCredits.used} used · Unlimited`
                        : `${promptCredits.used} / ${promptCredits.limit} used`}
                    </span>
                  </div>
                )}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Upload Image to Analyze</Label>
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
                        <p className="mt-2 text-sm text-muted-foreground">Click to upload an image for analysis</p>
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
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{analyzedPrompt}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleCopyPrompt} variant="outline" className="flex-1">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Prompt
                      </Button>
                      <Button
                        onClick={handleUsePromptInGenerate}
                        className="flex-1 ai-pulse border-0"
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
          <Card ref={resultSectionRef} className="bg-card border-0 p-6 shadow-ambient max-w-full overflow-hidden rounded-lg">
            <div className="mb-4 max-w-full overflow-hidden">
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
                        Save {generatedImages.length > 1 ? "All" : "Image"}
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Thumbnail carousel */}
              {generatedImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full touch-action-pan-x">
                  {generatedImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? "border-primary ring-2 ring-primary/50" : "border-border hover:border-primary/50"}`}
                    >
                      <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative w-full max-w-full overflow-hidden rounded-lg bg-surface-lowest border-0"
              style={
                generatedImages[currentImageIndex] && aspectRatio !== "auto"
                  ? {
                      aspectRatio: getAspectRatioStyle(aspectRatio),
                    }
                  : {
                      minHeight: "400px",
                    }
              }
            >
              {isGenerating ? (
                <div className="flex h-full min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Generating {imageCount} {imageCount === 1 ? "image" : "images"}...
                    </p>
                  </div>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className="w-full h-full cursor-pointer group relative">
                  <img
                    src={generatedImages[currentImageIndex]}
                    alt={`Generated ${currentImageIndex + 1}`}
                    className="w-full h-full max-w-full object-contain"
                    onClick={() => setIsFullscreenOpen(true)}
                  />

                  {/* Navigation arrows */}
                  {generatedImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage("prev");
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-surface-highest/80 hover:bg-surface-highest text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateImage("next");
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-surface-highest/80 hover:bg-surface-highest text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100"
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

        {/* Real-time Stats */}
        <section className="mt-16 max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 text-center border-border bg-card/50 backdrop-blur-sm">
              <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="text-4xl font-extrabold font-display tabular-nums">{stats.total_users.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Users Creating</p>
            </Card>
            <Card className="p-6 text-center border-border bg-card/50 backdrop-blur-sm">
              <ImageIcon className="h-8 w-8 mx-auto mb-3 text-primary" />
              <p className="text-4xl font-extrabold font-display tabular-nums">{stats.total_images.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Images Generated</p>
            </Card>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mt-20 max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-display mb-3">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Start free and upgrade as your creative needs grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Free", key: "free", price: "$0", period: "forever", icon: Sparkles,
                description: "Get started with AI image generation",
                features: ["3 generations per day", "Nano Banana model only", "Up to 5 images per batch", "Watermarked images", "7-day history"],
                limitations: ["No Pro or Nano Banana 2 models", "No priority queue"],
                popular: false, accent: false,
              },
              {
                name: "Pro", key: "pro", price: "$9.99", period: "/month", icon: Zap,
                description: "For creators who need more power",
                features: ["20 generations per day", "All 3 AI models", "Up to 9 images per batch", "Watermarked images", "14-day history"],
                limitations: [],
                popular: true, accent: true,
              },
              {
                name: "Premium", key: "premium", price: "$24.99", period: "/month", icon: Crown,
                description: "Unlimited creativity, zero limits",
                features: ["Unlimited generations", "All 3 AI models", "Up to 9 images per batch", "Watermarked images", "Unlimited history", "Priority queue"],
                limitations: [],
                popular: false, accent: false,
              },
            ].map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.key}
                  className={`relative p-6 flex flex-col border ${
                    plan.accent ? "border-primary shadow-lg shadow-primary/10" : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-5 w-5 ${plan.accent ? "text-primary" : "text-muted-foreground"}`} />
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                  </div>
                  <div className="mb-1">
                    <span className="text-3xl font-extrabold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <ul className="space-y-2 mb-4 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.limitations.map((l) => (
                      <li key={l} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                  {(plan.key === "pro" || plan.key === "premium") && (
                    <p className="text-xs text-muted-foreground mb-4 text-center">
                      Remove watermark for <span className="font-semibold text-foreground">$2/mo</span> as add-on
                    </p>
                  )}
                  <Button
                    className="w-full"
                    variant={plan.accent ? "default" : "outline"}
                    disabled={checkoutLoading === plan.key}
                    onClick={async () => {
                      if (plan.key === "free") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        return;
                      }
                      if (!session) {
                        setAuthDialogOpen(true);
                        return;
                      }
                      setCheckoutLoading(plan.key);
                      try {
                        const { data, error } = await supabase.functions.invoke("create-checkout", {
                          body: { plan: plan.key },
                        });
                        if (error) throw error;
                        if (data?.url) window.open(data.url, "_blank");
                      } catch (e: any) {
                        toast.error(e.message || "Failed to start checkout");
                      } finally {
                        setCheckoutLoading(null);
                      }
                    }}
                  >
                    {checkoutLoading === plan.key && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {plan.key === "free" ? "Get Started" : !session ? "Sign in to upgrade" : `Upgrade to ${plan.name}`}
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Info Footer */}
        <footer className="mt-16 pt-12 pb-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* Brand Column */}
              <div className="sm:col-span-2 lg:col-span-1">
                <h3 className="text-2xl font-bold text-primary font-display mb-3">
                  Cinely.AI
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  AI-powered image generation platform. Create stunning visuals in seconds with advanced batch
                  processing capabilities.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="h-9 w-9 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <span className="text-xs font-semibold">𝕏</span>
                  </a>
                  <a
                    href="#"
                    className="h-9 w-9 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <span className="text-xs font-semibold">in</span>
                  </a>
                  <a
                    href="#"
                    className="h-9 w-9 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <span className="text-xs font-semibold">IG</span>
                  </a>
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Guides</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/guide/generate-images" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Generate Images Guide
                    </Link>
                  </li>
                  <li>
                    <Link to="/guide/edit-images" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Edit Images Guide
                    </Link>
                  </li>
                  <li>
                    <Link to="/guide/image-to-prompt" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Image to Prompt Guide
                    </Link>
                  </li>
                  <li>
                    <Link to="/guide/batch-processing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Batch Processing Guide
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      API Access
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Community
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/privacy-policy"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms-of-service"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cookie-policy"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <a
                      href="mailto:info@cinely.ai"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs text-muted-foreground text-center sm:text-left">
                  © {new Date().getFullYear()} Cinely.AI. All rights reserved.
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <a href="#" className="hover:text-primary transition-colors">
                    Status
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:text-primary transition-colors">
                    Changelog
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Fullscreen Image Dialog */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-background/90 backdrop-blur-xl">
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
                        navigateImage("prev");
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-surface-highest/80 hover:bg-surface-highest text-foreground rounded-full p-3"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage("next");
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-surface-highest/80 hover:bg-surface-highest text-foreground rounded-full p-3"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-foreground text-sm bg-surface-highest/80 px-4 py-2 rounded-full">
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
    <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} reason={upgradeReason} />
    <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};
export default Index;
