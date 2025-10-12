import { ArrowLeft, Grid, Zap, Download, Sparkles, Image, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GuideStep } from "@/components/GuideStep";
import { FeatureCard } from "@/components/FeatureCard";
import { TipCallout } from "@/components/TipCallout";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function BatchProcessingGuide() {
  return (
    <>
      <SEO 
        title="Batch Processing Guide - Generate Multiple Images"
        description="Generate multiple image variations simultaneously. Learn how to use batch processing to save time, compare results, and create the perfect AI images."
        keywords={['batch image processing', 'bulk image generation', 'multiple AI images', 'batch AI generation', 'parallel image processing', 'generate multiple images']}
        url="https://cinely.ai/guide/batch-processing"
        type="article"
      />
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-4 shadow-lg">
              <Grid className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Batch Processing Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate multiple image variations simultaneously. Save time, compare results, and choose the perfect output from multiple options.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              icon={Grid}
              title="Multiple Variations"
              description="Generate 1-9 images at once"
            />
            <FeatureCard
              icon={Zap}
              title="Parallel Processing"
              description="All images generated simultaneously"
            />
            <FeatureCard
              icon={Download}
              title="Batch Download"
              description="Download all as ZIP with one click"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Step-by-Step Instructions</h2>

          <GuideStep
            stepNumber={1}
            title="Why Use Batch Processing?"
            description="Batch processing allows you to generate multiple variations of the same prompt simultaneously. This is incredibly useful when you're not sure exactly what you want, when exploring creative possibilities, or when you need options to choose from."
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Save Time
                </h4>
                <p className="text-sm text-muted-foreground">Generate 5 variations in one batch takes the same time as generating them one by one, but with a single click.</p>
              </Card>
              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Image className="w-4 h-4 text-pink-600" />
                  Compare Options
                </h4>
                <p className="text-sm text-muted-foreground">See different interpretations side-by-side to pick the best result or discover unexpected creative directions.</p>
              </Card>
              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  Explore Creativity
                </h4>
                <p className="text-sm text-muted-foreground">AI introduces natural variation. Multiple results from the same prompt reveal different creative possibilities.</p>
              </Card>
              <Card className="p-4 bg-muted/50">
                <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Increase Success Rate
                </h4>
                <p className="text-sm text-muted-foreground">With more options, you're more likely to get at least one perfect result that matches your vision.</p>
              </Card>
            </div>
          </GuideStep>

          <GuideStep
            stepNumber={2}
            title="Select Image Count"
            description="Choose how many images you want to generate in a single batch. You can select 1, 3, 5, 7, or 9 images. Start with 3-5 for a good balance between variety and processing time."
            screenshotDescription="Dropdown menu showing options: 1 image, 3 images, 5 images (selected), 7 images, 9 images with a note showing estimated processing time"
          >
            <Card className="p-4 bg-muted/50">
              <p className="text-sm font-semibold mb-2 text-foreground">Recommended Batch Sizes:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>1 image:</strong> Quick iterations when you know exactly what you want</li>
                <li>• <strong>3 images:</strong> Good starting point for most use cases, fast results with variety</li>
                <li>• <strong>5 images:</strong> Recommended for important projects, great variety to choose from</li>
                <li>• <strong>7 images:</strong> Maximum variety without excessive wait time</li>
                <li>• <strong>9 images:</strong> Best for critical projects or when you need many options</li>
              </ul>
            </Card>
          </GuideStep>

          <GuideStep
            stepNumber={3}
            title="Write Versatile Prompts"
            description="For batch processing, write prompts that allow for natural variation while maintaining your core vision. Avoid being overly specific about every detail - let the AI explore creative interpretations."
            tips={[
              "Focus on key elements you definitely want, be flexible about the rest",
              "Use descriptive but not restrictive language",
              "Mention style and mood, but let composition vary naturally"
            ]}
          >
            <div className="space-y-4">
              <Card className="p-4 border-2 border-green-500/30 bg-green-500/5">
                <p className="text-sm font-semibold mb-2 text-foreground">✓ Good Batch Prompts:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• "A cozy coffee shop interior, warm lighting, modern design"</li>
                  <li>• "Fantasy landscape with mountains and magical elements, vibrant colors"</li>
                  <li>• "Professional headshot of a business person, natural lighting, neutral background"</li>
                </ul>
              </Card>
              <Card className="p-4 border-2 border-red-500/30 bg-red-500/5">
                <p className="text-sm font-semibold mb-2 text-foreground">✗ Too Specific for Batches:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• "Exactly 3 blue mugs on the left, 2 pastries on the right, plant in center" (too rigid)</li>
                  <li>• "Mountains must be exactly 45 degrees angle, sun at top right corner" (over-constrained)</li>
                </ul>
              </Card>
            </div>
          </GuideStep>

          <GuideStep
            stepNumber={4}
            title="Generate Multiple Images"
            description="Click the 'Generate' button to start processing your batch. All images are generated in parallel, so you'll see progress indicators for the entire batch. Wait time depends on the number of images requested."
            screenshotDescription="Loading screen showing multiple progress indicators with text 'Generating 5 images...' and a spinning animation"
          >
            <Card className="p-4 bg-muted/50">
              <p className="text-sm font-semibold mb-2 text-foreground">Estimated Processing Times:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 1 image: ~10-15 seconds</li>
                <li>• 3 images: ~15-20 seconds</li>
                <li>• 5 images: ~20-30 seconds</li>
                <li>• 7 images: ~25-35 seconds</li>
                <li>• 9 images: ~30-40 seconds</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3 italic">
                * Times are approximate and may vary based on server load and complexity
              </p>
            </Card>
          </GuideStep>

          <GuideStep
            stepNumber={5}
            title="Browse Results Carousel"
            description="Once generation completes, all your images appear in an interactive carousel. Use the left and right arrow buttons to navigate through all generated variations. The counter shows your position (e.g., '3 of 5')."
            screenshotDescription="Image carousel interface showing generated image with left/right navigation arrows, counter displaying '3/5', and fullscreen button in top right"
            tips={[
              "Use arrow keys on keyboard for faster navigation",
              "Click the fullscreen icon to view images in detail",
              "Take time to review each variation before deciding"
            ]}
          />

          <GuideStep
            stepNumber={6}
            title="Download Options"
            description="Choose how to save your generated images. Download individual favorites one at a time, or use the batch download feature to get all images in a single ZIP file with organized filenames."
            screenshotDescription="Download button with two states: 'Download' for single images and 'Download All (ZIP)' when multiple images are generated"
          >
            <div className="space-y-4">
              <Card className="p-4 bg-muted/50">
                <p className="text-sm font-semibold mb-2 text-foreground">Single Image Download:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Navigate to the image you want</li>
                  <li>• Click the download button</li>
                  <li>• File saves as: <code className="bg-muted px-2 py-1 rounded text-xs">cinely_generated_MM/DD/YY_timestamp.png</code></li>
                </ul>
              </Card>
              <Card className="p-4 bg-muted/50">
                <p className="text-sm font-semibold mb-2 text-foreground">Batch Download (Multiple Images):</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Click download button when viewing any image in the batch</li>
                  <li>• System automatically creates a ZIP file with all images</li>
                  <li>• Files named sequentially: <code className="bg-muted px-2 py-1 rounded text-xs">cinely_generated_MM/DD/YY_timestamp_1.png</code>, _2.png, etc.</li>
                  <li>• ZIP downloads with descriptive filename</li>
                </ul>
              </Card>
            </div>
          </GuideStep>

          <GuideStep
            stepNumber={7}
            title="Managing Large Batches"
            description="When working with 7 or 9 image batches, organization becomes important. Here's how to efficiently manage and select from large result sets."
          >
            <TipCallout variant="tip">
              Use fullscreen view to carefully examine each image at full resolution. This helps you spot subtle differences and quality variations.
            </TipCallout>
            <div className="mt-4 space-y-2">
              <Card className="p-3">
                <p className="text-sm"><strong>Keep notes:</strong> Write down the numbers of your favorite variations (e.g., "Image 2, 5, and 7 are best")</p>
              </Card>
              <Card className="p-3">
                <p className="text-sm"><strong>Download all first:</strong> Get the ZIP file, then review offline at your own pace</p>
              </Card>
              <Card className="p-3">
                <p className="text-sm"><strong>Compare side by side:</strong> After downloading, view multiple images together to make final selections</p>
              </Card>
            </div>
          </GuideStep>

          {/* Best Practices */}
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl border-2 border-blue-500/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              Batch Processing Best Practices
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <p>✓ <strong>Start small:</strong> Begin with 3 images to test your prompt, increase to 7-9 if needed</p>
              <p>✓ <strong>Optimal batch size:</strong> 5 images offers the best balance of variety and reasonable wait time</p>
              <p>✓ <strong>Save bandwidth:</strong> For mobile or slow connections, use smaller batches (1-3 images)</p>
              <p>✓ <strong>Professional projects:</strong> Generate 9 images for critical work where you need maximum choice</p>
              <p>✓ <strong>Iterate based on results:</strong> If batch shows good direction, refine prompt and generate another batch</p>
              <p>✓ <strong>Download immediately:</strong> Save your favorites right away in case you navigate away</p>
            </div>
          </div>

          {/* When to Use Different Batch Sizes */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-foreground">When to Use Different Batch Sizes</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-5 border-2">
                <div className="text-2xl font-bold text-purple-600 mb-2">1-3 Images</div>
                <h4 className="font-semibold mb-2 text-foreground">Quick Iterations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Testing new prompts</li>
                  <li>• Simple requests</li>
                  <li>• Time-sensitive work</li>
                  <li>• Learning the system</li>
                </ul>
              </Card>
              <Card className="p-5 border-2 border-purple-500/50 shadow-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">5 Images</div>
                <h4 className="font-semibold mb-2 text-foreground">Recommended Default</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Most project types</li>
                  <li>• Good variety</li>
                  <li>• Reasonable wait time</li>
                  <li>• Social media content</li>
                </ul>
              </Card>
              <Card className="p-5 border-2">
                <div className="text-2xl font-bold text-purple-600 mb-2">7-9 Images</div>
                <h4 className="font-semibold mb-2 text-foreground">Maximum Choice</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Client presentations</li>
                  <li>• Critical projects</li>
                  <li>• Marketing campaigns</li>
                  <li>• Portfolio pieces</li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Related Guides */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Related Guides</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/guide/generate-images">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Sparkles className="w-8 h-8 mb-2 text-purple-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Generate Images</h4>
                  <p className="text-sm text-muted-foreground">Learn the basics of image generation</p>
                </Card>
              </Link>
              <Link to="/guide/edit-images">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Image className="w-8 h-8 mb-2 text-pink-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Edit Images</h4>
                  <p className="text-sm text-muted-foreground">Batch edit multiple images</p>
                </Card>
              </Link>
              <Link to="/guide/image-to-prompt">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Download className="w-8 h-8 mb-2 text-orange-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Image to Prompt</h4>
                  <p className="text-sm text-muted-foreground">Analyze and recreate styles</p>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Link to="/">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Cinely
            </Button>
          </Link>
        </div>
      </footer>
    </div>
    </>
  );
}
