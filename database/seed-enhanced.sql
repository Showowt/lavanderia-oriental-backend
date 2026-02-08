-- ============================================================================
-- LAVANDERÍA ORIENTAL - ENHANCED SEED DATA
-- Run this AFTER the base seed.sql and schema-enhanced.sql
-- Adds realistic demo data for testing the complete dashboard
-- ============================================================================

-- ============================================================================
-- SERVICE VARIATIONS (Pricing by Size)
-- ============================================================================

-- Get edredón service IDs and add variations
DO $$
DECLARE
    v_edredon_pequeno UUID;
    v_edredon_mediano UUID;
    v_edredon_grande UUID;
BEGIN
    SELECT id INTO v_edredon_pequeno FROM services WHERE slug = 'edredon-pequeno';
    SELECT id INTO v_edredon_mediano FROM services WHERE slug = 'edredon-mediano';
    SELECT id INTO v_edredon_grande FROM services WHERE slug = 'edredon-grande';

    -- Already priced by size in base services, but add variations for DRIP
END $$;

-- DRIP Variations by Material
INSERT INTO service_variations (service_id, name_es, name_en, price, sort_order)
SELECT s.id, 'Tela Normal', 'Normal Fabric', 9.90, 1 FROM services s WHERE s.slug = 'drip-basico'
UNION ALL
SELECT s.id, 'Cuero Sintético', 'Synthetic Leather', 14.90, 2 FROM services s WHERE s.slug = 'drip-basico'
UNION ALL
SELECT s.id, 'Ante/Gamuza', 'Suede', 16.90, 3 FROM services s WHERE s.slug = 'drip-basico';

-- ============================================================================
-- ADMIN USER
-- ============================================================================
INSERT INTO users (username, password, email, name, role, is_active)
VALUES ('admin', '$2b$10$placeholder', 'admin@lavanderia.sv', 'Administrador', 'admin', true)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, password, email, name, role, is_active)
VALUES ('fabricio', '$2b$10$placeholder', 'fabricio@lavanderia.sv', 'Fabricio Estrada', 'owner', true)
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- SAMPLE CONVERSATIONS
-- ============================================================================
DO $$
DECLARE
    v_customer1 UUID;
    v_customer2 UUID;
    v_customer3 UUID;
    v_customer4 UUID;
    v_customer5 UUID;
    v_location1 UUID;
    v_conv1 UUID;
    v_conv2 UUID;
    v_conv3 UUID;
    v_conv4 UUID;
    v_conv5 UUID;
