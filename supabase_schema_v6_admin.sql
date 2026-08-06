-- Supabase Schema V6: Admin Panel Foundation, Link Library, and AI Stats

-- 1. Add Role System to Profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Set a manual trigger/helper to make the first user an admin (optional step for user)
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-uuid';

-- 2. Create Link Library Table
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'resource', -- e.g., 'resource', 'affiliate', 'booking'
    usage_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on Links
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Idempotent policy creation for links
DROP POLICY IF EXISTS "Users can manage their own links" ON public.links;
CREATE POLICY "Users can manage their own links" 
ON public.links FOR ALL 
USING (auth.uid() = user_id);

-- 3. Create Aggregate AI Usage Stats (for Admin Dashboard placeholders)
CREATE TABLE IF NOT EXISTS public.ai_usage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'openai', 'openrouter', 'ollama'
    model VARCHAR(100),
    tokens_prompt INTEGER DEFAULT 0,
    tokens_completion INTEGER DEFAULT 0,
    estimated_cost NUMERIC(10, 6) DEFAULT 0,
    request_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    period_end TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on AI Usage Stats
ALTER TABLE public.ai_usage_stats ENABLE ROW LEVEL SECURITY;

-- Idempotent policy creation for AI Usage Stats
DROP POLICY IF EXISTS "Users can read their own ai stats" ON public.ai_usage_stats;
CREATE POLICY "Users can read their own ai stats" 
ON public.ai_usage_stats FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Admin Policy Foundation
-- Admin-only views will be handled at the application level (Next.js layout/middleware),
-- but we can prepare an admin-only bypass if needed in the future using:
-- CREATE OR REPLACE FUNCTION auth.is_admin() RETURNS boolean AS $$ ... $$;
