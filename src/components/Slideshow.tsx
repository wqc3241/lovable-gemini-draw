import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Slideshow = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "center",
    dragFree: true,
    containScroll: false
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .storage
          .from('slideshow-images')
          .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Error fetching slideshow images:', error);
          setLoading(false);
          return;
        }

        const imageUrls = data
          .filter(file => !file.name.startsWith('.'))
          .map(file => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('slideshow-images')
              .getPublicUrl(file.name);
            return publicUrl;
          });

        setImages(imageUrls);
      } catch (err) {
        console.error('Error loading slideshow:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (!emblaApi || images.length === 0) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(autoplay);
  }, [emblaApi, images.length]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto">
        <Skeleton className="h-[180px] w-full rounded-lg" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto h-[180px] flex items-center justify-center bg-muted/50 rounded-lg">
        <p className="text-muted-foreground text-sm">No slideshow images available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden" ref={emblaRef}>
      <div className="flex gap-3">
        {images.map((url, index) => (
          <div 
            key={index} 
            className="flex-[0_0_auto] w-[280px] sm:w-[320px] h-[180px]"
          >
            <img
              src={url}
              alt={`Slideshow image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-md"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
