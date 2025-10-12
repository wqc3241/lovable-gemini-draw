import { ArrowLeft, Eye, Copy, Sparkles, Upload, FileText, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GuideStep } from "@/components/GuideStep";
import { FeatureCard } from "@/components/FeatureCard";
import { TipCallout } from "@/components/TipCallout";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

export default function ImageToPromptGuide() {
  return (
    <>
      <SEO 
        title="Image to Prompt - Complete Guide"
        description="Reverse engineer any image into a detailed text prompt. Learn how to analyze images with AI and extract prompts for image generation and learning."
        keywords={['image to prompt', 'reverse image analysis', 'AI image description', 'prompt extraction', 'prompt engineering', 'analyze images']}
        url="https://cinely.ai/guide/image-to-prompt"
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
      <section className="py-12 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 mb-4 shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Image to Prompt Guide
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Reverse engineer any image into a detailed text prompt. Perfect for understanding AI-generated images or learning prompt engineering.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              icon={Eye}
              title="Visual Analysis"
              description="AI identifies all elements in your image"
            />
            <FeatureCard
              icon={FileText}
              title="Detailed Descriptions"
              description="Get comprehensive prompt breakdowns"
            />
            <FeatureCard
              icon={Copy}
              title="One-Click Copy"
              description="Copy prompts instantly to clipboard"
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
            title="Upload Your Image"
            description="Click the upload button in the 'Prompt' tab to select an image you want to analyze. This can be any photo, artwork, AI-generated image, or screenshot."
            screenshotDescription="Prompt tab selected, showing upload button labeled 'Upload Image to Analyze' with supported file types listed below"
            tips={[
              "Works best with clear, well-lit images",
              "Supported formats: PNG, JPG, JPEG, WEBP",
              "File size limit: 5MB for optimal analysis speed"
            ]}
          >
            <Card className="p-4 bg-muted/50">
              <p className="text-sm font-semibold mb-2 text-foreground">Best Images for Analysis:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>AI-generated images:</strong> Understand what prompts created them</li>
                <li>• <strong>Reference photos:</strong> Extract style and composition descriptions</li>
                <li>• <strong>Artwork:</strong> Learn how to describe artistic styles</li>
                <li>• <strong>Product photos:</strong> Get professional description language</li>
              </ul>
            </Card>
          </GuideStep>

          <GuideStep
            stepNumber={2}
            title="Analyze Image"
            description="Click the 'Analyze Image' button to start the AI analysis. The system will examine your image and generate a detailed text description that could recreate similar images."
            screenshotDescription="Analyze button below uploaded image preview, followed by loading state showing 'Analyzing your image...' with spinner"
            tips={[
              "Analysis typically takes 5-15 seconds",
              "The AI examines composition, style, colors, lighting, and subject matter",
              "More complex images may take slightly longer"
            ]}
          />

          <GuideStep
            stepNumber={3}
            title="Review Generated Prompt"
            description="Once analysis completes, you'll see a detailed text description. The AI identifies and describes all major elements, artistic style, lighting, colors, composition, and atmospheric details."
            screenshotDescription="Large text area displaying the analyzed prompt with detailed description like 'A photorealistic portrait of a young woman with long brown hair, soft natural lighting, blurred background, warm color tones, professional photography style'"
          >
            <div className="space-y-4">
              <Card className="p-4 bg-muted/50">
                <p className="text-sm font-semibold mb-2 text-foreground">What the AI Identifies:</p>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Visual Elements:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      <li>• Main subject(s)</li>
                      <li>• Background elements</li>
                      <li>• Objects and props</li>
                      <li>• People and poses</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Style & Atmosphere:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      <li>• Artistic style (realistic, painting, etc.)</li>
                      <li>• Lighting type and direction</li>
                      <li>• Color palette and tones</li>
                      <li>• Mood and atmosphere</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Composition:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      <li>• Camera angle and perspective</li>
                      <li>• Depth of field</li>
                      <li>• Framing and layout</li>
                      <li>• Focus points</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Technical Details:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      <li>• Image quality indicators</li>
                      <li>• Photography/art techniques</li>
                      <li>• Texture descriptions</li>
                      <li>• Special effects</li>
                    </ul>
                  </div>
                </div>
              </Card>
              <TipCallout variant="tip">
                The generated prompt includes specific details that help recreate similar images. You can use it as-is or modify it for variations.
              </TipCallout>
            </div>
          </GuideStep>

          <GuideStep
            stepNumber={4}
            title="Copy Prompt to Clipboard"
            description="Click the 'Copy Prompt' button to instantly copy the entire description to your clipboard. You can then paste it into any AI image generator or save it for later use."
            screenshotDescription="Copy button with icon appearing next to the analyzed prompt text, showing success toast 'Prompt copied to clipboard!' after clicking"
            tips={[
              "The copied text includes all details in plain text format",
              "Paste into any text editor, notes app, or AI tool",
              "Works across all major platforms and browsers"
            ]}
          />

          <GuideStep
            stepNumber={5}
            title="Use in Generate Tab"
            description="Click the 'Use this prompt to generate' button to automatically load the analyzed prompt into the Generate tab. This lets you recreate similar images or create variations with one click."
            screenshotDescription="Button labeled 'Use this prompt to generate' that switches to Generate tab with the prompt pre-filled in the text area"
          >
            <TipCallout variant="info">
              After switching to Generate tab, you can modify the prompt before generating. Try changing colors, style, or specific elements to create unique variations.
            </TipCallout>
          </GuideStep>

          <GuideStep
            stepNumber={6}
            title="Understanding the Results"
            description="The AI's analysis provides a template for recreating similar images. While it won't be an exact copy, it captures the essence, style, and composition that made the original image distinctive."
          >
            <Card className="p-4 bg-muted/50">
              <p className="text-sm font-semibold mb-2 text-foreground">Important to Know:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• The prompt is an <strong>interpretation</strong>, not a reverse-engineering of the original prompt used</li>
                <li>• AI describes what it sees, which may differ from the creator's original intent</li>
                <li>• Using this prompt will create <strong>similar</strong> images, not exact copies</li>
                <li>• Results vary based on the AI model used for generation</li>
              </ul>
            </Card>
          </GuideStep>

          {/* Use Cases */}
          <div className="mt-16 p-8 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-purple-500/10 rounded-xl border-2 border-orange-500/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-orange-600" />
              Common Use Cases
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Learn Prompt Engineering</h4>
                <p className="text-sm text-muted-foreground">Analyze AI-generated images to understand what makes effective prompts. See how professionals describe artistic elements.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Recreate Styles</h4>
                <p className="text-sm text-muted-foreground">Found an image with a style you love? Extract its prompt to generate similar images with your own subjects.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Create Variations</h4>
                <p className="text-sm text-muted-foreground">Use the extracted prompt as a starting point, then modify elements to create a series of related images.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Documentation</h4>
                <p className="text-sm text-muted-foreground">Generate detailed descriptions of your images for catalogs, documentation, or accessibility purposes.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Inspiration</h4>
                <p className="text-sm text-muted-foreground">Upload reference images and see how AI describes them. Use these descriptions to inspire new creative directions.</p>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold mb-2 text-foreground">Quality Analysis</h4>
                <p className="text-sm text-muted-foreground">Understand what makes certain images effective by seeing which elements the AI prioritizes in its description.</p>
              </Card>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="mt-12 p-6 bg-purple-500/10 rounded-lg border-2 border-purple-500/20">
            <h3 className="text-xl font-bold mb-3 text-foreground">Pro Tips</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ <strong>Compare multiple images:</strong> Analyze several similar images to find common prompt patterns</p>
              <p>✓ <strong>Edit before generating:</strong> The extracted prompt is a starting point - customize it for better results</p>
              <p>✓ <strong>Build a prompt library:</strong> Save analyzed prompts that produce styles you like</p>
              <p>✓ <strong>Mix and match:</strong> Combine elements from different analyzed prompts for unique results</p>
              <p>✓ <strong>Test variations:</strong> Try generating with the original prompt, then with your modifications to see the impact</p>
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
                  <p className="text-sm text-muted-foreground">Use extracted prompts to create images</p>
                </Card>
              </Link>
              <Link to="/guide/edit-images">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Upload className="w-8 h-8 mb-2 text-pink-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Edit Images</h4>
                  <p className="text-sm text-muted-foreground">Modify existing images with AI</p>
                </Card>
              </Link>
              <Link to="/guide/batch-processing">
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <Copy className="w-8 h-8 mb-2 text-orange-600" />
                  <h4 className="font-semibold mb-1 text-foreground">Batch Processing</h4>
                  <p className="text-sm text-muted-foreground">Generate multiple variations</p>
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
