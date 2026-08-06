-- Supabase Schema V5: Activepieces Integration and AI Calling Foundation

-- 1. Activepieces Core Tables
CREATE TABLE activepieces_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service VARCHAR(255) NOT NULL, -- e.g., 'instagram', 'whatsapp', 'shopify', 'gmail', 'activepieces_core'
    connection_id VARCHAR(255), -- ID mapping to Activepieces internal connection
    metadata JSONB DEFAULT '{}', -- Store token hints, page names, email addresses
    status VARCHAR(50) DEFAULT 'connected', -- 'connected', 'disconnected', 'error'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE activepieces_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activepieces_workflow_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'inactive', -- 'active', 'inactive', 'draft'
    triggers JSONB DEFAULT '[]', -- Array of triggers for UI parsing
    actions JSONB DEFAULT '[]', -- Array of actions for UI parsing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE activepieces_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES activepieces_workflows(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- 'success', 'failed', 'running'
    execution_time INT DEFAULT 0, -- Time in ms
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workflow_id VARCHAR(255),
    integration VARCHAR(100),
    status VARCHAR(50),
    payload JSONB DEFAULT '{}',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE usage_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type VARCHAR(100) NOT NULL, -- 'activepieces_task', 'ai_token', 'ai_call_minute'
    amount NUMERIC NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Future AI Calling Tables
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    phone_number VARCHAR(50),
    email VARCHAR(255),
    custom_attributes JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE call_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    objective TEXT,
    prompt_id UUID, -- Reference to an AI prompt version
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'completed', 'paused'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE call_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES call_campaigns(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'queued', -- 'queued', 'in_progress', 'completed', 'failed'
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    campaign_id UUID REFERENCES call_campaigns(id),
    direction VARCHAR(20) DEFAULT 'outbound', -- 'inbound', 'outbound'
    duration_seconds INT DEFAULT 0,
    status VARCHAR(50), -- 'completed', 'missed', 'failed'
    recording_url TEXT,
    cost NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE call_transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_log_id UUID REFERENCES call_logs(id) ON DELETE CASCADE,
    speaker VARCHAR(50) NOT NULL, -- 'ai', 'human'
    text TEXT NOT NULL,
    timestamp_offset INT, -- ms offset from start of call
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE lead_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- 'new', 'interested', 'not_interested', 'converted'
    confidence_score NUMERIC(5,2), -- AI determined confidence
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

-- Create policies for user isolation
CREATE POLICY "Users can manage their own connections" ON activepieces_connections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own workflows" ON activepieces_workflows FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read their own runs" ON activepieces_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read their own automation logs" ON automation_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read their own usage costs" ON usage_costs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own contacts" ON contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own campaigns" ON call_campaigns FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own call queue" ON call_queue FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read their own call logs" ON call_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read their own transcripts" ON call_transcripts FOR SELECT USING (EXISTS (SELECT 1 FROM call_logs WHERE call_logs.id = call_transcripts.call_log_id AND call_logs.user_id = auth.uid()));
CREATE POLICY "Users can manage their own lead status" ON lead_status FOR ALL USING (auth.uid() = user_id);
