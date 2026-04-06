import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Sparkles, Zap, Crown } from "lucide-react";
import { SEO } from "@/components/SEO";
import UserMenu from "@/components/UserMenu";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Sparkles,
    description: "Get started with AI image generation",
    features: [
      "3 generations per day",
      "Nano Banana model only",
      "Up to 5 images per batch",
      "Watermarked images",
      "7-day history",
    ],
    limitations: ["No Pro or Nano Banana 2 models", "No priority queue"],
    cta: "Current Plan",
    popular: false,
    accent: false,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    icon: Zap,
    description: "For creators who need more power",
    features: [
      "20 generations per day",
      "All 3 AI models",
      "Up to 9 images per batch",
      "Watermarked images",
      "14-day history",
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    popular: true,
    accent: true,
  },
  {
    name: "Premium",
    price: "$24.99",
    period: "/month",
    icon: Crown,
    description: "Unlimited creativity, zero limits",
    features: [
      "Unlimited generations",
      "All 3 AI models",
      "Up to 9 images per batch",
      "Watermarked images",
      "Unlimited history",
      "Priority queue",
    ],
    limitations: [],
    cta: "Go Premium",
    popular: false,
    accent: false,
  },
];

const Pricing = () => {
  return (
    <>
      <SEO
        title="Pricing - Cinely.AI"
        description="Choose the perfect plan for your AI image generation needs. Free, Pro, and Premium tiers available."
        url="https://cinely.ai/pricing"
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <UserMenu />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you need more. All plans include watermarks — remove for just $2/mo.
            </p>
          </div>

          {/* Watermark removal add-on */}
          <div className="mb-8 text-center">
            <Card className="inline-flex items-center gap-3 px-6 py-3 border-primary/20 bg-primary/5">
              <span className="text-sm font-medium">🎨 Remove watermarks on any plan</span>
              <Badge variant="secondary" className="font-bold">+$2/mo</Badge>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.name}
                  className={`relative p-6 flex flex-col ${
                    plan.accent
                      ? "border-primary shadow-lg ring-2 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4">
                      Most Popular
                    </Badge>
                  )}

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="h-4 w-4 mt-0.5 shrink-0 text-center">—</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.accent ? "" : "variant-outline"}`}
                    variant={plan.accent ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-1">When do my daily credits reset?</h3>
                <p className="text-sm text-muted-foreground">Daily credits reset at midnight UTC every day.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Can I switch plans anytime?</h3>
                <p className="text-sm text-muted-foreground">Yes! Upgrade or downgrade at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">We accept all major credit cards, debit cards, and digital wallets through Stripe.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">How does the watermark removal work?</h3>
                <p className="text-sm text-muted-foreground">Add the $2/mo watermark removal to any plan. All your future generations will be watermark-free.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
