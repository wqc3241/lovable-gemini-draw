import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import GenerateImagesGuide from "./pages/GenerateImagesGuide";
import EditImagesGuide from "./pages/EditImagesGuide";
import ImageToPromptGuide from "./pages/ImageToPromptGuide";
import BatchProcessingGuide from "./pages/BatchProcessingGuide";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Force light mode by removing dark class
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/guide/generate-images" element={<GenerateImagesGuide />} />
            <Route path="/guide/edit-images" element={<EditImagesGuide />} />
            <Route path="/guide/image-to-prompt" element={<ImageToPromptGuide />} />
            <Route path="/guide/batch-processing" element={<BatchProcessingGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
