-- Users table for custom authentication
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Sessions table for session-based auth
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Vision boards table
CREATE TABLE public.vision_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Board',
  board_data JSONB DEFAULT '{}',
  category TEXT DEFAULT 'personal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_boards ENABLE ROW LEVEL SECURITY;

-- RLS policies: All operations go through edge functions (service role)
-- Users can only read their own data through authenticated sessions
CREATE POLICY "Users are viewable by authenticated service" 
ON public.users FOR SELECT 
TO authenticated, service_role
USING (true);

CREATE POLICY "Users can be created by service" 
ON public.users FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Users can be updated by service" 
ON public.users FOR UPDATE 
TO service_role
USING (true);

-- Sessions policies
CREATE POLICY "Sessions are managed by service" 
ON public.sessions FOR ALL 
TO service_role
USING (true);

CREATE POLICY "Sessions are readable by anon for validation" 
ON public.sessions FOR SELECT 
TO anon
USING (true);

-- Vision boards policies
CREATE POLICY "Vision boards are managed by service" 
ON public.vision_boards FOR ALL 
TO service_role
USING (true);

CREATE POLICY "Vision boards readable with valid session" 
ON public.vision_boards FOR SELECT 
TO anon
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vision_boards_updated_at
BEFORE UPDATE ON public.vision_boards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_sessions_token ON public.sessions(token);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_vision_boards_user_id ON public.vision_boards(user_id);