import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  canonicalUrl?: string;
}

export function SEO({
  title = "Cinely.ai — The AI Studio for Visual Mastery",
  description = "Create, Refine, And Understand your visuals - effortlessly, in cinematic detail.",
  keywords = [],
  image = "https://storage.googleapis.com/gpt-engineer-file-uploads/Ra5nuHzDP7Yn8XkWFAjb44p8ID62/social-images/social-1760133202794-wechat_2025-10-10_145230_162.png",
  url = "https://cinely.ai",
  type = "website",
  canonicalUrl
}: SEOProps) {
  const fullTitle = title.includes('Cinely') ? title : `${title} | Cinely.ai`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
