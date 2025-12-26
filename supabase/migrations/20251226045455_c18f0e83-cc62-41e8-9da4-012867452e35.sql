-- Fix avatar storage policies: Remove auth.uid() based policies that don't work with custom auth
-- Keep only public read access - all writes go through the secure avatar-storage Edge Function

-- Drop existing policies that use auth.uid() (incompatible with custom auth)
DROP POLICY IF EXISTS "Authenticated users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Create simple policy for public read access only
-- All write operations (INSERT/UPDATE/DELETE) are handled by the avatar-storage Edge Function
-- which uses service_role key after validating the custom session token
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');