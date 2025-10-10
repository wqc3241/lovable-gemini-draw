import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
            Privacy Policy
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
                Welcome to Cinely.AI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring transparency about how we handle your information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding your information when you use our AI-powered image generation platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Text Prompts:</strong> The descriptions you enter to generate images</li>
                <li><strong>Uploaded Images:</strong> Images you upload for editing or prompt analysis</li>
                <li><strong>Generation Settings:</strong> Your chosen aspect ratios, image counts, and mode selections</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Server Logs:</strong> IP addresses, browser type, and access times when you interact with our edge functions</li>
                <li><strong>Technical Data:</strong> Device information and browser capabilities for compatibility</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">2.3 What We Don't Collect</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>No user accounts, profiles, or registration data</li>
                <li>No persistent cookies or tracking pixels</li>
                <li>No analytics or behavioral tracking</li>
                <li>No personal identification information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Service Delivery:</strong> Process your AI image generation, editing, and analysis requests</li>
                <li><strong>Quality Improvement:</strong> Understand service performance and identify technical issues</li>
                <li><strong>Security:</strong> Detect and prevent abuse, fraud, and violations of our Terms of Service</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and respond to legal requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Data Processing & Third-Party Services</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">4.1 Lovable AI Gateway</h3>
              <p className="text-muted-foreground leading-relaxed">
                We use the Lovable AI Gateway (powered by Google Gemini models) to process your image generation requests. Your prompts and uploaded images are temporarily transmitted to Google's AI infrastructure for processing. Google may process this data according to their privacy policies.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Data Sharing</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>We do not sell, rent, or trade your data to third parties</li>
                <li>Data is only shared with AI processing services necessary for functionality</li>
                <li>We may disclose data if required by law or to protect our legal rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. Data Retention & Storage</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>Temporary Processing Only:</strong> Cinely.AI does not maintain a persistent database of user-generated content. All processing occurs in-memory and is immediately discarded after delivery.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Prompts & Images:</strong> Processed temporarily and not stored on our servers</li>
                <li><strong>Generated Images:</strong> Stored only in your browser's cache/session storage</li>
                <li><strong>Server Logs:</strong> Retained for up to 30 days for security and debugging purposes</li>
                <li><strong>User Control:</strong> You can clear all local data by clearing your browser cache</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Your Privacy Rights</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">6.1 GDPR Rights (European Users)</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Access:</strong> Request information about data we process about you</li>
                <li><strong>Deletion:</strong> Request deletion of your data from server logs</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Rectification:</strong> Correct inaccurate data</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.2 CCPA Rights (California Users)</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information</li>
                <li>Right to opt-out of data sales (note: we do not sell data)</li>
                <li>Right to non-discrimination for exercising rights</li>
              </ul>

              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise any of these rights, contact us at <a href="mailto:info@cinely.ai" className="text-primary hover:underline">info@cinely.ai</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Security Measures</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>HTTPS Encryption:</strong> All data transmission is encrypted using TLS/SSL</li>
                <li><strong>Edge Function Isolation:</strong> Processing occurs in isolated serverless environments</li>
                <li><strong>No Database Storage:</strong> No persistent storage means no risk of database breaches</li>
                <li><strong>Client-Side Processing:</strong> Watermarking and downloads occur entirely in your browser</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                While we implement industry-standard security measures, no internet transmission is 100% secure. Users should exercise caution when uploading sensitive content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cinely.AI is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us at <a href="mailto:info@cinely.ai" className="text-primary hover:underline">info@cinely.ai</a>, and we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are provided via cloud infrastructure that may process data in multiple jurisdictions. By using Cinely.AI, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. When we make significant changes, we will update the "Last updated" date at the top of this policy. Continued use of Cinely.AI after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-3 p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> <a href="mailto:info@cinely.ai" className="text-primary hover:underline">info@cinely.ai</a>
                </p>
              </div>
            </section>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/terms-of-service">
            <Button variant="outline" size="sm">Terms of Service</Button>
          </Link>
          <Link to="/cookie-policy">
            <Button variant="outline" size="sm">Cookie Policy</Button>
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

export default PrivacyPolicy;
