import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        {/* Content */}
        <Card className="p-6 sm:p-8 md:p-10">
          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Cinely.AI ("Service," "we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. We reserve the right to modify these Terms at any time, and your continued use constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">2. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Cinely.AI provides AI-powered image generation, editing, and analysis services. Our platform offers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Text-to-Image Generation:</strong> Create images from text prompts using AI models</li>
                <li><strong>Image Editing:</strong> Upload and modify existing images with AI assistance</li>
                <li><strong>Image-to-Prompt Analysis:</strong> Generate descriptive prompts from uploaded images</li>
                <li><strong>Batch Processing:</strong> Generate up to 10 images simultaneously</li>
                <li><strong>Watermarked Outputs:</strong> All generated images include "AI Generated" watermarks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">3. User Responsibilities</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">3.1 Lawful Use</h3>
              <p className="text-muted-foreground leading-relaxed">
                You agree to use Cinely.AI only for lawful purposes and in accordance with these Terms. You are solely responsible for the content of your prompts and uploaded images.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Content Guidelines</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">You agree NOT to use the Service to create, upload, or request:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Content that is illegal, harmful, threatening, abusive, harassing, or defamatory</li>
                <li>Content depicting violence, gore, or self-harm</li>
                <li>Sexually explicit or pornographic content</li>
                <li>Content that promotes hatred, discrimination, or harassment based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
                <li>Content involving minors in inappropriate contexts</li>
                <li>Content that infringes on intellectual property rights of others</li>
                <li>Content used for impersonation, fraud, or deception</li>
                <li>Spam, malware, or content designed to disrupt services</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">3.3 Fair Use</h3>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to abuse the Service through excessive requests, automated scraping, or attempts to circumvent rate limits or technical protections.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">4. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                In addition to the content guidelines above, you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the Service to generate content for illegal activities</li>
                <li>Attempt to reverse engineer, decompile, or extract the underlying AI models</li>
                <li>Remove, obscure, or alter watermarks from generated images</li>
                <li>Resell or redistribute the Service without authorization</li>
                <li>Use the Service to train competing AI models</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">5. AI Content & Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">5.1 Generated Images</h3>
              <p className="text-muted-foreground leading-relaxed">
                Images generated by Cinely.AI are created by artificial intelligence models. Subject to these Terms and applicable law, you are granted a non-exclusive license to use, display, and create derivative works from images you generate. However:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>AI-generated content may not be eligible for copyright protection in all jurisdictions</li>
                <li>Similar prompts may produce similar outputs for different users</li>
                <li>You are responsible for ensuring your use complies with applicable laws</li>
                <li>Watermarks must remain intact for attribution purposes</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Your Content</h3>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of prompts and images you upload. By submitting content to the Service, you grant us a limited, non-exclusive license to process your content solely for the purpose of providing the Service.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">5.3 Third-Party Rights</h3>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for ensuring you have the right to upload and process any images you submit. You agree to indemnify us against any claims arising from your uploaded content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">6. Service Availability</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">6.1 No Uptime Guarantees</h3>
              <p className="text-muted-foreground leading-relaxed">
                We strive to provide reliable service but do not guarantee uninterrupted access. The Service may be unavailable due to maintenance, updates, or circumstances beyond our control.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.2 Rate Limiting</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may implement rate limits, usage caps, or other restrictions to ensure fair access and prevent abuse. We reserve the right to throttle or block excessive usage.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">6.3 Service Modifications</h3>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time without prior notice or liability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
                <li>Warranties regarding the accuracy, reliability, or quality of AI-generated content</li>
                <li>Warranties that AI outputs will meet your expectations or requirements</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                AI-generated images may contain errors, biases, or unexpected results. Users should review all outputs before use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CINELY.AI AND ITS AFFILIATES SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or use</li>
                <li>Damages arising from your use or inability to use the Service</li>
                <li>Damages arising from AI-generated content, including copyright claims</li>
                <li>Damages arising from unauthorized access to your content</li>
                <li>Damages exceeding the amount you paid for the Service (if any) in the preceding 12 months</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so the above limitations may not apply to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">9. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless Cinely.AI, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Your use or misuse of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights, including intellectual property rights</li>
                <li>Content you submit, upload, or generate through the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">10. AI Model Restrictions</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The AI models used by Cinely.AI have built-in content filters and safety measures. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Reject prompts that violate our content policy</li>
                <li>Refuse to process uploaded images deemed inappropriate</li>
                <li>Terminate access for users who repeatedly violate content guidelines</li>
                <li>Report illegal content to appropriate authorities</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                AI models may refuse to generate certain content even if it complies with our Terms due to underlying model limitations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">11. Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of the Service is subject to our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>. By using the Service, you consent to our collection and use of information as described in that policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">12. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your access to the Service at any time, with or without cause or notice, for any reason including violation of these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">13. Governing Law & Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">13.1 Governing Law</h3>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Cinely.AI operates, without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">13.2 Dispute Resolution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Any disputes arising from these Terms or your use of the Service shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration or in the courts of the applicable jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">14. Miscellaneous</h2>
              
              <h3 className="text-xl font-semibold mb-2 mt-4">14.1 Entire Agreement</h3>
              <p className="text-muted-foreground leading-relaxed">
                These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Cinely.AI regarding the Service.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">14.2 Severability</h3>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">14.3 Waiver</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4">14.4 Assignment</h3>
              <p className="text-muted-foreground leading-relaxed">
                You may not assign or transfer these Terms without our prior written consent. We may assign or transfer these Terms without restriction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">15. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-3 p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Email:</strong> <a href="mailto:info@cinely.ai" className="text-primary hover:underline">info@cinely.ai</a>
                </p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Important Notice:</strong> By using Cinely.AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the Service immediately.
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to="/privacy-policy">
            <Button variant="outline" size="sm">Privacy Policy</Button>
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

export default TermsOfService;
