import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "@/components/AuthDialog";
import { SEO } from "@/components/SEO";

const Auth = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <SEO
        title="Sign In - Cinely.AI"
        description="Sign in or create an account to save your generation history."
        url="https://cinely.ai/auth"
      />
      <div className="min-h-screen bg-background" />
      <AuthDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) navigate("/");
        }}
      />
    </>
  );
};

export default Auth;
