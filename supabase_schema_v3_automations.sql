-- ============================================================================
-- SUPABASE SCHEMA SETUP FOR AUTRIXGPT (PHASE 4A: AUTOMATIONS)
-- Run this script in the Supabase Dashboard SQL Editor
-- ============================================================================

-- 1. Automation Connections (OAuth tokens, status)
CREATE TABLE IF NOT EXISTS public.automation_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  integration TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected',
  credentials JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, integration)
);

ALTER TABLE public.automation_connections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own connections" ON public.automation_connections;
CREATE POLICY "Users can manage their own connections" ON public.automation_connections FOR ALL USING (auth.uid() = user_id);

-- 2. Automation Workflows (Rules and settings)
CREATE TABLE IF NOT EXISTS public.automation_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  integration TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  settings JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automation_workflows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their workflows" ON public.automation_workflows;
CREATE POLICY "Users can manage their workflows" ON public.automation_workflows FOR ALL USING (auth.uid() = user_id);

-- 3. Automation Queue (Pending background tasks)
CREATE TABLE IF NOT EXISTS public.automation_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workflow_id UUID REFERENCES public.automation_workflows(id) ON DELETE SET NULL,
  integration TEXT NOT NULL,
  payload JSONB,
  status TEXT DEFAULT 'queued',
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automation_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their queue" ON public.automation_queue;
CREATE POLICY "Users can manage their queue" ON public.automation_queue FOR ALL USING (auth.uid() = user_id);

-- 4. Automation Logs (Execution history)
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workflow_id UUID REFERENCES public.automation_workflows(id) ON DELETE SET NULL,
  automation_type TEXT NOT NULL,
  status TEXT NOT NULL,
  payload JSONB,
  response JSONB,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their logs" ON public.automation_logs;
CREATE POLICY "Users can view their logs" ON public.automation_logs FOR SELECT USING (auth.uid() = user_id);

-- 5. Automation Analytics (Metrics tracking)
CREATE TABLE IF NOT EXISTS public.automation_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  integration TEXT NOT NULL,
  event_type TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.automation_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their analytics" ON public.automation_analytics;
CREATE POLICY "Users can view their analytics" ON public.automation_analytics FOR SELECT USING (auth.uid() = user_id);