BEGIN
    -- Get customer IDs
    SELECT id INTO v_customer1 FROM customers WHERE phone = '+503 7890-1234';
    SELECT id INTO v_customer2 FROM customers WHERE phone = '+503 7890-5678';
    SELECT id INTO v_customer3 FROM customers WHERE phone = '+503 7890-9012';
    SELECT id INTO v_customer4 FROM customers WHERE phone = '+503 7890-3456';
    SELECT id INTO v_customer5 FROM customers WHERE phone = '+503 7890-7890';

    -- Get location ID
    SELECT id INTO v_location1 FROM locations WHERE slug = 'san-miguel-casa-matriz';

    -- Create conversations
    INSERT INTO conversations (id, customer_id, location_id, status, ai_handled, message_count, started_at)
    VALUES
        (gen_random_uuid(), v_customer1, v_location1, 'active', true, 6, NOW() - INTERVAL '10 minutes')
    RETURNING id INTO v_conv1;

    INSERT INTO conversations (id, customer_id, location_id, status, ai_handled, message_count, started_at, resolved_at)
    VALUES
        (gen_random_uuid(), v_customer2, v_location1, 'resolved', true, 4, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour')
    RETURNING id INTO v_conv2;

    INSERT INTO conversations (id, customer_id, location_id, status, ai_handled, message_count, escalation_reason, started_at)
    VALUES
        (gen_random_uuid(), v_customer4, v_location1, 'escalated', false, 8, 'Reclamo por ropa dañada', NOW() - INTERVAL '30 minutes')
    RETURNING id INTO v_conv3;

    INSERT INTO conversations (id, customer_id, location_id, status, ai_handled, message_count, started_at, resolved_at)
    VALUES
        (gen_random_uuid(), v_customer3, v_location1, 'resolved', true, 3, NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours')
    RETURNING id INTO v_conv4;

    INSERT INTO conversations (id, customer_id, location_id, status, ai_handled, message_count, started_at)
    VALUES
        (gen_random_uuid(), v_customer5, v_location1, 'active', true, 4, NOW() - INTERVAL '5 minutes')
    RETURNING id INTO v_conv5;

    -- Create messages for conversation 1 (active)
    INSERT INTO messages (conversation_id, direction, content, sender, intent, confidence, created_at) VALUES
    (v_conv1, 'inbound', 'Hola, cuánto cuesta lavar una carga normal?', 'customer', 'pricing_inquiry', 0.98, NOW() - INTERVAL '10 minutes'),
    (v_conv1, 'outbound', '¡Hola! El precio de una carga normal es $3 solo lavado o $5.50 lavado + secado. ¿En qué sucursal te queda más cerca?', 'ai', 'pricing_response', 0.95, NOW() - INTERVAL '9 minutes'),
    (v_conv1, 'inbound', 'San Miguel', 'customer', 'location_selection', 0.92, NOW() - INTERVAL '8 minutes'),
    (v_conv1, 'outbound', '¡Perfecto! En San Miguel tenemos dos sucursales: Casa Matriz en Col. Ciudad Real y Col. Gavidia. Ambas abren de 7am-6pm. ¿Te gustaría delivery? Cuesta $2 total.', 'ai', 'location_info', 0.94, NOW() - INTERVAL '7 minutes'),
    (v_conv1, 'inbound', 'Sí, cuánto sería todo con delivery?', 'customer', 'delivery_inquiry', 0.96, NOW() - INTERVAL '6 minutes'),
    (v_conv1, 'outbound', 'Con una carga normal (lavado+secado) más delivery serían $7.50 en total. ¿Te agendamos la recogida?', 'ai', 'pricing_response', 0.95, NOW() - INTERVAL '5 minutes');

    -- Create messages for conversation 3 (escalated)
    INSERT INTO messages (conversation_id, direction, content, sender, created_at) VALUES
    (v_conv3, 'inbound', 'Hola, tengo un problema con mi pedido', 'customer', NOW() - INTERVAL '30 minutes'),
    (v_conv3, 'outbound', '¡Hola! Lamento escuchar eso. ¿Qué sucedió con tu pedido?', 'ai', NOW() - INTERVAL '29 minutes'),
    (v_conv3, 'inbound', 'Mi camisa salió manchada y la traía perfecta', 'customer', NOW() - INTERVAL '28 minutes'),
    (v_conv3, 'outbound', 'Lo siento mucho por esta situación. Déjame transferirte con un agente para resolver esto de la mejor manera.', 'ai', NOW() - INTERVAL '27 minutes'),
    (v_conv3, 'inbound', 'Necesito hablar con el gerente', 'customer', NOW() - INTERVAL '26 minutes'),
    (v_conv3, 'outbound', 'Entiendo tu preocupación. Un agente se comunicará contigo en breve para atender tu caso personalmente.', 'ai', NOW() - INTERVAL '25 minutes');

    -- Create escalation for conversation 3
    INSERT INTO escalations (conversation_id, customer_id, priority, reason, status, wait_time_minutes, created_at)
    VALUES (v_conv3, v_customer4, 'high', 'Reclamo por ropa dañada', 'pending', 25, NOW() - INTERVAL '25 minutes');

END $$;

-- ============================================================================
-- SAMPLE ORDERS
-- ============================================================================
DO $$
DECLARE
    v_customer1 UUID;
    v_customer2 UUID;
    v_customer3 UUID;
    v_customer5 UUID;
    v_location1 UUID;
    v_location2 UUID;
    v_order1 UUID;
    v_order2 UUID;
    v_order3 UUID;
    v_order4 UUID;
BEGIN
    -- Get IDs
    SELECT id INTO v_customer1 FROM customers WHERE phone = '+503 7890-1234';
    SELECT id INTO v_customer2 FROM customers WHERE phone = '+503 7890-5678';
    SELECT id INTO v_customer3 FROM customers WHERE phone = '+503 7890-9012';
    SELECT id INTO v_customer5 FROM customers WHERE phone = '+503 7890-7890';
    SELECT id INTO v_location1 FROM locations WHERE slug = 'san-miguel-casa-matriz';
    SELECT id INTO v_location2 FROM locations WHERE slug = 'santa-ana';

    -- Order 1: Ready for pickup
    INSERT INTO orders (id, order_number, customer_id, customer_name, customer_phone, location_id, branch_name, status, subtotal, delivery_fee, total_amount, is_delivery, source, created_at)
    VALUES (gen_random_uuid(), '#1256', v_customer1, 'María García', '+503 7890-1234', v_location1, 'San Miguel Casa Matriz', 'ready', 16.25, 0, 16.25, false, 'whatsapp_ai', NOW() - INTERVAL '3 hours')
    RETURNING id INTO v_order1;

    -- Order 2: Washing
    INSERT INTO orders (id, order_number, customer_id, customer_name, customer_phone, location_id, branch_name, status, subtotal, delivery_fee, total_amount, is_delivery, source, created_at)
    VALUES (gen_random_uuid(), '#1255', v_customer2, 'Carlos Hernández', '+503 7890-5678', v_location2, 'Santa Ana', 'washing', 10.00, 0, 10.00, false, 'walk_in', NOW() - INTERVAL '2 hours')
    RETURNING id INTO v_order2;

    -- Order 3: Completed with delivery
    INSERT INTO orders (id, order_number, customer_id, customer_name, customer_phone, location_id, branch_name, status, subtotal, delivery_fee, total_amount, is_delivery, delivery_address, source, created_at, completed_at)
    VALUES (gen_random_uuid(), '#1254', v_customer3, 'Ana Martínez', '+503 7890-9012', v_location1, 'San Miguel Casa Matriz', 'completed', 12.75, 2.00, 14.75, true, 'Col. Medina, calle principal #123, San Miguel', 'whatsapp_ai', NOW() - INTERVAL '1 day', NOW() - INTERVAL '20 hours')
    RETURNING id INTO v_order3;

    -- Order 4: Pending
    INSERT INTO orders (id, order_number, customer_id, customer_name, customer_phone, location_id, branch_name, status, subtotal, delivery_fee, total_amount, is_delivery, source, created_at)
    VALUES (gen_random_uuid(), '#1257', v_customer5, 'Rosa Pérez', '+503 7890-7890', v_location1, 'San Miguel Casa Matriz', 'pending', 8.50, 2.00, 10.50, true, 'whatsapp_ai', NOW() - INTERVAL '30 minutes')
    RETURNING id INTO v_order4;

    -- Order items for Order 1
    INSERT INTO order_items (order_id, service_name, quantity, unit, unit_price, subtotal)
    VALUES
    (v_order1, 'Carga Normal - Lavado + Secado', 2, 'carga', 5.50, 11.00),
    (v_order1, 'DRIP Básico', 1, 'par', 5.25, 5.25);

    -- Order items for Order 2
    INSERT INTO order_items (order_id, service_name, quantity, unit, unit_price, subtotal)
    VALUES
    (v_order2, 'Edredón 2.00m', 1, 'pieza', 8.50, 8.50),
    (v_order2, 'Suavizante', 3, 'porción', 0.35, 1.05),
    (v_order2, 'Downy Perlas Aromáticas', 1, 'porción', 0.45, 0.45);

    -- Order events (timeline) for Order 1
    INSERT INTO order_events (order_id, status, note, created_at)
    VALUES
    (v_order1, 'pending', 'Pedido creado vía WhatsApp', NOW() - INTERVAL '3 hours'),
    (v_order1, 'received', 'Ropa recibida en sucursal', NOW() - INTERVAL '2 hours' - INTERVAL '30 minutes'),
    (v_order1, 'washing', 'Lavado iniciado', NOW() - INTERVAL '2 hours'),
    (v_order1, 'drying', 'Secado en proceso', NOW() - INTERVAL '1 hour' - INTERVAL '30 minutes'),
    (v_order1, 'processing', 'Doblando y preparando', NOW() - INTERVAL '1 hour'),
    (v_order1, 'ready', 'Listo para recoger', NOW() - INTERVAL '45 minutes');

    -- Order notes
    INSERT INTO order_notes (order_id, content, created_at)
    VALUES
    (v_order1, 'Cliente solicitó suavizante extra', NOW() - INTERVAL '2 hours');

END $$;

-- ============================================================================
-- ACTIVITIES (Activity Feed)
-- ============================================================================
INSERT INTO activities (type, title, description, metadata, created_at) VALUES
('conversation_resolved', 'Conversación resuelta', 'María García - Consulta de precios', '{"customer": "María García"}', NOW() - INTERVAL '5 minutes'),
('message', 'Nueva conversación', '+503 7890-1234', '{}', NOW() - INTERVAL '15 minutes'),
('customer_created', 'Nuevo cliente', 'Carlos Hernández registrado', '{"customer": "Carlos Hernández"}', NOW() - INTERVAL '30 minutes'),
('escalation_created', 'Escalación creada', 'José López - Reclamo', '{"priority": "high"}', NOW() - INTERVAL '45 minutes'),
('conversation_resolved', 'Conversación resuelta', 'Ana Martínez - Horarios', '{}', NOW() - INTERVAL '1 hour'),
('order_created', 'Nuevo pedido', 'Pedido #1256 creado', '{"order_number": "#1256"}', NOW() - INTERVAL '3 hours'),
('order_completed', 'Pedido completado', 'Pedido #1254 entregado', '{"order_number": "#1254"}', NOW() - INTERVAL '20 hours'),
('review_received', 'Nueva reseña', '⭐⭐⭐⭐⭐ Excelente servicio!', '{"rating": 5}', NOW() - INTERVAL '2 days');

-- ============================================================================
-- AI CONFIG (Default Settings)
-- ============================================================================
INSERT INTO ai_config (model, language, tone, enabled, escalate_on_keywords)
VALUES (
    'claude-sonnet-4',
    'es',
    'friendly_professional',
    true,
    ARRAY['daño', 'dañado', 'reclamo', 'queja', 'gerente', 'encargado', 'reembolso', 'devolver', 'perdido', 'robado']
);

-- ============================================================================
-- WHATSAPP TEMPLATES
-- ============================================================================
INSERT INTO whatsapp_templates (name, status, content_es, content_en, variables) VALUES
('order_ready', 'approved', '¡Hola {{1}}! Tu pedido {{2}} está listo para recoger en {{3}}. ¡Te esperamos! 🧺', 'Hi {{1}}! Your order {{2}} is ready for pickup at {{3}}. See you soon! 🧺', ARRAY['customer_name', 'order_number', 'branch_name']),
('pickup_reminder', 'approved', '¡Hola {{1}}! Te recordamos que tu pedido {{2}} está listo desde ayer. Pasa a recogerlo en {{3}} hoy. 📦', 'Hi {{1}}! Reminder: your order {{2}} has been ready since yesterday. Pick it up at {{3}} today. 📦', ARRAY['customer_name', 'order_number', 'branch_name']),
('review_request', 'approved', '¡Gracias por elegir Lavandería Oriental! ¿Cómo fue tu experiencia? Tu opinión nos ayuda a mejorar. ⭐', 'Thanks for choosing Lavandería Oriental! How was your experience? Your feedback helps us improve. ⭐', ARRAY[]),
('welcome_message', 'approved', '¡Hola {{1}}! Soy el asistente de Lavandería Oriental. ¿En qué puedo ayudarte hoy?', 'Hi {{1}}! I''m the Lavandería Oriental assistant. How can I help you today?', ARRAY['customer_name']),
('delivery_update', 'pending', '¡Hola {{1}}! Tu pedido {{2}} está en camino. Llegará en aproximadamente {{3}} minutos. 🚗', 'Hi {{1}}! Your order {{2}} is on the way. It will arrive in approximately {{3}} minutes. 🚗', ARRAY['customer_name', 'order_number', 'eta_minutes']);

-- ============================================================================
-- CUSTOMER NOTES
-- ============================================================================
DO $$
DECLARE
    v_customer1 UUID;
    v_customer3 UUID;
BEGIN
    SELECT id INTO v_customer1 FROM customers WHERE phone = '+503 7890-1234';
    SELECT id INTO v_customer3 FROM customers WHERE phone = '+503 7890-9012';

    INSERT INTO customer_notes (customer_id, content, created_at) VALUES
    (v_customer1, 'Prefiere recoger después de las 5pm', NOW() - INTERVAL '30 days'),
    (v_customer1, 'Alérgica a fragancias fuertes, usar suavizante hipoalergénico', NOW() - INTERVAL '60 days'),
    (v_customer3, 'Cliente VIP - Ofrecer 10% descuento en pedidos mayores a $20', NOW() - INTERVAL '15 days');
END $$;

-- ============================================================================
-- REVIEWS
-- ============================================================================
DO $$
DECLARE
    v_customer1 UUID;
    v_customer3 UUID;
    v_location1 UUID;
BEGIN
    SELECT id INTO v_customer1 FROM customers WHERE phone = '+503 7890-1234';
    SELECT id INTO v_customer3 FROM customers WHERE phone = '+503 7890-9012';
    SELECT id INTO v_location1 FROM locations WHERE slug = 'san-miguel-casa-matriz';

    INSERT INTO reviews (customer_id, branch_id, rating, comment, created_at) VALUES
    (v_customer1, v_location1, 5, 'Excelente servicio, muy rápido y la ropa queda impecable!', NOW() - INTERVAL '2 days'),
    (v_customer3, v_location1, 5, 'El mejor servicio de lavandería en San Miguel. 100% recomendado.', NOW() - INTERVAL '5 days'),
    (v_customer1, v_location1, 4, 'Muy buen servicio, el delivery llegó puntual.', NOW() - INTERVAL '15 days');
END $$;

-- ============================================================================
-- DAILY REPORTS (Last 7 days)
-- ============================================================================
DO $$
DECLARE
    v_location1 UUID;
    v_location2 UUID;
    v_date DATE;
BEGIN
    SELECT id INTO v_location1 FROM locations WHERE slug = 'san-miguel-casa-matriz';
    SELECT id INTO v_location2 FROM locations WHERE slug = 'santa-ana';

    FOR i IN 0..6 LOOP
        v_date := CURRENT_DATE - i;

        INSERT INTO daily_reports (
            location_id, report_date,
            total_conversations, ai_resolved, human_resolved, escalations,
            new_customers, total_orders, total_revenue, avg_response_time_seconds,
            customer_satisfaction, ai_resolution_rate
        ) VALUES (
            v_location1, v_date,
            150 + (random() * 50)::int,
            140 + (random() * 40)::int,
            10 + (random() * 10)::int,
            2 + (random() * 3)::int,
            5 + (random() * 5)::int,
            40 + (random() * 20)::int,
            200 + (random() * 100)::numeric(10,2),
            2 + (random() * 3)::int,
            94 + (random() * 4)::numeric(5,2),
            90 + (random() * 8)::numeric(5,2)
        );

        INSERT INTO daily_reports (
            location_id, report_date,
            total_conversations, ai_resolved, human_resolved, escalations,
            new_customers, total_orders, total_revenue, avg_response_time_seconds,
            customer_satisfaction, ai_resolution_rate
        ) VALUES (
            v_location2, v_date,
            80 + (random() * 30)::int,
            70 + (random() * 25)::int,
            5 + (random() * 5)::int,
            1 + (random() * 2)::int,
            3 + (random() * 3)::int,
            25 + (random() * 15)::int,
            120 + (random() * 60)::numeric(10,2),
            3 + (random() * 2)::int,
            92 + (random() * 5)::numeric(5,2),
            88 + (random() * 10)::numeric(5,2)
        );
    END LOOP;
END $$;

-- ============================================================================
-- UPDATE LOCATION METRICS
-- ============================================================================
UPDATE locations SET
    today_orders = 45,
    today_revenue = 234.50
WHERE slug = 'san-miguel-casa-matriz';

UPDATE locations SET
    today_orders = 32,
    today_revenue = 187.25
WHERE slug = 'san-miguel-gavidia';

UPDATE locations SET
    today_orders = 28,
    today_revenue = 156.00
WHERE slug = 'lourdes-colon';

UPDATE locations SET
    today_orders = 18,
    today_revenue = 98.75
WHERE slug = 'usulutan';

UPDATE locations SET
    today_orders = 21,
    today_revenue = 112.75
WHERE slug = 'santa-ana';

-- ============================================================================
-- ENHANCED SEED COMPLETE
-- ============================================================================
