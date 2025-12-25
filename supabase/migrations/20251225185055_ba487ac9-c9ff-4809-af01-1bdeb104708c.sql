-- Create rate_limits table for tracking authentication attempts
CREATE TABLE public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  action_type TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  UNIQUE(identifier, action_type)
);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Block all anon access (managed by edge functions with service role)
CREATE POLICY "Block anon access to rate_limits"
ON public.rate_limits FOR ALL
TO anon
USING (false);

-- Create index for faster lookups
CREATE INDEX idx_rate_limits_lookup ON public.rate_limits(identifier, action_type);

-- Create function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE last_attempt_at < now() - INTERVAL '24 hours'
    AND (blocked_until IS NULL OR blocked_until < now());
END;
$$;