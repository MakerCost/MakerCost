-- Subscription management tables for MakerCost

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'pro')),
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
    features JSONB NOT NULL DEFAULT '[]',
    paypal_plan_id TEXT,
    stripe_price_id TEXT, -- For future Stripe integration
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id),
    tier TEXT NOT NULL CHECK (tier IN ('free', 'pro')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing', 'unpaid', 'incomplete')),
    provider TEXT NOT NULL CHECK (provider IN ('paypal', 'stripe')),
    provider_subscription_id TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    trial_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one active subscription per user
    UNIQUE(user_id, status) WHERE status = 'active'
);

-- Create payment_events table for analytics
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    plan_id TEXT REFERENCES public.subscription_plans(id),
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    provider TEXT NOT NULL CHECK (provider IN ('paypal', 'stripe')),
    provider_event_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create webhook_events table for reliability
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL CHECK (provider IN ('paypal', 'stripe')),
    event_type TEXT NOT NULL,
    provider_event_id TEXT NOT NULL,
    data JSONB NOT NULL,
    processed BOOLEAN NOT NULL DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Prevent duplicate webhook processing
    UNIQUE(provider, provider_event_id)
);

-- Create user_tier_usage table to track feature usage
CREATE TABLE IF NOT EXISTS public.user_tier_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'pro')),
    project_count INTEGER NOT NULL DEFAULT 0,
    material_count INTEGER NOT NULL DEFAULT 0,
    last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    UNIQUE(user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_provider_subscription_id ON public.user_subscriptions(provider_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_user_id ON public.payment_events(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON public.payment_events(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider_event_id ON public.webhook_events(provider, provider_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_user_tier_usage_user_id ON public.user_tier_usage(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_tier_usage_updated_at BEFORE UPDATE ON public.user_tier_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default subscription plans
INSERT INTO public.subscription_plans (id, name, tier, price, currency, interval, features) VALUES
    ('free-plan', 'Free', 'free', 0.00, 'USD', 'month', '["Up to 5 projects", "Basic P&L calculator", "Material cost tracking", "Email support"]'),
    ('pro-monthly', 'Pro Monthly', 'pro', 19.99, 'USD', 'month', '["Unlimited projects", "Material photo uploads", "Advanced reporting & analytics", "Cloud sync across devices", "Export to PDF/Excel", "Priority support", "What-if analysis tools"]'),
    ('pro-yearly', 'Pro Yearly', 'pro', 199.99, 'USD', 'year', '["Unlimited projects", "Material photo uploads", "Advanced reporting & analytics", "Cloud sync across devices", "Export to PDF/Excel", "Priority support", "What-if analysis tools", "Save 17% vs monthly"]')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    tier = EXCLUDED.tier,
    price = EXCLUDED.price,
    currency = EXCLUDED.currency,
    interval = EXCLUDED.interval,
    features = EXCLUDED.features,
    updated_at = timezone('utc'::text, now());

-- Row Level Security (RLS) policies

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tier_usage ENABLE ROW LEVEL SECURITY;

-- Subscription plans: readable by everyone, writable by service role only
CREATE POLICY "Subscription plans are readable by everyone" ON public.subscription_plans
    FOR SELECT USING (true);

CREATE POLICY "Subscription plans are writable by service role only" ON public.subscription_plans
    FOR ALL USING (auth.role() = 'service_role');

-- User subscriptions: users can only see their own
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions" ON public.user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Payment events: users can only see their own
CREATE POLICY "Users can view their own payment events" ON public.payment_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payment events" ON public.payment_events
    FOR ALL USING (auth.role() = 'service_role');

-- Webhook events: service role only
CREATE POLICY "Service role can manage all webhook events" ON public.webhook_events
    FOR ALL USING (auth.role() = 'service_role');

-- User tier usage: users can view their own
CREATE POLICY "Users can view their own tier usage" ON public.user_tier_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tier usage" ON public.user_tier_usage
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all tier usage" ON public.user_tier_usage
    FOR ALL USING (auth.role() = 'service_role');

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE (
    subscription_id UUID,
    plan_id TEXT,
    tier TEXT,
    status TEXT,
    provider TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        id,
        plan_id,
        tier,
        status,
        provider,
        current_period_end,
        cancel_at_period_end
    FROM user_subscriptions 
    WHERE user_id = user_uuid 
    AND status IN ('active', 'trialing', 'past_due')
    ORDER BY created_at DESC 
    LIMIT 1;
$$;

-- Function to check if user has feature access
CREATE OR REPLACE FUNCTION has_feature_access(feature_name TEXT, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        CASE 
            WHEN feature_name = 'unlimited_projects' THEN tier = 'pro'
            WHEN feature_name = 'material_images' THEN tier = 'pro'
            WHEN feature_name = 'export_pdf' THEN tier = 'pro'
            WHEN feature_name = 'export_excel' THEN tier = 'pro'
            WHEN feature_name = 'advanced_reports' THEN tier = 'pro'
            WHEN feature_name = 'what_if_analysis' THEN tier = 'pro'
            WHEN feature_name = 'cloud_sync' THEN tier = 'pro'
            WHEN feature_name = 'priority_support' THEN tier = 'pro'
            ELSE true -- Default to true for unknown features
        END
    FROM get_user_subscription(user_uuid)
    UNION ALL
    SELECT false WHERE NOT EXISTS (SELECT 1 FROM get_user_subscription(user_uuid))
    LIMIT 1;
$$;