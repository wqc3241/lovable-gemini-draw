CREATE OR REPLACE FUNCTION public.get_public_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_users', 104 + (SELECT count(*) FROM public.profiles),
    'total_images', 242 + (SELECT count(*) FROM public.generation_history)
  );
$$;