import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Loader2, ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import UserMenu from "@/components/UserMenu";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HistoryItem {
  id: string;
  prompt: string;
  model: string;
  aspect_ratio: string;
  mode: string;
  image_url: string;
  created_at: string;
}

interface GenerationGroup {
  key: string;
  prompt: string;
  mode: string;
  model: string;
  date: string;
  images: { id: string; url: string }[];
}

const MODEL_LABELS: Record<string, string> = {
  "google/gemini-2.5-flash-image-preview": "Nano Banana",
  "google/gemini-3.1-flash-image-preview": "Nano Banana 2",
  "google/gemini-3-pro-image-preview": "Pro",
};

function groupHistory(items: HistoryItem[]): GenerationGroup[] {
  const map = new Map<string, GenerationGroup>();
  for (const item of items) {
    const minuteKey = new Date(item.created_at).toISOString().slice(0, 16);
    const key = `${item.prompt}||${item.mode}||${item.model}||${minuteKey}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        prompt: item.prompt,
        mode: item.mode,
        model: item.model,
        date: item.created_at,
        images: [],
      });
    }
    map.get(key)!.images.push({ id: item.id, url: item.image_url });
  }
  return Array.from(map.values());
}

const PAGE_SIZE = 50;

const History = () => {
  const navigate = useNavigate();
  const { user, isReady } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set());
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchHistory();
  }, [isReady, user, navigate]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("generation_history")
      .select("id, prompt, model, aspect_ratio, mode, image_url, created_at")
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (error) {
      toast.error("Failed to load history");
    } else {
      setHistory(data || []);
      setHasMore((data?.length ?? 0) === PAGE_SIZE);
      const hasBase64 = data?.some((item) => item.image_url.startsWith("data:"));
      if (hasBase64) {
        supabase.functions.invoke("migrate-images").then(({ data: migData }) => {
          if (migData?.migrated > 0) fetchHistory();
        });
      }
    }
    setIsLoading(false);
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore || history.length === 0) return;
    setIsLoadingMore(true);
    const lastDate = history[history.length - 1].created_at;
    const { data, error } = await supabase
      .from("generation_history")
      .select("id, prompt, model, aspect_ratio, mode, image_url, created_at")
      .order("created_at", { ascending: false })
      .lt("created_at", lastDate)
      .limit(PAGE_SIZE);

    if (error) {
      toast.error("Failed to load more");
    } else {
      setHistory((prev) => [...prev, ...(data || [])]);
      setHasMore((data?.length ?? 0) === PAGE_SIZE);
    }
    setIsLoadingMore(false);
  };

  const handleDeleteGroup = async (group: GenerationGroup) => {
    const ids = group.images.map((img) => img.id);
    const { error } = await supabase
      .from("generation_history")
      .delete()
      .in("id", ids);
    if (error) {
      toast.error("Failed to delete");
    } else {
      // Also delete from storage for non-base64 URLs
      for (const img of group.images) {
        if (!img.url.startsWith("data:")) {
          try {
            const urlParts = new URL(img.url);
            const pathMatch = urlParts.pathname.match(/\/generated-images\/(.+)$/);
            if (pathMatch) {
              await supabase.storage.from("generated-images").remove([pathMatch[1]]);
            }
          } catch {
            // Ignore storage deletion errors
          }
        }
      }
      setHistory((prev) => prev.filter((item) => !ids.includes(item.id)));
      toast.success("Deleted");
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedPrompts((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const groups = groupHistory(history);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " at " + d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <SEO title="History - Cinely.AI" description="View your generation history." url="https://cinely.ai/history" />
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <UserMenu />
          </div>

          <h1 className="text-3xl font-bold mb-6">Generation History</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : groups.length === 0 ? (
            <Card className="p-12 text-center border border-border">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No generations yet. Start creating!</p>
              <Button className="mt-4" onClick={() => navigate("/")}>
                Generate Images
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {groups.map((group) => {
                const isLong = group.prompt.length > 200;
                const isExpanded = expandedPrompts.has(group.key);
                return (
                  <Card key={group.key} className="border border-border bg-card p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(group.date)}
                      </p>
                      <button
                        onClick={() => handleDeleteGroup(group)}
                        className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete generation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mb-3">
                      <p className={`text-sm leading-relaxed ${!isExpanded && isLong ? "line-clamp-3" : ""}`}>
                        "{group.prompt}"
                      </p>
                      {isLong && (
                        <button
                          onClick={() => toggleExpand(group.key)}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                        >
                          {isExpanded ? (
                            <>Show less <ChevronUp className="h-3 w-3" /></>
                          ) : (
                            <>Show more <ChevronDown className="h-3 w-3" /></>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-3">
                      {group.images.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => setLightboxUrl(img.url)}
                          className="shrink-0 rounded-lg overflow-hidden border border-border hover:ring-2 hover:ring-primary/40 transition-all"
                        >
                          <img
                            src={img.url}
                            alt={group.prompt}
                            className="h-24 w-24 sm:h-28 sm:w-28 object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{group.mode}</span>
                      <span>·</span>
                      <span>{MODEL_LABELS[group.model] || group.model}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!lightboxUrl} onOpenChange={() => setLightboxUrl(null)}>
        <DialogContent className="max-w-3xl p-2 bg-background border-border">
          {lightboxUrl && (
            <img
              src={lightboxUrl}
              alt="Full size preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default History;
