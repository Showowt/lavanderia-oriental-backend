-- ============================================================================
-- LAVANDERÍA ORIENTAL - SEED DATA
-- Initial data population for PostgreSQL / Supabase
-- ============================================================================

-- ============================================================================
-- LOCATIONS (5 Active Branches in El Salvador)
-- ============================================================================
INSERT INTO locations (name, slug, address, city, phone, whatsapp, is_headquarters, status, delivery_available, delivery_zone, hours_monday, hours_tuesday, hours_wednesday, hours_thursday, hours_friday, hours_saturday, hours_sunday, latitude, longitude, is_active) VALUES
-- Casa Matriz - San Miguel
('Casa Matriz San Miguel', 'san-miguel-casa-matriz', 'Col. Ciudad Real Calle Elizabeth, San Miguel', 'San Miguel', '+503 2660-0001', '+503 7947-5950', TRUE, 'active', TRUE, 'Área metropolitana de San Miguel', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-5:00pm', 13.4833, -88.1833, TRUE),

-- San Miguel Col. Gavidia
('San Miguel Col. Gavidia', 'san-miguel-gavidia', 'Col. Gavidia 10 av norte, San Miguel', 'San Miguel', '+503 2660-0002', '+503 7947-5950', FALSE, 'active', TRUE, 'Área metropolitana de San Miguel', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-5:00pm', 13.4850, -88.1820, TRUE),

-- Lourdes Colón
('Lourdes Colón', 'lourdes-colon', '7av calle oriente atrás de Metrocentro Lourdes Colón', 'Lourdes Colón', '+503 2660-0003', '+503 7947-5950', FALSE, 'active', TRUE, 'Área metropolitana', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-5:00pm', 13.7167, -89.2667, TRUE),

-- Usulután
('Usulután', 'usulutan', 'Calle Dr. Federico Penado, Parada de los Pinos', 'Usulután', '+503 2660-0004', '+503 7947-5950', FALSE, 'active', FALSE, NULL, '7:00am-5:00pm', '7:00am-5:00pm', '7:00am-5:00pm', '7:00am-5:00pm', '7:00am-5:00pm', '7:00am-5:00pm', '7:00am-5:00pm', 13.3500, -88.4500, TRUE),

-- Santa Ana
('Santa Ana', 'santa-ana', '25 calle pte Plaza Lily, cuadra atrás de las oficinas de la PNC', 'Santa Ana', '+503 2660-0005', '+503 7947-5950', FALSE, 'active', TRUE, 'Área metropolitana de Santa Ana', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', '7:00am-6:00pm', 13.9950, -89.5600, TRUE),

-- La Unión (Próximamente)
('La Unión', 'la-union', 'Próximamente', 'La Unión', '+503 2660-0006', '+503 7947-5950', FALSE, 'coming_soon', FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13.3333, -87.8500, FALSE),

-- San Salvador Colonia Layco (Próximamente)
('San Salvador Colonia Layco', 'san-salvador-layco', '25 calle y 21 avenida norte, Colonia Layco', 'San Salvador', '+503 2660-0007', '+503 7947-5950', FALSE, 'coming_soon', TRUE, 'Área metropolitana San Salvador', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 13.7000, -89.2000, FALSE);

-- ============================================================================
-- SERVICE CATEGORIES
-- ============================================================================
INSERT INTO service_categories (name, slug, description, icon, display_order, is_active) VALUES
('Lavado General', 'lavado-general', 'Servicios de lavado por libra y cargas', '🧺', 1, TRUE),
('Edredones y Cama', 'edredones-cama', 'Lavado de edredones, cobijas y ropa de cama', '🛏️', 2, TRUE),
('DRIP Zapatos', 'drip-zapatos', 'Lavado profesional de zapatos y gorras', '👟', 3, TRUE),
('Extras y Aditivos', 'extras-aditivos', 'Detergentes, suavizantes y tratamientos especiales', '✨', 4, TRUE),
('Delivery', 'delivery', 'Servicio de recogida y entrega a domicilio', '🚗', 5, TRUE);

-- ============================================================================
-- SERVICES (Full Pricing Catalog)
-- ============================================================================

-- Get category IDs (will use subqueries)
-- Lavado General
INSERT INTO services (category_id, name, slug, name_en, description, price, price_lavado, price_lavado_secado, price_secado, unit, display_order, is_active) VALUES
((SELECT id FROM service_categories WHERE slug = 'lavado-general'), 'Carga Normal', 'carga-normal', 'Normal Load', 'Lavado y/o secado de ropa normal', 3.00, 3.00, 5.50, 3.00, 'carga', 1, TRUE),
((SELECT id FROM service_categories WHERE slug = 'lavado-general'), 'Carga Pesada', 'carga-pesada', 'Heavy Load', 'Lavado y/o secado de cargas pesadas', 3.50, 3.50, 6.50, 3.50, 'carga', 2, TRUE),
((SELECT id FROM service_categories WHERE slug = 'lavado-general'), 'Combo Ropa de Cama', 'combo-ropa-cama', 'Bedding Combo', 'Lavado y secado de sábanas y fundas', 6.50, 0, 6.50, 0, 'combo', 3, TRUE),
((SELECT id FROM service_categories WHERE slug = 'lavado-general'), 'Prelavado', 'prelavado', 'Pre-wash', 'Prelavado para manchas difíciles', 3.00, 3.00, 0, 0, 'carga', 4, TRUE);

-- Edredones
INSERT INTO services (category_id, name, slug, name_en, description, price, price_lavado_secado, unit, display_order, is_active) VALUES
((SELECT id FROM service_categories WHERE slug = 'edredones-cama'), 'Edredón 1.20-1.40m', 'edredon-pequeno', 'Small Comforter', 'Edredón pequeño', 6.50, 6.50, 'pieza', 1, TRUE),
((SELECT id FROM service_categories WHERE slug = 'edredones-cama'), 'Edredón 1.60m', 'edredon-mediano', 'Medium Comforter', 'Edredón mediano', 7.50, 7.50, 'pieza', 2, TRUE),
((SELECT id FROM service_categories WHERE slug = 'edredones-cama'), 'Edredón 2.00m', 'edredon-grande', 'Large Comforter', 'Edredón grande', 8.50, 8.50, 'pieza', 3, TRUE),
((SELECT id FROM service_categories WHERE slug = 'edredones-cama'), 'Edredón Extra Grande', 'edredon-xl', 'XL Comforter', 'Edredón extra grande', 9.50, 9.50, 'pieza', 4, TRUE),
((SELECT id FROM service_categories WHERE slug = 'edredones-cama'), 'Solo Lavado Grande', 'edredon-solo-lavado', 'Large Wash Only', 'Solo lavado de edredón grande', 4.50, 0, 'pieza', 5, TRUE);

-- DRIP Zapatos
INSERT INTO services (category_id, name, slug, name_en, description, price, unit, display_order, is_active) VALUES
((SELECT id FROM service_categories WHERE slug = 'drip-zapatos'), 'DRIP Básico', 'drip-basico', 'Basic DRIP', 'Limpieza básica de zapatos', 9.90, 'par', 1, TRUE),
((SELECT id FROM service_categories WHERE slug = 'drip-zapatos'), 'DRIP Especial', 'drip-especial', 'Special DRIP', 'Limpieza especial con tratamiento', 12.90, 'par', 2, TRUE),
((SELECT id FROM service_categories WHERE slug = 'drip-zapatos'), 'DRIP Premium', 'drip-premium', 'Premium DRIP', 'Limpieza premium completa', 16.90, 'par', 3, TRUE),
((SELECT id FROM service_categories WHERE slug = 'drip-zapatos'), 'DRIP Niños', 'drip-ninos', 'Kids DRIP', 'Limpieza de zapatos infantiles', 5.90, 'par', 4, TRUE),
((SELECT id FROM service_categories WHERE slug = 'drip-zapatos'), 'DRIP Shine', 'drip-shine', 'DRIP Shine', 'Brillo y acabado profesional', 9.90, 'par', 5, TRUE),
((SELECT id FROM service_categories WHERE slug = 'drip-zapatos'), 'DRIP Gorras', 'drip-gorras', 'DRIP Caps', 'Lavado de gorras', 4.90, 'pieza', 6, TRUE);

-- Extras y Aditivos
INSERT INTO services (category_id, name, slug, name_en, description, price, unit, display_order, is_active) VALUES
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Detergente Líquido', 'detergente-liquido', 'Liquid Detergent', 'Porción de detergente líquido', 0.35, 'porción', 1, TRUE),
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Suavizante', 'suavizante', 'Fabric Softener', 'Porción de suavizante', 0.35, 'porción', 2, TRUE),
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Tide Detergente', 'tide', 'Tide Detergent', 'Detergente Tide premium', 0.50, 'porción', 3, TRUE),
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Oxy Líquido/Polvo', 'oxy', 'Oxy Liquid/Powder', 'Quitamanchas con oxígeno', 0.50, 'porción', 4, TRUE),
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Quita Manchas', 'quita-manchas', 'Stain Remover', 'Tratamiento quitamanchas', 0.50, 'porción', 5, TRUE),
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Downy Perlas Aromáticas', 'downy-perlas', 'Downy Scent Beads', 'Perlas de aroma Downy', 0.65, 'porción', 6, TRUE),
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Vanish', 'vanish', 'Vanish', 'Tratamiento Vanish', 0.75, 'porción', 7, TRUE),
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Tide+Oxy Perla Grande', 'tide-oxy-grande', 'Tide+Oxy Large', 'Perla grande Tide con Oxy', 1.00, 'porción', 8, TRUE),
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Enjuague', 'enjuague', 'Rinse', 'Ciclo de enjuague adicional', 1.50, 'ciclo', 9, TRUE),
((SELECT id FROM service_categories WHERE slug = 'extras-aditivos'), 'Tratamiento Blanqueador', 'blanqueador', 'Bleach Treatment', 'Tratamiento blanqueador', 1.50, 'tratamiento', 10, TRUE);

-- Delivery
INSERT INTO services (category_id, name, slug, name_en, description, price, unit, display_order, is_active) VALUES
((SELECT id FROM service_categories WHERE slug = 'delivery'), 'Retiro a Domicilio', 'retiro-domicilio', 'Pickup', 'Recogida de ropa a domicilio', 1.00, 'viaje', 1, TRUE),
((SELECT id FROM service_categories WHERE slug = 'delivery'), 'Entrega a Domicilio', 'entrega-domicilio', 'Delivery', 'Entrega de ropa a domicilio', 1.00, 'viaje', 2, TRUE),
((SELECT id FROM service_categories WHERE slug = 'delivery'), 'Delivery Completo', 'delivery-completo', 'Full Delivery', 'Retiro y entrega a domicilio', 2.00, 'ida-vuelta', 3, TRUE);

-- ============================================================================
-- KNOWLEDGE BASE (FAQ for AI)
-- ============================================================================
INSERT INTO knowledge_base (question, answer, keywords, category, language, priority, is_active) VALUES
-- Precios
('¿Cuál es el precio del lavado?', 'Nuestros precios son:\n- Carga Normal: $3 lavado / $5.50 lavado+secado\n- Carga Pesada: $3.50 lavado / $6.50 lavado+secado\n\n¿En qué sucursal te queda más cerca?', ARRAY['precio', 'costo', 'cuanto', 'lavado'], 'precios', 'es', 10, TRUE),
('¿Cuánto cuesta el delivery?', 'El delivery tiene un costo de $2 total (retiro + entrega a domicilio).\n\nTenemos delivery disponible en San Miguel, Lourdes Colón y Santa Ana.', ARRAY['delivery', 'domicilio', 'costo', 'precio'], 'precios', 'es', 9, TRUE),
('¿Cuánto cuesta lavar edredones?', 'Lavamos edredones:\n- 1.20-1.40m: $6.50\n- 1.60m: $7.50\n- 2.00m: $8.50\n- Extra Grande: $9.50\n\n¿Qué tamaño necesitas lavar?', ARRAY['edredon', 'cobija', 'cama', 'precio'], 'precios', 'es', 8, TRUE),
('¿Cuánto cuesta lavar zapatos?', 'Tenemos el servicio DRIP para zapatos:\n- DRIP Básico: $9.90\n- DRIP Especial: $12.90\n- DRIP Premium: $16.90\n- Niños: $5.90\n- Gorras: $4.90', ARRAY['zapatos', 'tenis', 'drip', 'precio'], 'precios', 'es', 8, TRUE),

-- Sucursales
('¿Dónde están ubicados?', 'Tenemos sucursales activas en:\n- San Miguel (Casa Matriz y Col. Gavidia)\n- Lourdes Colón\n- Usulután\n- Santa Ana\n\n¿Cuál te queda más cerca?', ARRAY['ubicacion', 'direccion', 'donde', 'sucursal'], 'ubicaciones', 'es', 10, TRUE),
('¿Cuál es el horario de atención?', 'La mayoría de nuestras sucursales abren de 7am a 6pm de lunes a sábado, y domingos hasta las 5pm.\n\n¿Cuál sucursal te interesa? Te confirmo el horario exacto.', ARRAY['horario', 'hora', 'abre', 'cierra'], 'horarios', 'es', 9, TRUE),

-- Servicios
('¿Tienen servicio de delivery?', '¡Sí hacemos delivery!\n\nEl servicio cuesta $2 total (retiro + entrega).\n\nTenemos delivery disponible en:\n- San Miguel (área metropolitana)\n- Lourdes Colón (área metropolitana)\n- Santa Ana (área metropolitana)', ARRAY['delivery', 'domicilio', 'entrega', 'recogida'], 'servicios', 'es', 10, TRUE),
('¿Cuánto tiempo tardan?', 'El tiempo estándar de entrega es de 24-48 horas.\n\nPuede variar según temporada y sucursal. ¿En qué sucursal necesitas el servicio?', ARRAY['tiempo', 'demora', 'cuando', 'lista'], 'servicios', 'es', 8, TRUE),

-- Políticas
('¿Qué métodos de pago aceptan?', 'Aceptamos:\n- Efectivo\n- Tarjeta de crédito/débito\n- Transferencia bancaria\n\n¿Algo más en que pueda ayudarte?', ARRAY['pago', 'tarjeta', 'efectivo', 'transferencia'], 'pagos', 'es', 7, TRUE),
('¿Qué pasa si mi ropa se daña?', 'Hacemos todo lo posible para cuidar tu ropa. Los reclamos se resuelven con créditos para tu siguiente visita.\n\nSi tienes algún problema, con gusto te atendemos.', ARRAY['daño', 'reclamo', 'queja', 'roto'], 'politicas', 'es', 6, TRUE),

-- English
('What are your prices?', 'Our prices:\n- Normal Load: $3 wash / $5.50 wash+dry\n- Heavy Load: $3.50 wash / $6.50 wash+dry\n\nWhich location is closest to you?', ARRAY['price', 'cost', 'how much'], 'pricing', 'en', 10, TRUE),
('Where are you located?', 'We have locations in:\n- San Miguel (Headquarters & Col. Gavidia)\n- Lourdes Colón\n- Usulután\n- Santa Ana\n\nWhich is closest to you?', ARRAY['location', 'address', 'where'], 'locations', 'en', 10, TRUE);

-- ============================================================================
-- SAMPLE CUSTOMERS (Demo Data)
-- ============================================================================
INSERT INTO customers (phone, name, email, language, total_orders, is_vip, last_contact) VALUES
('+503 7890-1234', 'María García', 'maria.garcia@email.com', 'es', 15, TRUE, NOW()),
('+503 7890-5678', 'Carlos Hernández', 'carlos.h@email.com', 'es', 8, FALSE, NOW() - INTERVAL '1 day'),
('+503 7890-9012', 'Ana Martínez', 'ana.martinez@email.com', 'es', 22, TRUE, NOW() - INTERVAL '2 days'),
('+503 7890-3456', 'José López', 'jose.lopez@email.com', 'es', 5, FALSE, NOW() - INTERVAL '3 days'),
('+503 7890-7890', 'Rosa Pérez', 'rosa.perez@email.com', 'es', 30, TRUE, NOW() - INTERVAL '12 hours');

-- ============================================================================
-- SYSTEM CONFIG (Default Settings)
-- ============================================================================
INSERT INTO system_config (key, value, description) VALUES
('ai_enabled', 'true', 'Enable/disable AI responses'),
('business_hours', '{"start": "07:00", "end": "18:00"}', 'Default business hours'),
('response_delay_ms', '1000', 'Delay before sending AI response'),
('max_conversation_history', '20', 'Max messages to include in AI context'),
('escalation_keywords', '["queja", "reclamo", "daño", "gerente", "encargado"]', 'Keywords that trigger escalation'),
('whatsapp_business_number', '+503 7947-5950', 'Main WhatsApp Business number'),
('brand_name', 'Lavandería Oriental', 'Business name'),
('brand_slogan', 'Lavar tu ropa nunca fue tan fácil', 'Brand tagline');

-- ============================================================================
-- SEED COMPLETE
-- ============================================================================
