
CREATE OR REPLACE FUNCTION public.get_public_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM public.profiles),
    'total_images', (SELECT count(*) FROM public.generation_history)
  );
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.generation_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
