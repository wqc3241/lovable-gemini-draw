import { ArrowLeft, Sparkles, Image, Palette, Download, Grid, Wand2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GuideStep } from "@/components/GuideStep";
import { FeatureCard } from "@/components/FeatureCard";
import { TipCallout } from "@/components/TipCallout";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function GenerateImagesGuide() {
  return (
    <>
      <SEO 
        title="Generate AI Images - Complete Guide"
        description="Learn how to create stunning AI-generated images with text prompts. Step-by-step tutorial covering prompt engineering, aspect ratios, and batch generation."
        keywords={['AI image generation', 'text to image tutorial', 'AI art guide', 'prompt engineering', 'create AI images', 'AI image generator guide']}
        url="https://cinely.ai/guide/generate-images"
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
      <section className="py-12 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 mb-4 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Generate Images Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create stunning AI-generated images from text descriptions. Learn how to write effective prompts and generate multiple variations.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              icon={Wand2}
              title="Text-to-Image"
              description="Transform your ideas into visual art with AI"
            />
            <FeatureCard
              icon={Grid}
              title="Batch Generation"
              description="Create 1-9 images simultaneously"
            />
            <FeatureCard
              icon={Palette}
              title="Custom Ratios"
              description="Choose from multiple aspect ratios"
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
            title="Enter Your Prompt"
            description="Start by describing the image you want to create. Be specific about style, subject, lighting, colors, and mood. The more detailed your description, the better the AI can understand your vision."
            screenshotDescription="Shows the large text area with placeholder text 'Describe the image you want to generate...' and example prompts carousel below it."
            tips={[
              "Include artistic style: 'photorealistic', 'oil painting', 'digital art', 'watercolor'",
              "Specify lighting: 'golden hour', 'soft studio lighting', 'dramatic shadows'",
              "Add mood and atmosphere: 'mysterious', 'cheerful', 'serene', 'energetic'",
              "Mention composition: 'close-up portrait', 'wide angle landscape', 'aerial view'"
            ]}
          >
            <Card className="p-4 bg-muted/50">
              <p className="text-sm font-semibold mb-2 text-foreground">Example Prompts:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• "A photorealistic portrait of a Bengal cat with green eyes, soft natural lighting, blurred background"</li>
                <li>• "Futuristic cityscape at sunset, neon lights, cyberpunk style, flying cars, 16:9 aspect ratio"</li>
                <li>• "Watercolor painting of a serene mountain lake, autumn colors, misty morning atmosphere"</li>
              </ul>
            </Card>
          </GuideStep>

          <GuideStep
            stepNumber={2}
            title="Select Aspect Ratio"
            description="Choose the aspect ratio that best fits your intended use. Different ratios work better for different purposes - social media posts, wallpapers, portraits, or presentations."
            screenshotDescription="Dropdown menu showing aspect ratio options: 1:1 (Square), 16:9 (Landscape), 9:16 (Portrait), 3:2 (Photo), 4:3 (Classic)"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">1:1 (Square)</h4>
                <p className="text-sm text-muted-foreground">Perfect for Instagram posts, profile pictures, and social media thumbnails</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">16:9 (Landscape)</h4>
                <p className="text-sm text-muted-foreground">Ideal for YouTube thumbnails, desktop wallpapers, and presentations</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">9:16 (Portrait)</h4>
                <p className="text-sm text-muted-foreground">Great for mobile wallpapers, Instagram stories, and TikTok videos</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">3:2 & 4:3</h4>
                <p className="text-sm text-muted-foreground">Traditional photo formats for prints and classic displays</p>
              </Card>
            </div>
          </GuideStep>

          <GuideStep
            stepNumber={3}
            title="Choose Number of Images"
            description="Select how many variations you want to generate. Creating multiple images lets you compare different interpretations and choose the best result."
            screenshotDescription="Dropdown selector showing options: 1, 3, 5, 7, or 9 images with '3 images' selected as default"
            tips={[
              "Start with 3-5 images to get variety without long wait times",
              "Single image is faster for quick iterations",
              "More images = more variety but longer generation time"
            ]}
          />

          <GuideStep
            stepNumber={4}
            title="Advanced: Paste Reference Images (Optional)"
            description="You can paste reference images directly into the prompt area using Ctrl+V (Windows) or Cmd+V (Mac). This helps guide the AI's output style and composition."
            screenshotDescription="Interface showing pasted reference images appearing below the prompt text area with small preview thumbnails and remove (X) buttons"
            tips={[
              "Reference images influence the style, colors, and composition",
              "You can paste multiple images for combined references",
              "This feature is optional - text prompts work great on their own"
            ]}
          >
            <TipCallout variant="info">
              Reference images are most useful when you want to match a specific style, color palette, or composition from an existing image.
            </TipCallout>
          </GuideStep>

          <GuideStep
            stepNumber={5}
            title="Generate & View Results"
            description="Click the 'Generate' button and wait for the AI to create your images. Generation typically takes 10-30 seconds depending on the number of images requested."
            screenshotDescription="Loading state showing progress indicator with text 'Generating your images...' followed by result carousel with navigation arrows and image counter (1/3, 2/3, 3/3)"
          >
            <div className="space-y-4">
              <TipCallout variant="tip">
                While generating, you can't submit new requests. Wait for the current batch to complete.
              </TipCallout>
              <Card className="p-4 bg-muted/50">
                <p className="text-sm font-semibold mb-2 text-foreground">Navigation Controls:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• <strong>Left/Right arrows:</strong> Browse through generated images</li>
                  <li>• <strong>Image counter:</strong> Shows current image (e.g., "2 of 5")</li>
                  <li>• <strong>Fullscreen icon:</strong> View image in full screen mode</li>
                </ul>
              </Card>
            </div>
          </GuideStep>

          <GuideStep
            stepNumber={6}
            title="Download Your Images"
            description="Download individual images or all generated images at once. Multiple images are automatically packaged into a ZIP file for easy downloading."
            screenshotDescription="Download button with icon showing download options - single image downloads directly, multiple images create a ZIP file"
          >
            <Card className="p-4 bg-muted/50">
              <p className="text-sm font-semibold mb-2 text-foreground">File Naming Convention:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Single image: <code className="bg-muted px-2 py-1 rounded">cinely_generated_MM/DD/YY_timestamp.png</code></li>
                <li>• Multiple images: <code className="bg-muted px-2 py-1 rounded">cinely_generated_MM/DD/YY_timestamp_1.png</code></li>
                <li>• ZIP file contains all images with sequential numbering</li>
              </ul>
            </Card>
          </GuideStep>

          {/* Best Practices */}
          <div className="mt-16 p-8 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-xl border-2 border-purple-500/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-purple-600" />
              Best Practices
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <p>✓ <strong>Be specific:</strong> "Sunset over mountains" → "Golden hour sunset over snow-capped mountains with pine trees in foreground"</p>
              <p>✓ <strong>Mention style:</strong> Add "photorealistic", "digital art", "oil painting", "minimalist" etc.</p>
              <p>✓ <strong>Describe lighting:</strong> "Soft natural light", "dramatic shadows", "neon glow" makes a big difference</p>
              <p>✓ <strong>Include mood:</strong> "Mysterious", "joyful", "melancholic" helps set the atmosphere</p>
              <p>✓ <strong>Iterate:</strong> Generate multiple times with slight prompt variations to find the perfect result</p>
            </div>
          </div>

          {/* Related Guides */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Related Guides</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/guide/batch-processing">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Grid className="w-8 h-8 mb-2 text-purple-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Batch Processing</h4>
                  <p className="text-sm text-muted-foreground">Generate multiple images at once</p>
                </Card>
              </Link>
              <Link to="/guide/edit-images">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Image className="w-8 h-8 mb-2 text-pink-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Edit Images</h4>
                  <p className="text-sm text-muted-foreground">Modify existing images with AI</p>
                </Card>
              </Link>
              <Link to="/guide/image-to-prompt">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Wand2 className="w-8 h-8 mb-2 text-orange-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Image to Prompt</h4>
                  <p className="text-sm text-muted-foreground">Extract prompts from images</p>
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
