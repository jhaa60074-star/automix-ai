-- Supabase Schema V5: Activepieces Integration and AI Calling Foundation

-- 1. Activepieces Core Tables
CREATE TABLE IF NOT EXISTS activepieces_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service VARCHAR(255) NOT NULL,
    connection_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'connected',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activepieces_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activepieces_workflow_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive',
    triggers JSONB DEFAULT '[]',
    actions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activepieces_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES activepieces_workflows(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    execution_time INT DEFAULT 0,
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workflow_id VARCHAR(255),
    integration VARCHAR(100),
    status VARCHAR(50),
    payload JSONB DEFAULT '{}',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type VARCHAR(100) NOT NULL,
    amount NUMERIC NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Future AI Calling Tables
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    phone_number VARCHAR(50),
    email VARCHAR(255),
    custom_attributes JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    objective TEXT,
    prompt_id UUID,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES call_campaigns(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'queued',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    campaign_id UUID REFERENCES call_campaigns(id),
    direction VARCHAR(20) DEFAULT 'outbound',
    duration_seconds INT DEFAULT 0,
    status VARCHAR(50),
    recording_url TEXT,
    cost NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_log_id UUID REFERENCES call_logs(id) ON DELETE CASCADE,
    speaker VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    timestamp_offset INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    confidence_score NUMERIC(5,2),
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE activepieces_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE activepieces_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activepieces_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_status ENABLE ROW LEVEL SECURITY;

-- Idempotent policy creation (drop if exists, then create)
DROP POLICY IF EXISTS "Users can manage their own connections" ON activepieces_connections;
CREATE POLICY "Users can manage their own connections" ON activepieces_connections FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own workflows" ON activepieces_workflows;
CREATE POLICY "Users can manage their own workflows" ON activepieces_workflows FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own runs" ON activepieces_runs;
CREATE POLICY "Users can read their own runs" ON activepieces_runs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own automation logs" ON automation_logs;
CREATE POLICY "Users can read their own automation logs" ON automation_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own usage costs" ON usage_costs;
CREATE POLICY "Users can read their own usage costs" ON usage_costs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own contacts" ON contacts;
CREATE POLICY "Users can manage their own contacts" ON contacts FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own campaigns" ON call_campaigns;
CREATE POLICY "Users can manage their own campaigns" ON call_campaigns FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own call queue" ON call_queue;
CREATE POLICY "Users can manage their own call queue" ON call_queue FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own call logs" ON call_logs;
CREATE POLICY "Users can read their own call logs" ON call_logs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own transcripts" ON call_transcripts;
CREATE POLICY "Users can read their own transcripts" ON call_transcripts FOR SELECT USING (EXISTS (SELECT 1 FROM call_logs WHERE call_logs.id = call_transcripts.call_log_id AND call_logs.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage their own lead status" ON lead_status;
CREATE POLICY "Users can manage their own lead status" ON lead_status FOR ALL USING (auth.uid() = user_id);
