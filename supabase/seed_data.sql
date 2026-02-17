-- ============================================================
-- SneakHub: SEED DATA — Productos, clientes, pedidos de ejemplo
-- Run this in the Supabase SQL Editor AFTER create_schema.sql
-- ============================================================

-- ========== 1. BRANDS (already seeded, but ensure they exist) ==========
INSERT INTO brands (id, name, slug, logo_url) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Nike', 'nike', 'https://logo.clearbit.com/nike.com'),
  ('b0000000-0000-0000-0000-000000000002', 'Adidas', 'adidas', 'https://logo.clearbit.com/adidas.com'),
  ('b0000000-0000-0000-0000-000000000003', 'Jordan', 'jordan', 'https://logo.clearbit.com/jordan.com'),
  ('b0000000-0000-0000-0000-000000000004', 'New Balance', 'new-balance', 'https://logo.clearbit.com/newbalance.com'),
  ('b0000000-0000-0000-0000-000000000005', 'Puma', 'puma', 'https://logo.clearbit.com/puma.com'),
  ('b0000000-0000-0000-0000-000000000006', 'Converse', 'converse', 'https://logo.clearbit.com/converse.com')
ON CONFLICT (slug) DO UPDATE SET
  id = EXCLUDED.id,
  logo_url = EXCLUDED.logo_url;

-- ========== 2. PRODUCTS ==========
INSERT INTO products (id, brand_id, name, slug, description, price, sale_price, category, is_featured, is_drop) VALUES
  -- Nike
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Nike Air Max 90', 'nike-air-max-90',
   'Un ícono que no pasa de moda. Amortiguación Air visible, diseño retro-futurista y comodidad superior para el día a día.',
   89990, NULL, 'Lifestyle', true, false),
  ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Nike Dunk Low Retro', 'nike-dunk-low-retro',
   'El clásico del streetwear. Cuero premium, suela vulcanizada y el estilo que definió una generación.',
   109990, 89990, 'Streetwear', true, true),
  ('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Nike Air Force 1 ''07', 'nike-air-force-1-07',
   'El original desde 1982. Cuero suave, suela AirSole y el legado que sigue marcando tendencia.',
   79990, NULL, 'Lifestyle', false, false),

  -- Jordan
  ('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', 'Air Jordan 1 Retro High OG', 'air-jordan-1-retro-high-og',
   'La zapatilla que empezó todo. Cuero premium, caña alta icónica y la silueta más reconocida del mundo.',
   149990, NULL, 'Basketball Heritage', true, true),
  ('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', 'Air Jordan 4 Retro', 'air-jordan-4-retro',
   'Diseño de Tinker Hatfield. Malla lateral, soporte en la lengüeta y la amortiguación Air que revolucionó el juego.',
   189990, 169990, 'Basketball Heritage', true, false),

  -- Adidas
  ('a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', 'Adidas Samba OG', 'adidas-samba-og',
   'De las canchas de indoor al street style. Punta de T-toe, tiras laterales y suela de goma translúcida.',
   99990, NULL, 'Retro', true, false),
  ('a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000002', 'Adidas Gazelle', 'adidas-gazelle',
   'El favorito del terrace style. Gamuza suave, perfil bajo y un diseño que trasciende décadas.',
   84990, 74990, 'Retro', false, false),

  -- New Balance
  ('a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004', 'New Balance 550', 'new-balance-550',
   'El retro basketball que conquistó el mundo. Cuero premium, suela cupsole y silueta clean.',
   109990, NULL, 'Retro Basketball', true, true),
  ('a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000004', 'New Balance 2002R', 'new-balance-2002r',
   'Tech meets heritage. ABZORB, N-ERGY y diseño premium inspirado en el running de los 2000.',
   139990, 119990, 'Running Heritage', false, false),

  -- Puma
  ('a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000005', 'Puma Suede Classic XXI', 'puma-suede-classic-xxi',
   'Nacida en la cancha, criada en la calle. Gamuza premium, formstrip icónico y medio siglo de cultura.',
   69990, NULL, 'Streetwear', false, false),

  -- Converse
  ('a0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000006', 'Chuck Taylor All Star 70 High', 'chuck-taylor-70-high',
   'La versión premium del All Star. Canvas más grueso, suela vintage y mayor amortiguación.',
   74990, NULL, 'Heritage', false, false),
  ('a0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000006', 'Converse Run Star Hike', 'converse-run-star-hike',
   'Plataforma, suela dentada y actitud. El Chuck reinventado para la nueva generación.',
   94990, 79990, 'Platform', true, false)
