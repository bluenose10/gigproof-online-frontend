-- Harden security definer functions to prevent search_path injection attacks
-- This resolves the 'function_search_path_mutable' warning in Supabase

-- 1. Harden public.handle_new_user
ALTER FUNCTION public.handle_new_user() SET search_path = "";

-- 2. Harden public.has_role 
ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = "";

-- 3. Harden public.update_updated_at_column
ALTER FUNCTION public.update_updated_at_column() SET search_path = "";
