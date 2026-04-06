import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import UserMenu from "@/components/UserMenu";

interface HistoryItem {
  id: string;
  prompt: string;
  model: string;
  aspect_ratio: string;
  image_url: string;
  mode: string;
  created_at: string;
}

const MODEL_LABELS: Record<string, string> = {
  "google/gemini-2.5-flash-image-preview": "Nano Banana",
  "google/gemini-3.1-flash-image-preview": "Nano Banana 2",
  "google/gemini-3-pro-image-preview": "Pro",
};

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchHistory();
    };
    checkAuth();
  }, [navigate]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("generation_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      toast.error("Failed to load history");
    } else {
      setHistory(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("generation_history").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted");
    }
  };

  return (
    <>
      <SEO title="History - Cinely.AI" description="View your generation history." url="https://cinely.ai/history" />
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-4xl">
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
          ) : history.length === 0 ? (
            <Card className="p-12 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No generations yet. Start creating!</p>
              <Button className="mt-4" onClick={() => navigate("/")}>
                Generate Images
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((item) => (
                <Card key={item.id} className="overflow-hidden group">
                  <div className="aspect-square relative">
                    <img
                      src={item.image_url}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm line-clamp-2 mb-1">{item.prompt}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{item.mode}</span>
                      <span>·</span>
                      <span>{MODEL_LABELS[item.model] || item.model}</span>
                      <span>·</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default History;
