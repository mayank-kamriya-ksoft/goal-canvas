-- Grant explicit permissions on profiles table to fix schema cache issue
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;

-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant sequence permissions if any
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';