ON CONFLICT (slug) DO NOTHING;

-- ========== 3. PRODUCT IMAGES ==========
-- Using Unsplash images for realistic product photos. IDs updated to 'a' prefix.
INSERT INTO product_images (product_id, url, is_main, display_order) VALUES
  -- Nike Air Max 90
  ('a0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80', true, 0),
  
  -- Nike Dunk Low
  ('a0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&q=80', true, 0),

  -- Air Force 1
  ('a0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80', true, 0),

  -- Jordan 1
  ('a0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80', true, 0),
  
  -- Jordan 4
  ('a0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&q=80', true, 0),

  -- Samba
  ('a0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80', true, 0),

  -- Gazelle
  ('a0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80', true, 0),

  -- NB 550
  ('a0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80', true, 0),

  -- NB 2002R
  ('a0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', true, 0),

  -- Puma Suede
  ('a0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80', true, 0),

  -- Chuck 70
  ('a0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80', true, 0),

  -- Run Star Hike
  ('a0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80', true, 0);

-- ========== 4. PRODUCT VARIANTS (multiple sizes per product) ==========
DO $$
DECLARE
  p RECORD;
  sizes TEXT[] := ARRAY['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  s TEXT;
  stock INT;
  counter INT := 1;
BEGIN
  -- Updated prefix to 'a'
  FOR p IN SELECT id, slug FROM products WHERE id::text LIKE 'a0000000%' ORDER BY id LOOP
    FOREACH s IN ARRAY sizes LOOP
      -- Randomize stock: some sizes sold out, some low, some OK
      stock := CASE
        WHEN random() < 0.15 THEN 0        -- 15% agotado
        WHEN random() < 0.30 THEN (random() * 5)::int + 1  -- 15% stock bajo
        ELSE (random() * 30)::int + 5       -- 70% stock normal
      END;
      INSERT INTO product_variants (product_id, size, color, sku, stock_quantity)
      VALUES (p.id, s, 'Default', 'SKU-' || LPAD(counter::text, 4, '0'), stock)
      ON CONFLICT DO NOTHING;
      counter := counter + 1;
    END LOOP;
  END LOOP;
END $$;

-- ========== 5. SAMPLE CUSTOMERS (profiles) ==========
-- Note: These are profiles WITHOUT matching auth.users entries.
-- They'll show up in customer lists but can't log in.
-- For the CMS demo this is fine.
INSERT INTO profiles (id, role, full_name, phone, shipping_address) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'customer', 'Valentina García', '+56 9 1234 5678',
   '{"line1": "Av. Providencia 1234", "city": "Santiago", "state": "RM", "zip": "7500000", "country": "Chile"}'),
  ('c0000000-0000-0000-0000-000000000002', 'customer', 'Matías Rodríguez', '+56 9 8765 4321',
   '{"line1": "Calle Valparaíso 567", "city": "Viña del Mar", "state": "Valparaíso", "zip": "2520000", "country": "Chile"}'),
  ('c0000000-0000-0000-0000-000000000003', 'customer', 'Sofía Martínez', '+56 9 5555 1234',
   '{"line1": "Los Leones 890", "city": "Santiago", "state": "RM", "zip": "7500000", "country": "Chile"}'),
  ('c0000000-0000-0000-0000-000000000004', 'customer', 'Sebastián López', '+56 9 9999 8888',
   '{"line1": "Macul 456", "city": "Santiago", "state": "RM", "zip": "7810000", "country": "Chile"}'),
  ('c0000000-0000-0000-0000-000000000005', 'customer', 'Camila Hernández', '+56 9 7777 6666',
   '{"line1": "Simón Bolívar 123", "city": "Concepción", "state": "Biobío", "zip": "4030000", "country": "Chile"}')
ON CONFLICT (id) DO NOTHING;

