import { ArrowLeft, Image, Wand2, Upload, Download, Grid, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GuideStep } from "@/components/GuideStep";
import { FeatureCard } from "@/components/FeatureCard";
import { TipCallout } from "@/components/TipCallout";
import { Link } from "react-router-dom";

export default function EditImagesGuide() {
  return (
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
      <section className="py-12 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 mb-4 shadow-lg">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Edit Images Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform existing images with AI-powered editing. Change styles, add elements, or completely reimagine your photos.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              icon={Image}
              title="Image Transformation"
              description="Modify any aspect of your images"
            />
            <FeatureCard
              icon={Wand2}
              title="Style Transfer"
              description="Apply artistic styles instantly"
            />
            <FeatureCard
              icon={Upload}
              title="Multi-Image Input"
              description="Use reference images for better results"
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
            title="Upload Your Base Image"
            description="Click the upload button to select the image you want to edit. You can upload photos, screenshots, or any PNG/JPG/WEBP image file."
            screenshotDescription="Upload button with icon labeled 'Upload Image' in the Edit tab, showing supported file types below"
            tips={[
              "Supported formats: PNG, JPG, JPEG, WEBP",
              "Recommended size: Up to 5MB for best performance",
              "Higher quality source images produce better results"
            ]}
          >
            <Card className="p-4 bg-muted/50">
              <p className="text-sm font-semibold mb-2 text-foreground">Image Requirements:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• File size: Maximum 5MB recommended</li>
                <li>• Dimensions: Any size accepted, will be optimized automatically</li>
                <li>• Quality: Higher resolution source = better edited results</li>
              </ul>
            </Card>
          </GuideStep>

          <GuideStep
            stepNumber={2}
            title="Write Edit Instructions"
            description="Describe exactly what changes you want to make to your image. Be specific about what to add, remove, or modify. The AI will interpret your instructions and apply them to the uploaded image."
            screenshotDescription="Text area showing prompt input with example: 'Change the background to a sunset beach scene' with the uploaded image preview above it"
          >
            <div className="space-y-4">
              <Card className="p-4 bg-muted/50">
                <p className="text-sm font-semibold mb-2 text-foreground">Example Edit Prompts:</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Add elements:</strong> "Add sunglasses and a hat", "Add falling snow", "Add neon signs in background"</li>
                  <li>• <strong>Remove elements:</strong> "Remove the person in the background", "Remove watermark"</li>
                  <li>• <strong>Style changes:</strong> "Make it look like a watercolor painting", "Convert to cyberpunk style"</li>
                  <li>• <strong>Atmosphere:</strong> "Change to night time", "Make it rainy", "Add dramatic lighting"</li>
                  <li>• <strong>Colors:</strong> "Make it black and white", "Increase saturation", "Change to warm tones"</li>
                </ul>
              </Card>
              <TipCallout variant="tip">
                Be specific about what should stay the same. Example: "Keep the main subject unchanged, but change the background to a forest scene"
              </TipCallout>
            </div>
          </GuideStep>

          <GuideStep
            stepNumber={3}
            title="Optional: Add Reference Images"
            description="Paste additional reference images using Ctrl+V (Windows) or Cmd+V (Mac) to guide the editing style. These references help the AI understand the exact look you're aiming for."
            screenshotDescription="Multiple small image thumbnails appearing below the main uploaded image, each with an X button to remove"
            tips={[
              "Reference images are especially useful for style matching",
              "You can paste multiple references to combine styles",
              "References influence colors, lighting, and artistic style"
            ]}
          >
            <TipCallout variant="info">
              Example: Upload a portrait, paste a Van Gogh painting as reference, and prompt "Transform this photo in the style of the reference image"
            </TipCallout>
          </GuideStep>

          <GuideStep
            stepNumber={4}
            title="Select Aspect Ratio"
            description="Choose whether to maintain the original aspect ratio or change it. Changing the aspect ratio may crop or extend parts of the image."
            screenshotDescription="Aspect ratio dropdown showing options including 'Original' selected by default, plus 1:1, 16:9, 9:16, etc."
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4 border-2 border-purple-500/30">
                <h4 className="font-semibold mb-2 text-foreground">Keep Original</h4>
                <p className="text-sm text-muted-foreground">Recommended for most edits. Maintains the source image's proportions.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Change Ratio</h4>
                <p className="text-sm text-muted-foreground">Useful when you need specific output dimensions for social media or displays.</p>
              </Card>
            </div>
          </GuideStep>

          <GuideStep
            stepNumber={5}
            title="Choose Number of Variations"
            description="Select how many edited versions you want to generate. Multiple variations let you compare different interpretations of your edit instructions."
            screenshotDescription="Dropdown showing 1, 3, 5, 7, or 9 images with default selection of 3"
            tips={[
              "3-5 variations provide good variety for comparison",
              "Single variation is faster for simple edits",
              "More variations help when the edit is complex or creative"
            ]}
          />

          <GuideStep
            stepNumber={6}
            title="Generate Edited Version"
            description="Click 'Generate' to process your edit. The AI will analyze your source image, understand your instructions, and create the edited versions. This typically takes 15-40 seconds."
            screenshotDescription="Loading spinner with text 'Processing your edit...' followed by carousel of edited results"
          >
            <TipCallout variant="warning">
              The AI tries to preserve important details from your source image while applying your requested changes. Results may vary based on complexity of the edit.
            </TipCallout>
          </GuideStep>

          <GuideStep
            stepNumber={7}
            title="Compare & Download"
            description="Review all generated variations using the carousel navigation. Compare them to your original and download your favorite results."
            screenshotDescription="Side-by-side comparison view (optional) and download button with options for single or batch download"
          >
            <Card className="p-4 bg-muted/50">
              <p className="text-sm font-semibold mb-2 text-foreground">Download Options:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Single image:</strong> Direct PNG download</li>
                <li>• <strong>Multiple images:</strong> Automatic ZIP file with all variations</li>
                <li>• <strong>Filename format:</strong> cinely_generated_MM/DD/YY_timestamp.png</li>
              </ul>
            </Card>
          </GuideStep>

          {/* Use Cases */}
          <div className="mt-16 p-8 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-xl border-2 border-pink-500/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-600" />
              Popular Use Cases
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Background Replacement</h4>
                <p className="text-sm text-muted-foreground">Keep your subject, change everything around it. Perfect for product photos or portraits.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Style Transfer</h4>
                <p className="text-sm text-muted-foreground">Transform photos into paintings, sketches, or any artistic style you imagine.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Object Addition</h4>
                <p className="text-sm text-muted-foreground">Add accessories, props, or elements that weren't in the original photo.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Atmosphere Changes</h4>
                <p className="text-sm text-muted-foreground">Change weather, time of day, or seasonal elements to match your vision.</p>
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
                  <p className="text-sm text-muted-foreground">Create images from text descriptions</p>
                </Card>
              </Link>
              <Link to="/guide/image-to-prompt">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Wand2 className="w-8 h-8 mb-2 text-orange-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Image to Prompt</h4>
                  <p className="text-sm text-muted-foreground">Extract prompts from images</p>
                </Card>
              </Link>
              <Link to="/guide/batch-processing">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Grid className="w-8 h-8 mb-2 text-pink-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Batch Processing</h4>
                  <p className="text-sm text-muted-foreground">Edit multiple variations at once</p>
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
  );
}
