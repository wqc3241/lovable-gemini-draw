import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, History, CreditCard, LogOut, Crown, Sparkles, Shield } from "lucide-react";
import { toast } from "sonner";
import UserMenu from "@/components/UserMenu";
import { SEO } from "@/components/SEO";
import type { User } from "@supabase/supabase-js";

const PLAN_PRICES: Record<string, string> = {
  free: "Free",
  pro: "$9.99/mo",
  premium: "$24.99/mo",
};

const PLAN_ICONS: Record<string, React.ReactNode> = {
  free: <Shield className="h-5 w-5" />,
  pro: <Sparkles className="h-5 w-5" />,
  premium: <Crown className="h-5 w-5" />,
};

const CREDIT_COSTS = [
  { model: "Nano Banana", cost: 0.25 },
  { model: "Nano Banana 2", cost: 0.50 },
  { model: "Nano Banana Pro", cost: 0.75 },
  { model: "Image Prompt", cost: 0.25 },
];

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [watermarkRemoved, setWatermarkRemoved] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [creditsTotal, setCreditsTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/");
        return;
      }
      setUser(session.user);
      loadData(session.user.id);
    });
  }, [navigate]);

  const loadData = async (userId: string) => {
    setLoading(true);
    try {
      const [profileRes, creditsRes, subRes] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url").eq("user_id", userId).single(),
        supabase.functions.invoke("check-credits", {
          body: { action: "check", model: "google/gemini-2.5-flash-image-preview", imageCount: 1, generationType: "generate" },
        }),
        supabase.functions.invoke("check-subscription"),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (creditsRes.data) {
        setCreditsRemaining(creditsRes.data.creditsRemaining ?? 0);
        setCreditsTotal(creditsRes.data.creditsTotal ?? 0);
        setWatermarkRemoved(creditsRes.data.watermarkRemoved || false);
      }
      if (subRes.data) {
        setCurrentPlan(subRes.data.plan || "free");
        setSubscriptionEnd(subRes.data.subscription_end || null);
        if (subRes.data.watermark_removed) setWatermarkRemoved(true);
      }
    } catch (e) {
      console.error("Failed to load profile data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setActionLoading("manage");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Failed to open subscription management");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddWatermarkRemoval = async () => {
    setActionLoading("watermark");
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { plan: "watermark_removal" },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      toast.error("Failed to start checkout");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Signed out");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const creditPercent = creditsTotal > 0 ? Math.min((creditsRemaining / creditsTotal) * 100, 100) : 0;

  const initials = (profile?.display_name || user?.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="My Account — Cinely.AI" description="Manage your account, view usage, and subscription." />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <UserMenu />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-6">My Account</h1>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{profile?.display_name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Plan Card */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">Current Plan</h2>
            <span className="text-sm font-semibold text-foreground">{PLAN_PRICES[currentPlan]}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            {PLAN_ICONS[currentPlan]}
            <span className="text-lg font-bold text-foreground capitalize">{currentPlan}</span>
          </div>
          {subscriptionEnd && (
            <p className="text-sm text-muted-foreground mb-3">
              Renews: {new Date(subscriptionEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}

          <div className="flex items-center justify-between py-3 border-t border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Watermark Removal</p>
              <p className="text-xs text-muted-foreground">
                {watermarkRemoved ? "Active" : "$2/mo add-on"}
              </p>
            </div>
            {!watermarkRemoved && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddWatermarkRemoval}
                disabled={actionLoading === "watermark"}
              >
                {actionLoading === "watermark" ? "Loading..." : "Add $2/mo"}
              </Button>
            )}
            {watermarkRemoved && (
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Active</span>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            {currentPlan !== "free" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageSubscription}
                disabled={actionLoading === "manage"}
              >
                {actionLoading === "manage" ? "Loading..." : "Manage Subscription"}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => navigate("/pricing")}>
              Change Plan
            </Button>
          </div>
        </div>

        {/* Usage Card */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Monthly Credits</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">Credits Remaining</span>
                <span className="text-muted-foreground">
                  {creditsRemaining} / {creditsTotal}
                </span>
              </div>
              <Progress value={creditPercent} className="h-2" />
            </div>

            {/* Credit cost breakdown */}
            <div className="border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Credit costs per image</p>
              <div className="grid grid-cols-2 gap-1">
                {CREDIT_COSTS.map((item) => (
                  <div key={item.model} className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.model}</span>
                    <span className="font-medium text-foreground">{item.cost} cr</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-6 mb-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h2>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/history")} className="gap-2">
              <History className="h-4 w-4" /> Generation History
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/pricing")} className="gap-2">
              <CreditCard className="h-4 w-4" /> Pricing
            </Button>
          </div>
        </div>

        {/* Sign Out */}
        <Button variant="ghost" className="w-full text-destructive gap-2" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
