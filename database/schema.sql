-- ============================================================================
-- LAVANDERÍA ORIENTAL - COMPLETE DATABASE SCHEMA
-- PostgreSQL / Supabase Compatible
-- Generated from Drizzle ORM Schema
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS (Admin Dashboard Authentication)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. LOCATIONS (Laundry Branches)
-- ============================================================================
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50),
    address TEXT,
    city VARCHAR(50),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    is_headquarters BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    delivery_available BOOLEAN DEFAULT FALSE,
    delivery_zone TEXT,
    hours JSONB,
    hours_monday VARCHAR(20),
    hours_tuesday VARCHAR(20),
    hours_wednesday VARCHAR(20),
    hours_thursday VARCHAR(20),
    hours_friday VARCHAR(20),
    hours_saturday VARCHAR(20),
    hours_sunday VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(2, 1) DEFAULT 4.5,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_status ON locations(status);
CREATE INDEX idx_locations_is_active ON locations(is_active);

-- ============================================================================
-- 3. SERVICE CATEGORIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50),
    description TEXT,
    icon VARCHAR(10),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. SERVICES (Pricing Catalog)
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES service_categories(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100),
    name_en VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    price_lavado DECIMAL(10, 2) DEFAULT 0,
    price_lavado_secado DECIMAL(10, 2) DEFAULT 0,
    price_lavado_planchado DECIMAL(10, 2) DEFAULT 0,
    price_secado DECIMAL(10, 2) DEFAULT 0,
    price_planchado DECIMAL(10, 2) DEFAULT 0,
    price_otros DECIMAL(10, 2) DEFAULT 0,
    unit VARCHAR(30),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_is_active ON services(is_active);

-- ============================================================================
-- 5. CUSTOMERS (WhatsApp Contacts)
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100),
    email VARCHAR(255),
    preferred_location_id UUID REFERENCES locations(id),
    language VARCHAR(10) DEFAULT 'es',
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    last_order_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    last_contact TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_is_vip ON customers(is_vip);
CREATE INDEX idx_customers_last_contact ON customers(last_contact);

-- ============================================================================
-- 6. CONVERSATIONS (Chat Sessions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    location_id UUID REFERENCES locations(id),
    status VARCHAR(20) DEFAULT 'active',
    channel VARCHAR(20) DEFAULT 'whatsapp',
    assigned_agent VARCHAR(100),
    escalation_reason TEXT,
    resolution_notes TEXT,
    message_count INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    escalated_to VARCHAR(100),
    summary TEXT,
    ai_handled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_customer ON conversations(customer_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_location ON conversations(location_id);
CREATE INDEX idx_conversations_started_at ON conversations(started_at);

-- ============================================================================
-- 7. MESSAGES (Individual Chat Messages)
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    direction VARCHAR(10) NOT NULL, -- 'inbound' or 'outbound'
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    wa_message_id VARCHAR(100),
    ai_generated BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_direction ON messages(direction);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================================================
-- 8. ORDERS (Customer Orders)
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20),
    customer_id UUID NOT NULL REFERENCES customers(id),
    location_id UUID REFERENCES locations(id),
    status VARCHAR(30) DEFAULT 'pending',
    items_description TEXT,
    items_json JSONB,
    subtotal DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2),
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'pending',
    is_delivery BOOLEAN DEFAULT FALSE,
    delivery_address TEXT,
    pickup_scheduled_at TIMESTAMP WITH TIME ZONE,
    estimated_ready TIMESTAMP WITH TIME ZONE,
    actual_ready TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_location ON orders(location_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- ============================================================================
-- 9. KNOWLEDGE BASE (FAQ for AI)
-- ============================================================================
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[],
    category VARCHAR(50),
    language VARCHAR(10) DEFAULT 'es',
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX idx_knowledge_base_language ON knowledge_base(language);
CREATE INDEX idx_knowledge_base_is_active ON knowledge_base(is_active);

-- ============================================================================
-- 10. NOTIFICATIONS (Scheduled Messages)
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id),
    order_id UUID REFERENCES orders(id),
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200),
    message TEXT,
    channel VARCHAR(20) DEFAULT 'whatsapp',
    status VARCHAR(20) DEFAULT 'pending',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_customer ON notifications(customer_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);

-- ============================================================================
-- 11. ESCALATIONS (Human Handoff Tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS escalations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    customer_id UUID REFERENCES customers(id),
    priority VARCHAR(10) DEFAULT 'medium',
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    assigned_to VARCHAR(100),
    resolution TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_escalations_conversation ON escalations(conversation_id);
CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_escalations_priority ON escalations(priority);

-- ============================================================================
-- 12. DAILY REPORTS (Analytics Aggregation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES locations(id),
    report_date DATE NOT NULL,
    total_conversations INTEGER DEFAULT 0,
    ai_resolved INTEGER DEFAULT 0,
    human_resolved INTEGER DEFAULT 0,
    escalations INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0,
    avg_response_time_seconds INTEGER,
    customer_satisfaction DECIMAL(3, 2),
    ai_resolution_rate DECIMAL(5, 2),
    summary TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_daily_reports_location ON daily_reports(location_id);
CREATE INDEX idx_daily_reports_date ON daily_reports(report_date);

-- ============================================================================
-- 13. SYSTEM CONFIG (Key-Value Settings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_system_config_key ON system_config(key);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escalations_updated_at BEFORE UPDATE ON escalations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (Supabase)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Service role can access everything
CREATE POLICY "Service role has full access to users" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to locations" ON locations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to service_categories" ON service_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to services" ON services FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to customers" ON customers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to conversations" ON conversations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to messages" ON messages FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to orders" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to knowledge_base" ON knowledge_base FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to notifications" ON notifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to escalations" ON escalations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to daily_reports" ON daily_reports FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role has full access to system_config" ON system_config FOR ALL USING (auth.role() = 'service_role');

-- Public read access for locations, services, knowledge_base
CREATE POLICY "Public can read active locations" ON locations FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active knowledge_base" ON knowledge_base FOR SELECT USING (is_active = true);

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
