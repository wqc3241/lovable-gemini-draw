import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">
            Cookie Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        {/* Content */}
        <Card className="p-6 sm:p-8 md:p-10">
          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Cookie Policy explains how Cinely.AI ("we," "our," or "us") uses cookies and similar technologies when you visit our website. By using Cinely.AI, you consent to the use of cookies as described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences, improve user experience, and provide analytics about site usage.
              </p>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">Types of Cookies</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until manually deleted</li>
                <li><strong>First-Party Cookies:</strong> Set by the website you're visiting</li>
                <li><strong>Third-Party Cookies:</strong> Set by external services embedded on the website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. Our Cookie Usage</h2>
              
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg mb-4">
                <p className="text-sm font-semibold text-primary mb-2">✓ Privacy-First Approach</p>
                <p className="text-sm text-muted-foreground">
                  Cinely.AI operates with a <strong>cookie-minimal</strong> philosophy. We do not use persistent cookies, tracking cookies, or marketing cookies.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.1 Session Storage Only</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our application uses browser <strong>session storage</strong> and <strong>local storage</strong> (not traditional cookies) to temporarily store:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Generated Images:</strong> Stored locally in your browser to display your creations</li>
                <li><strong>User Preferences:</strong> Settings like aspect ratio, image count, and selected mode</li>
                <li><strong>Temporary Data:</strong> In-memory processing data cleared when you close the tab</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                This data is stored <strong>entirely on your device</strong> and is never transmitted to our servers for storage.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.2 No Tracking Cookies</h3>
              <p className="text-muted-foreground leading-relaxed">
                We do not use:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Google Analytics or similar analytics cookies</li>
                <li>Advertising or marketing cookies</li>
                <li>Social media tracking pixels (Facebook Pixel, Twitter Pixel, etc.)</li>
                <li>Cross-site tracking technologies</li>
                <li>Behavioral profiling cookies</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.3 Browser Cache</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your browser may cache images and static assets (CSS, JavaScript) to improve loading performance. This is a standard browser feature and can be controlled through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Third-Party Cookies</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">4.1 Lovable Infrastructure</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Cinely.AI is hosted on Lovable infrastructure, which may set minimal technical cookies for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Session management and security</li>
                <li>Load balancing and performance optimization</li>
                <li>DDoS protection and fraud prevention</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                These cookies are strictly necessary for the operation of the service and do not track user behavior.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.2 AI Processing Services</h3>
              <p className="text-muted-foreground leading-relaxed">
                When you generate images, your prompts are temporarily processed through the Lovable AI Gateway (powered by Google Gemini). While no cookies are set by Cinely.AI during this process, Google's AI services may process data according to their own privacy policies.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.3 No Third-Party Marketing</h3>
              <p className="text-muted-foreground leading-relaxed">
                We do not integrate with third-party advertising networks, affiliate programs, or marketing platforms that would set tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">5.1 Browser Settings</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Most browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Block All Cookies:</strong> Prevent websites from setting any cookies</li>
                <li><strong>Delete Cookies:</strong> Remove existing cookies from your device</li>
                <li><strong>Block Third-Party Cookies:</strong> Allow first-party cookies while blocking third parties</li>
                <li><strong>Private/Incognito Mode:</strong> Browse without storing cookies or history</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Browser-Specific Instructions</h3>
              <div className="space-y-3 mt-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-sm mb-1">Google Chrome</p>
                  <p className="text-xs text-muted-foreground">Settings → Privacy and Security → Cookies and other site data</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-sm mb-1">Mozilla Firefox</p>
                  <p className="text-xs text-muted-foreground">Settings → Privacy & Security → Cookies and Site Data</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-sm mb-1">Safari</p>
                  <p className="text-xs text-muted-foreground">Preferences → Privacy → Manage Website Data</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-semibold text-sm mb-1">Microsoft Edge</p>
                  <p className="text-xs text-muted-foreground">Settings → Cookies and site permissions → Cookies and data stored</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.3 Clear Browser Cache</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                To remove stored images and preferences:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Open your browser's developer tools (usually F12 or Ctrl+Shift+I)</li>
                <li>Navigate to the "Application" or "Storage" tab</li>
                <li>Clear "Local Storage" and "Session Storage" for cinely.ai</li>
                <li>Alternatively, use your browser's "Clear browsing data" feature</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Cookie-Free Experience</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Good News:</strong> Cinely.AI is designed to work fully without traditional cookies. Even if you block all cookies in your browser settings, you can still:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Generate AI images from text prompts</li>
                <li>Edit uploaded images with AI</li>
                <li>Analyze images to generate prompts</li>
                <li>Download images (single or batch)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                The only limitation is that your generated images and preferences won't persist across browser sessions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Since we use session storage instead of persistent cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Session Data:</strong> Cleared when you close the browser tab</li>
                <li><strong>Local Storage:</strong> Remains until manually cleared by you</li>
                <li><strong>No Server-Side Storage:</strong> We do not store your images or prompts on our servers</li>
                <li><strong>Server Logs:</strong> IP addresses in access logs are retained for up to 30 days for security purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cinely.AI does not knowingly collect cookies or data from children under 13. If you are under 13, please do not use this service without parental supervision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy to reflect changes in our practices or for legal, regulatory, or operational reasons. Changes will be posted on this page with an updated "Last updated" date. Continued use of Cinely.AI after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about our use of cookies or this policy, please contact us at:
              </p>
              <div className="mt-3 p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> <a href="mailto:info@cinely.ai" className="text-primary hover:underline">info@cinely.ai</a>
                </p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Summary:</strong> Cinely.AI prioritizes your privacy by operating without persistent cookies or tracking technologies. We use only essential browser storage for temporary functionality, giving you full control over your data.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/privacy-policy">
            <Button variant="outline" size="sm">Privacy Policy</Button>
          </Link>
          <Link to="/terms-of-service">
            <Button variant="outline" size="sm">Terms of Service</Button>
          </Link>
          <a href="mailto:info@cinely.ai">
            <Button variant="outline" size="sm">Contact Us</Button>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-3">
                Cinely.AI
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                AI-powered image generation platform. Create stunning visuals in seconds with advanced batch processing capabilities.
              </p>
              <div className="flex gap-3">
                <a href="#" className="h-9 w-9 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <span className="text-xs font-semibold">𝕏</span>
                </a>
                <a href="#" className="h-9 w-9 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <span className="text-xs font-semibold">in</span>
                </a>
                <a href="#" className="h-9 w-9 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <span className="text-xs font-semibold">IG</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                <li><Link to="/#generate" className="text-sm text-muted-foreground hover:text-primary transition-colors">Generate Images</Link></li>
                <li><Link to="/#edit" className="text-sm text-muted-foreground hover:text-primary transition-colors">Edit Images</Link></li>
                <li><Link to="/#prompt" className="text-sm text-muted-foreground hover:text-primary transition-colors">Image to Prompt</Link></li>
                <li><a href="#batch" className="text-sm text-muted-foreground hover:text-primary transition-colors">Batch Processing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Access</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
                <li><a href="mailto:info@cinely.ai" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                © {new Date().getFullYear()} Cinely.AI. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Status</a>
                <span>•</span>
                <a href="#" className="hover:text-primary transition-colors">Changelog</a>
                <span>•</span>
                <a href="mailto:info@cinely.ai" className="hover:text-primary transition-colors">Support</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CookiePolicy;
