-- ============================================================================
-- LAVANDERÍA ORIENTAL - ENHANCED DATABASE SCHEMA
-- Run this in Supabase SQL Editor AFTER the base schema
-- Adds missing tables for complete spec implementation
-- ============================================================================

-- ============================================================================
-- ENHANCED USERS TABLE (Add role, branch assignment)
-- ============================================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'staff';
ALTER TABLE users ADD COLUMN IF NOT EXISTS branch_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================================================
-- ENHANCED LOCATIONS/BRANCHES
-- ============================================================================
ALTER TABLE locations ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS manager_id UUID;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS today_orders INTEGER DEFAULT 0;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS today_revenue DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS delivery_radius INTEGER DEFAULT 5;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS services_available TEXT[] DEFAULT '{}';

-- ============================================================================
-- SERVICE VARIATIONS (Size/Type Pricing)
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    name_es VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_variations_service ON service_variations(service_id);

-- ============================================================================
-- SERVICE FAQS (AI Knowledge per Service)
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    question_es TEXT NOT NULL,
    question_en TEXT,
    answer_es TEXT NOT NULL,
    answer_en TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_faqs_service ON service_faqs(service_id);

-- ============================================================================
-- CUSTOMER NOTES
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer ON customer_notes(customer_id);

-- ============================================================================
-- ENHANCED CONVERSATIONS
-- ============================================================================
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS sentiment VARCHAR(20);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS takeover_at TIMESTAMPTZ;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS transferred_at TIMESTAMPTZ;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS transfer_reason TEXT;

-- ============================================================================
-- ENHANCED MESSAGES
-- ============================================================================
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender VARCHAR(20); -- 'customer', 'ai', 'human'
ALTER TABLE messages ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'sent';
ALTER TABLE messages ADD COLUMN IF NOT EXISTS intent VARCHAR(100);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS confidence DECIMAL(5, 4);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS handled_by UUID;

-- ============================================================================
-- ORDER ITEMS (Line Items)
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    service_name VARCHAR(100),
    variation_id UUID,
    variation_name VARCHAR(100),
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20),
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ============================================================================
-- ORDER EVENTS (Timeline)
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    note TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_events_order ON order_events(order_id);

-- ============================================================================
-- ORDER NOTES
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_notes_order ON order_notes(order_id);

-- ============================================================================
-- ENHANCED ORDERS
-- ============================================================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS branch_name VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'whatsapp_ai';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS conversation_id UUID;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- ============================================================================
-- ACTIVITIES (Activity Feed)
-- ============================================================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200),
    description TEXT,
    metadata JSONB DEFAULT '{}',

    -- References
    conversation_id UUID,
    customer_id UUID,
    order_id UUID,
    branch_id UUID,

    -- Status
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

-- ============================================================================
-- AI CONFIG
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID,

    -- Settings
    model VARCHAR(50) DEFAULT 'claude-sonnet-4',
    language VARCHAR(10) DEFAULT 'es',
    auto_detect_language BOOLEAN DEFAULT true,
    tone VARCHAR(50) DEFAULT 'friendly_professional',

    -- Status
    enabled BOOLEAN DEFAULT true,
    paused BOOLEAN DEFAULT false,

    -- Escalation rules
    escalate_on_keywords TEXT[] DEFAULT ARRAY['damaged', 'refund', 'complaint', 'angry', 'gerente', 'queja', 'reclamo', 'daño'],
    escalate_confidence_threshold DECIMAL(3, 2) DEFAULT 0.60,
    escalate_on_negative_sentiment BOOLEAN DEFAULT true,
    escalate_after_messages INTEGER DEFAULT 3,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- WHATSAPP TEMPLATES
-- ============================================================================
CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    content_es TEXT NOT NULL,
    content_en TEXT,
    variables TEXT[] DEFAULT '{}',
    last_used_at TIMESTAMPTZ,
    use_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    order_id UUID REFERENCES orders(id),
    branch_id UUID,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_customer ON reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_branch ON reviews(branch_id);

-- ============================================================================
-- ENHANCED ESCALATIONS
-- ============================================================================
ALTER TABLE escalations ADD COLUMN IF NOT EXISTS wait_time_minutes INTEGER DEFAULT 0;

-- ============================================================================
-- ENHANCED NOTIFICATIONS
-- ============================================================================
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link TEXT;

-- ============================================================================
-- ENHANCED DAILY REPORTS
-- ============================================================================
ALTER TABLE daily_reports ADD COLUMN IF NOT EXISTS returning_customers INTEGER DEFAULT 0;
ALTER TABLE daily_reports ADD COLUMN IF NOT EXISTS top_intents JSONB DEFAULT '[]';
ALTER TABLE daily_reports ADD COLUMN IF NOT EXISTS hourly_breakdown JSONB DEFAULT '[]';

-- ============================================================================
-- ENABLE REALTIME ON KEY TABLES
-- ============================================================================
DO $$
BEGIN
    -- Check if publication exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;

    -- Add tables to realtime (ignore errors if already added)
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE escalations;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE orders;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE activities;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- ============================================================================
-- TRIGGER: Update message count on conversation
-- ============================================================================
CREATE OR REPLACE FUNCTION update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET message_count = message_count + 1,
        updated_at = NEW.created_at
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_message_count ON messages;
CREATE TRIGGER trigger_update_message_count
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_message_count();

-- ============================================================================
-- TRIGGER: Update customer metrics on order complete
-- ============================================================================
CREATE OR REPLACE FUNCTION update_customer_metrics_on_order()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        UPDATE customers
        SET
            total_orders = total_orders + 1,
            total_spent = total_spent + COALESCE(NEW.total_amount, 0),
            last_order_at = COALESCE(NEW.completed_at, NOW()),
            updated_at = NOW()
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_customer_on_order ON orders;
CREATE TRIGGER trigger_update_customer_on_order
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_metrics_on_order();

-- ============================================================================
-- FUNCTION: Generate order number
-- ============================================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        SELECT COALESCE(MAX(CAST(REPLACE(order_number, '#', '') AS INTEGER)), 1000) + 1
        INTO next_num
        FROM orders
        WHERE order_number LIKE '#%';

        NEW.order_number = '#' || next_num;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_order_number();

-- ============================================================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================================================

ALTER TABLE service_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Service role policies
CREATE POLICY "service_all_service_variations" ON service_variations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_service_faqs" ON service_faqs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_customer_notes" ON customer_notes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_order_items" ON order_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_order_events" ON order_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_order_notes" ON order_notes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_activities" ON activities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_ai_config" ON ai_config FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_whatsapp_templates" ON whatsapp_templates FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_all_reviews" ON reviews FOR ALL USING (auth.role() = 'service_role');

-- Public read for variations
CREATE POLICY "public_read_service_variations" ON service_variations FOR SELECT USING (true);

-- ============================================================================
-- ENHANCED SCHEMA COMPLETE
-- ============================================================================
