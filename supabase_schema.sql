-- ============================================================================
-- SUPABASE SCHEMA SETUP FOR AUTRIXGPT (PHASE 2)
-- Run this entire script in the Supabase Dashboard SQL Editor
-- ============================================================================

-- 1. Create Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. Create Subscriptions Table (Foundation)
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id TEXT NOT NULL, -- e.g., 'free', 'premium', 'business'
  status TEXT NOT NULL, -- e.g., 'active', 'canceled', 'past_due'
  start_date TIMESTAMPTZ DEFAULT NOW(),
  renewal_date TIMESTAMPTZ,
  cancellation_date TIMESTAMPTZ,
  provider_reference TEXT -- For future Stripe/payment ID
);

-- Enable RLS on Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscription Policies
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Create Usage Tracking Table (Foundation)
CREATE TABLE public.usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric TEXT NOT NULL, -- e.g., 'ai_messages', 'file_analyses'
  value INTEGER DEFAULT 0,
  period_start TIMESTAMPTZ DEFAULT NOW(),
  period_end TIMESTAMPTZ
);

-- Enable RLS on Usage
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Usage Policies
CREATE POLICY "Users can view their own usage" 
ON public.usage_tracking FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Function & Trigger for Automatic Profile Creation
-- When a user signs up, Supabase Auth inserts into auth.users.
-- This trigger will automatically create a corresponding record in public.profiles.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Optionally set them up on a free plan automatically
  INSERT INTO public.subscriptions (user_id, plan_id, status)
  VALUES (NEW.id, 'free', 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- PHASE 3A: AI ARCHITECTURE & STORAGE
-- ============================================================================

-- 5. Create Conversations Table
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  type TEXT DEFAULT 'chat', -- 'chat' or 'research'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Conversation Policies
CREATE POLICY "Users can manage their own conversations" 
ON public.conversations FOR ALL
USING (auth.uid() = user_id);

-- 6. Create Messages Table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Message Policies
-- Messages are indirectly owned by the user through the conversation
CREATE POLICY "Users can manage messages in their conversations" 
ON public.messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = public.messages.conversation_id AND c.user_id = auth.uid()
  )
);

-- 7. Create User Files Table
CREATE TABLE public.user_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage bucket
  file_name TEXT NOT NULL,
  file_type TEXT, -- e.g., 'application/pdf'
  size INTEGER, -- Size in bytes
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on User Files
ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

-- User Files Policies
CREATE POLICY "Users can manage their own files" 
ON public.user_files FOR ALL
USING (auth.uid() = user_id);

-- Note: Remember to create an 'ai_uploads' storage bucket in Supabase dashboard 
-- and set its RLS policies so users can only access files in their own folder (user_id/*).

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
