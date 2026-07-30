-- ============================================================================
-- SUPABASE SCHEMA SETUP FOR AUTRIXGPT (PHASE 3: AI ASSISTANT UPGRADES)
-- Run this entire script in the Supabase Dashboard SQL Editor
-- ============================================================================

-- 1. Create Chats Table (Replaces/Aligns with Conversations)
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  type TEXT DEFAULT 'chat',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own chats" ON public.chats;
CREATE POLICY "Users can manage their own chats" 
ON public.chats FOR ALL
USING (auth.uid() = user_id);

-- 2. Create Messages Table (Updated for chats relation)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage messages in their chats" ON public.messages;
CREATE POLICY "Users can manage messages in their chats" 
ON public.messages FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.chats c 
    WHERE c.id = public.messages.chat_id AND c.user_id = auth.uid()
  )
);

-- 3. Create Attachments Table (Replaces user_files)
CREATE TABLE IF NOT EXISTS public.attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE, -- Optional relation to chat
  file_name TEXT NOT NULL,
  file_type TEXT,
  size INTEGER,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own attachments" ON public.attachments;
CREATE POLICY "Users can manage their own attachments" 
ON public.attachments FOR ALL
USING (auth.uid() = user_id);

-- 4. Create Memory Table for AI Long-term Context
CREATE TABLE IF NOT EXISTS public.memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.memory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own memory" ON public.memory;
CREATE POLICY "Users can manage their own memory" 
ON public.memory FOR ALL
USING (auth.uid() = user_id);

-- 5. Create AI Usage Table
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  action_type TEXT NOT NULL, -- 'chat', 'research', 'upload'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own AI usage" ON public.ai_usage;
CREATE POLICY "Users can view their own AI usage" 
ON public.ai_usage FOR SELECT 
USING (auth.uid() = user_id);

-- ============================================================================
-- NOTE: Please ensure the 'ai_uploads' storage bucket exists in Supabase Storage.
-- Set its RLS policies so users can only access files in their own folder (user_id/*).
-- ============================================================================
