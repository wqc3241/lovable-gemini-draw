-- Allow public read access to slideshow images
CREATE POLICY "Public Access to Slideshow Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'slideshow-images');

-- Allow authenticated users to upload slideshow images
CREATE POLICY "Authenticated Upload to Slideshow Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'slideshow-images');

-- Allow authenticated users to delete slideshow images
CREATE POLICY "Authenticated Delete Slideshow Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'slideshow-images');