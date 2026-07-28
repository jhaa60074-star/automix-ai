-- ============================================================================
-- SUPABASE SCHEMA SETUP FOR AUTOMIK (PHASE 2)
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
-- END OF SCHEMA
-- ============================================================================
