-- Supabase Schema V7: Instagram Automation Builder

-- 1. Connected Instagram Accounts
CREATE TABLE IF NOT EXISTS instagram_connected_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    instagram_user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    facebook_page_id VARCHAR(255),
    facebook_page_name VARCHAR(255),
    access_token TEXT,
    status VARCHAR(50) DEFAULT 'connected',
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Link Library
CREATE TABLE IF NOT EXISTS instagram_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(100) DEFAULT 'website', -- website, pdf, etc.
    active BOOLEAN DEFAULT true,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Message Templates
CREATE TABLE IF NOT EXISTS instagram_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Campaigns / Automations
CREATE TABLE IF NOT EXISTS instagram_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    instagram_account_id UUID REFERENCES instagram_connected_accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    reel_id VARCHAR(255),
    reel_url TEXT,
    reel_thumbnail TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- active, paused, draft
    follow_gate BOOLEAN DEFAULT false,
    delay_seconds INT DEFAULT 0,
    max_dms_per_day INT DEFAULT 100,
    max_comments_per_day INT DEFAULT 500,
    activepieces_workflow_id VARCHAR(255),
    template_id UUID REFERENCES instagram_templates(id) ON DELETE SET NULL,
    link_id UUID REFERENCES instagram_links(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Campaign Keywords
CREATE TABLE IF NOT EXISTS instagram_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES instagram_campaigns(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Campaign Logs
CREATE TABLE IF NOT EXISTS instagram_campaign_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES instagram_campaigns(id) ON DELETE CASCADE,
    comment_id VARCHAR(255),
    username VARCHAR(255),
    status VARCHAR(50), -- success, failed, follow_requested
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Analytics (can also be a materialized view, but we'll use a table updated via triggers/RPCs or app logic)
CREATE TABLE IF NOT EXISTS instagram_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES instagram_campaigns(id) ON DELETE CASCADE UNIQUE,
    comments_detected INT DEFAULT 0,
    dms_sent INT DEFAULT 0,
    follow_conversions INT DEFAULT 0,
    link_clicks INT DEFAULT 0,
    last_triggered TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE instagram_connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_campaign_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their connected accounts" ON instagram_connected_accounts;
CREATE POLICY "Users can manage their connected accounts" ON instagram_connected_accounts FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their links" ON instagram_links;
CREATE POLICY "Users can manage their links" ON instagram_links FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their templates" ON instagram_templates;
CREATE POLICY "Users can manage their templates" ON instagram_templates FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their campaigns" ON instagram_campaigns;
CREATE POLICY "Users can manage their campaigns" ON instagram_campaigns FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage keywords for their campaigns" ON instagram_keywords;
CREATE POLICY "Users can manage keywords for their campaigns" ON instagram_keywords FOR ALL USING (
    EXISTS (SELECT 1 FROM instagram_campaigns WHERE id = instagram_keywords.campaign_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can read their campaign logs" ON instagram_campaign_logs;
CREATE POLICY "Users can read their campaign logs" ON instagram_campaign_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their campaign analytics" ON instagram_analytics;
CREATE POLICY "Users can read their campaign analytics" ON instagram_analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM instagram_campaigns WHERE id = instagram_analytics.campaign_id AND user_id = auth.uid())
);
