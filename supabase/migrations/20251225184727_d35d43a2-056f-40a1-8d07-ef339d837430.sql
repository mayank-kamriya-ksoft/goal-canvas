-- Add explicit blocking policies for anon users
-- This prevents direct client access while allowing edge functions with service role

-- Block all anon access to users table
CREATE POLICY "Block anon access to users"
ON public.users FOR ALL
TO anon
USING (false);

-- Block all anon access to sessions table
CREATE POLICY "Block anon access to sessions"
ON public.sessions FOR ALL
TO anon
USING (false);

-- Block all anon access to profiles table
CREATE POLICY "Block anon access to profiles"
ON public.profiles FOR ALL
TO anon
USING (false);

-- Block all anon access to vision_boards table
CREATE POLICY "Block anon access to vision_boards"
ON public.vision_boards FOR ALL
TO anon
USING (false);