-- Create slideshow-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('slideshow-images', 'slideshow-images', true);

-- Allow public read access to slideshow images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'slideshow-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'slideshow-images' 
  AND auth.role() = 'authenticated'
);