-- ========== 6. SAMPLE ORDERS ==========
INSERT INTO orders (id, user_id, status, total_amount, payment_id, shipping_details, created_at) VALUES
  -- Entregado (hace 5 días)
  ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'delivered', 199980, 'PAY-001-DEMO',
   '{"line1": "Av. Providencia 1234", "city": "Santiago", "state": "RM", "zip": "7500000", "country": "Chile"}',
   NOW() - INTERVAL '5 days'),

  -- Enviado (hace 2 días)
  ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'shipped', 109990, 'PAY-002-DEMO',
   '{"line1": "Calle Valparaíso 567", "city": "Viña del Mar", "state": "Valparaíso", "zip": "2520000", "country": "Chile"}',
   NOW() - INTERVAL '2 days'),

  -- En proceso (ayer)
  ('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'processing', 289980, 'PAY-003-DEMO',
   '{"line1": "Los Leones 890", "city": "Santiago", "state": "RM", "zip": "7500000", "country": "Chile"}',
   NOW() - INTERVAL '1 day'),

  -- Pagado (hoy)
  ('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'paid', 149990, 'PAY-004-DEMO',
   '{"line1": "Macul 456", "city": "Santiago", "state": "RM", "zip": "7810000", "country": "Chile"}',
   NOW() - INTERVAL '6 hours'),

  -- Pendiente (hace 3 horas)
  ('e0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 'pending', 84990, NULL,
   '{"line1": "Simón Bolívar 123", "city": "Concepción", "state": "Biobío", "zip": "4030000", "country": "Chile"}',
   NOW() - INTERVAL '3 hours'),

  -- Cancelado (hace 4 días)
  ('e0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'cancelled', 79990, NULL,
   '{"line1": "Av. Providencia 1234", "city": "Santiago", "state": "RM", "zip": "7500000", "country": "Chile"}',
   NOW() - INTERVAL '4 days'),

  -- Entregado viejo (hace 10 días)
  ('e0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003', 'delivered', 189980, 'PAY-007-DEMO',
   '{"line1": "Los Leones 890", "city": "Santiago", "state": "RM", "zip": "7500000", "country": "Chile"}',
   NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- ========== 7. ORDER ITEMS ==========
-- Get some random variant IDs for order items
DO $$
DECLARE
  v1 UUID; v2 UUID; v3 UUID; v4 UUID; v5 UUID; v6 UUID; v7 UUID; v8 UUID;
BEGIN
  -- Updated IDs to 'a' prefix
  SELECT id INTO v1 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000001' AND size = '42' LIMIT 1;
  SELECT id INTO v2 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000002' AND size = '40' LIMIT 1;
  SELECT id INTO v3 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000004' AND size = '43' LIMIT 1;
  SELECT id INTO v4 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000006' AND size = '39' LIMIT 1;
  SELECT id INTO v5 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000008' AND size = '41' LIMIT 1;
  SELECT id INTO v6 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000003' AND size = '44' LIMIT 1;
  SELECT id INTO v7 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000005' AND size = '42' LIMIT 1;
  SELECT id INTO v8 FROM product_variants WHERE product_id = 'a0000000-0000-0000-0000-000000000007' AND size = '40' LIMIT 1;

  -- Order 1: 2 items (Air Max 90 + Dunk Low)
  INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES
    ('e0000000-0000-0000-0000-000000000001', v1, 1, 89990),
    ('e0000000-0000-0000-0000-000000000001', v2, 1, 109990);

  -- Order 2: 1 item (Dunk Low on sale)
  INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES
    ('e0000000-0000-0000-0000-000000000002', v2, 1, 109990);

  -- Order 3: 2 items (Jordan 1 + Samba)
  INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES
    ('e0000000-0000-0000-0000-000000000003', v3, 1, 149990),
    ('e0000000-0000-0000-0000-000000000003', v4, 1, 99990);

  -- Order 4: Jordan 1
  INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES
    ('e0000000-0000-0000-0000-000000000004', v3, 1, 149990);

  -- Order 5: Gazelle
  INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES
    ('e0000000-0000-0000-0000-000000000005', v8, 1, 84990);

  -- Order 6: Air Force 1
  INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES
    ('e0000000-0000-0000-0000-000000000006', v6, 1, 79990);

  -- Order 7: Jordan 4 + NB 550
  INSERT INTO order_items (order_id, variant_id, quantity, unit_price) VALUES
    ('e0000000-0000-0000-0000-000000000007', v7, 1, 189990),
    ('e0000000-0000-0000-0000-000000000007', v5, 1, 109990);
END $$;

-- ============================================================
SELECT '✅ SEED DATA LOADED!' AS result;
SELECT '12 productos, 120 variantes, 6 marcas, 5 clientes, 7 pedidos' AS result;
-- ============================================================
