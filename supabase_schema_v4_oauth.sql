-- ============================================================================
-- SUPABASE SCHEMA SETUP FOR AUTRIXGPT (PHASE 4B: META OAUTH)
-- Run this script in the Supabase Dashboard SQL Editor
-- ============================================================================

-- 1. OAuth Tokens (Secure encrypted storage for access tokens)
CREATE TABLE IF NOT EXISTS public.oauth_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL, -- e.g., 'facebook'
  access_token TEXT NOT NULL, -- In production, this should be encrypted at application level or via pgcrypto
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own tokens" ON public.oauth_tokens;
CREATE POLICY "Users can manage their own tokens" ON public.oauth_tokens FOR ALL USING (auth.uid() = user_id); 

-- 2. Instagram Accounts (Metadata for connected accounts)
CREATE TABLE IF NOT EXISTS public.instagram_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  facebook_page_id TEXT NOT NULL,
  instagram_business_id TEXT NOT NULL,
  username TEXT,
  profile_picture_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, instagram_business_id)
);

ALTER TABLE public.instagram_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their instagram accounts" ON public.instagram_accounts;
CREATE POLICY "Users can view their instagram accounts" ON public.instagram_accounts FOR SELECT USING (auth.uid() = user_id);

-- 3. Update automation_connections to reflect the OAuth state
-- (This table was created in Phase 4A, we ensure it's ready for Phase 4B)
-- The backend will update status to 'connected' once the OAuth flow completes.
