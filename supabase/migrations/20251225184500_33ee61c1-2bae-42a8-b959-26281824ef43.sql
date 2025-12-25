-- Fix security issues: Remove overly permissive RLS policies
-- Since all data access is through edge functions using service role key,
-- we should restrict direct client access

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Sessions are readable by anon for validation" ON public.sessions;
DROP POLICY IF EXISTS "Profiles readable by anon" ON public.profiles;
DROP POLICY IF EXISTS "Vision boards readable with valid session" ON public.vision_boards;
DROP POLICY IF EXISTS "Users are viewable by authenticated service" ON public.users;

-- The remaining policies use RESTRICTIVE with service role access which is correct
-- Edge functions use service role key which bypasses RLS entirely

-- Verify RLS is enabled on all tables (it should already be)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_boards ENABLE ROW LEVEL SECURITY;